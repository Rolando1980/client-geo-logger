import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Users, ClipboardCheck, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import PageTransition from "@/components/PageTransition";
import { database } from "@/firebase/config";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { format } from "date-fns";

type Visit = {
  id?: string;
  status?: string;
  createdAt?: string;
  clientName?: string;
  date?: string;
  type?: string;
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalVisits: 0,
    pendingVisits: 0,
    visitsToday: 0,
    visitsThisMonth: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Visit[]>([]);

  useEffect(() => {
  if (!user) {
    navigate("/");
    return;
  }
  
  // Consulta para clientes filtrada por userId
  const clientsQuery = query(
    ref(database, "clients"),
    orderByChild("userId"),
    equalTo(user.uid)
  );
  
  get(clientsQuery)
    .then((snapshot) => {
      const clientsData = snapshot.val();
      const totalClients = clientsData ? Object.keys(clientsData).length : 0;
      setStats((prev) => ({ ...prev, totalClients }));
    })
    .catch((error) => {
      console.error("Error fetching clients:", error);
    });

  // Consulta para visitas filtrada por userId
  const visitsQuery = query(
    ref(database, "visits"),
    orderByChild("userId"),
    equalTo(user.uid)
  );

  get(visitsQuery)
    .then((snapshot) => {
      const visitsData = snapshot.val();
      console.log("Datos de visitas filtrados:", snapshot.val());
      const allVisits = visitsData ? (Object.values(visitsData) as Visit[]) : [];
      console.log("Visitas convertidas en array (get):", allVisits);
      const totalVisits = allVisits.length;
      console.log("Total de visitas (get):", totalVisits);
      const pendingVisits = allVisits.filter((visit) => visit.status === "pending").length;

      const todayStr = format(new Date(), "yyyy-MM-dd");
      const currentMonthStr = format(new Date(), "yyyy-MM");

      const visitsToday = allVisits.filter(
        (visit) => visit.createdAt && visit.createdAt.startsWith(todayStr)
      ).length;

      const visitsThisMonth = allVisits.filter(
        (visit) => visit.createdAt && visit.createdAt.startsWith(currentMonthStr)
      ).length;

      setStats((prev) => ({
        ...prev,
        totalVisits,
        pendingVisits,
        visitsToday,
        visitsThisMonth,
      }));

      const sortedActivities = allVisits
        .sort((a, b) => {
          const timeA = new Date(a.createdAt || 0).getTime();
          const timeB = new Date(b.createdAt || 0).getTime();
          return timeB - timeA;
        })
        .slice(0, 3);
      setRecentActivity(sortedActivities);
    })
    .catch((error) => {
      console.error("Error fetching visits:", error);
    });
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
              {/* Tarjeta Clientes */}
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

              {/* Tarjeta Visitas Totales */}
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

          {/* Sección para visitas por día y visitas por mes */}
          <section className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              {/* Tarjeta Visitas Hoy */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <Card className="bg-white/90 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-brand-gray text-sm">Visitas Hoy</p>
                        <h3 className="text-2xl font-semibold">{stats.visitsToday}</h3>
                      </div>
                      <div className="bg-brand-yellow/20 p-2 rounded-full">
                        <Calendar className="text-brand-yellow" size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tarjeta Visitas Este Mes */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <Card className="bg-white/90 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-brand-gray text-sm">Visitas Este Mes</p>
                        <h3 className="text-2xl font-semibold">{stats.visitsThisMonth}</h3>
                      </div>
                      <div className="bg-brand-yellow/20 p-2 rounded-full">
                        <Calendar className="text-brand-yellow" size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                  key={activity.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Card className="mb-3 bg-white/90 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="mr-3">
                          {getIcon(activity.type || "visit")}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.clientName}</p>
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
