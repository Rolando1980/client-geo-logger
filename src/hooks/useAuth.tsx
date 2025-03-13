import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { auth, database } from '@/firebase/config';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { ref, set, get } from "firebase/database";

interface User {
  email: string;
  uid: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFirebaseError = (error: any) => {
    let message = 'Error desconocido';
    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Correo electrónico inválido';
        break;
      case 'auth/user-not-found':
        message = 'Usuario no registrado';
        break;
      case 'auth/wrong-password':
        message = 'Contraseña incorrecta';
        break;
      case 'auth/email-already-in-use':
        message = 'El correo ya está registrado';
        break;
      case 'auth/weak-password':
        message = 'La contraseña debe tener al menos 6 caracteres';
        break;
    }
    
    toast({
      title: "Error de autenticación",
      description: message,
      variant: "destructive",
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const snapshot = await get(ref(database, `users/${firebaseUser.uid}`));
          const userData = snapshot.val();
          
          setUser({
            email: firebaseUser.email || '',
            uid: firebaseUser.uid,
            createdAt: userData?.createdAt
          });
        } catch (error) {
          handleFirebaseError(error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        const snapshot = await get(ref(database, `users/${userCredential.user.uid}`));
        const userData = snapshot.val();
        
        setUser({
          email: userCredential.user.email || '',
          uid: userCredential.user.uid,
          createdAt: userData?.createdAt
        });
        
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido de nuevo",
        });
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      handleFirebaseError(error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        await set(ref(database, `users/${userCredential.user.uid}`), {
          email: email,
          createdAt: new Date().toISOString()
        });

        setUser({
          email: userCredential.user.email || '',
          uid: userCredential.user.uid
        });
        
        toast({
          title: "Registro exitoso",
          description: "Cuenta creada correctamente",
        });
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      handleFirebaseError(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/');
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error: any) {
      handleFirebaseError(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};