import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-brand-gray-light flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-4"
          >
            <img 
              src="https://ememsa.com/wp-content/uploads/2020/02/logo-ememsa-1.png" 
              alt="EMEMSA Logo" 
              className="h-24 w-auto" 
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-brand-gray mt-2"
          >
            Gestiona tus clientes y visitas de forma eficiente
          </motion.p>
        </motion.div>

        <AuthForm onLogin={login} onRegister={register} />
      </div>
    </div>
  );
};

export default Index;