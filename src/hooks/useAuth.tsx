
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

interface User {
  email: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simular verificación de autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Simular autenticación - reemplazar con Firebase
      // Esto es solo para demostración
      const mockUser = { email, id: 'user-123' };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de nuevo",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error de inicio de sesión",
        description: "Credenciales incorrectas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Simular registro - reemplazar con Firebase
      const mockUser = { email, id: 'user-' + Date.now() };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast({
        title: "Registro exitoso",
        description: "Cuenta creada correctamente",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Register error:', error);
      toast({
        title: "Error de registro",
        description: "No se pudo crear la cuenta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
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
