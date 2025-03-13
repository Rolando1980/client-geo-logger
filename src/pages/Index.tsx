
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
            <div className="w-20 h-20 rounded-full bg-brand-yellow flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 text-black"
              >
                <path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.4 2.865 8.136 6.838 9.503.5.092.678-.214.678-.479 0-.236-.01-1.017-.015-1.845-2.782.602-3.37-1.168-3.37-1.168-.455-1.156-1.11-1.464-1.11-1.464-.91-.618.068-.608.068-.608 1.003.07 1.532 1.03 1.532 1.03.891 1.529 2.341 1.089 2.91.832.09-.645.349-1.086.634-1.336-2.22-.253-4.555-1.112-4.555-4.944 0-1.093.39-1.987 1.03-2.685-.103-.254-.447-1.274.097-2.654 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 10 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.38.202 2.4.1 2.654.64.698 1.028 1.592 1.028 2.685 0 3.84-2.337 4.687-4.565 4.935.359.307.679.917.679 1.852 0 1.335-.012 2.415-.012 2.741 0 .267.18.575.687.478C21.137 18.131 24 14.395 24 10c0-5.523-4.477-10-10-10z" />
              </svg>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl md:text-3xl font-semibold"
          >
            Visitas App
          </motion.h1>
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
