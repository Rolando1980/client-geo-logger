
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, MapPin, Users, ClipboardCheck, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import PageTransition from "@/components/PageTransition";

// Datos ficticios
const mockStats = {
  totalClients: 12,
  totalVisits: 24,
  pendingVisits: 5,
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(mockStats);
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: "visit", client: "Empresa A", date: "Hoy, 10:30 AM" },
    { id: 2, type: "client", client: "Empresa B", date: "Ayer, 15:45 PM" },
    { id: 3, type: "visit", client: "Empresa C", date: "22/06/2023, 09:15 AM" },
  ]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const navigateToNewVisit = () => {
    navigate("/visit");
  };

  const navigateToClients = () => {
    navigate("/clients");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "visit":
        return <ClipboardCheck size={16} className="text-green-500" />;
      case "client":
        return <Users size={16} className="text-blue-500" />;
      default:
        return <Calendar size={16} />;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pb-20 bg-gradient-to-b from-white to-brand-gray-light/30">
        <div className="page-container">
          <header className="mb-6 pt-6">
            <motion.h1 
              className="text-2xl font-bold"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Bienvenido{user ? `, ${user.email.split('@')[0]}` : ''}
            </motion.h1>
            <motion.p 
              className="text-brand-gray"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              Gestiona tus clientes y visitas
            </motion.p>
          </header>

          <section className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <Card className="bg-white/90 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-brand-gray text-sm">Clientes</p>
                        <h3 className="text-2xl font-semibold">{stats.totalClients}</h3>
                      </div>
                      <div className="bg-brand-yellow/20 p-2 rounded-full">
                        <Users className="text-brand-yellow" size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <Card className="bg-white/90 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-brand-gray text-sm">Visitas</p>
                        <h3 className="text-2xl font-semibold">{stats.totalVisits}</h3>
                      </div>
                      <div className="bg-brand-yellow/20 p-2 rounded-full">
                        <ClipboardCheck className="text-brand-yellow" size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Acciones Rápidas</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <Button
                  onClick={navigateToNewVisit}
                  className="w-full h-20 bg-brand-yellow text-black hover:brightness-110 flex flex-col items-center justify-center gap-1 rounded-xl"
                >
                  <ClipboardCheck size={24} />
                  <span>Nueva Visita</span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <Button
                  onClick={navigateToClients}
                  className="w-full h-20 bg-white text-black hover:bg-brand-gray-light flex flex-col items-center justify-center gap-1 border border-brand-gray-light rounded-xl"
                >
                  <Users size={24} />
                  <span>Ver Clientes</span>
                </Button>
              </motion.div>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Actividad Reciente</h2>
            </div>
            
            <AnimatePresence>
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Card className="mb-3 bg-white/90 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="mr-3">
                          {getIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.client}</p>
                          <p className="text-xs text-brand-gray">{activity.date}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </section>
        </div>
        
        <Navbar />
      </div>
    </PageTransition>
  );
};

export default Dashboard;
