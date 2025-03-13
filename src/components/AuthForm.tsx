
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthFormProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string) => void;
}

const AuthForm = ({ onLogin, onRegister }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos incompletos",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      });
      return;
    }
    
    if (isLogin) {
      onLogin(email, password);
    } else {
      onRegister(email, password);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md glass-card">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? "Ingresa tus credenciales para continuar"
              : "Crea una nueva cuenta para comenzar"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <Label htmlFor="email" className="form-label">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-gray" size={18} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10"
                  placeholder="tu@correo.com"
                />
              </div>
            </div>
            <div className="form-group">
              <Label htmlFor="password" className="form-label">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-gray" size={18} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-gray"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-brand-yellow text-black hover:brightness-110">
              {isLogin ? "Iniciar Sesión" : "Registrarse"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand-gray"
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AuthForm;
