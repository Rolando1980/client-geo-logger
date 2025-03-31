import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Users, ClipboardCheck, Calendar, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import PageTransition from "@/components/PageTransition";
import { database } from "@/firebase/config";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, parseISO } from "date-fns";
import VisitsChart from "@/components/VisitsChart";
import LocationMapMultiple from "@/components/LocationMapMultiple";

type Visit = {
  id?: string;
  status?: string;
  createdAt?: string;
  clientName?: string;
  date?: string;
  time?: string;
  type?: string;
  latitude: number;
  longitude: number;
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
  const [visitsByDay, setVisitsByDay] = useState<any[]>([]);
  const [todayVisitsList, setTodayVisitsList] = useState<Visit[]>([]);
  const [monthlyVisits, setMonthlyVisits] = useState<Visit[]>([]);
  const [showTodayModal, setShowTodayModal] = useState(false);

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
        console.log("Datos de visitas filtrados:", visitsData);
        const allVisits = visitsData ? (Object.values(visitsData) as Visit[]) : [];
        console.log("Visitas convertidas en array (get):", allVisits);
        const totalVisits = allVisits.length;
        const pendingVisits = allVisits.filter((visit) => visit.status === "pending").length;

        const todayStr = format(new Date(), "yyyy-MM-dd");
        const currentMonthStr = format(new Date(), "yyyy-MM");

        // Filtrar visitas de hoy
        const visitsTodayArr = allVisits.filter(
          (visit) => visit.createdAt && visit.createdAt.startsWith(todayStr)
        );
        const visitsTodayCount = visitsTodayArr.length;

        // Filtrar visitas del mes actual
        const visitsMonthArr = allVisits.filter(
          (visit) => visit.createdAt && visit.createdAt.startsWith(currentMonthStr)
        );
        const visitsThisMonth = visitsMonthArr.length;

        setStats((prev) => ({
          ...prev,
          totalVisits,
          pendingVisits,
          visitsToday: visitsTodayCount,
          visitsThisMonth,
        }));

        setTodayVisitsList(visitsTodayArr);
        setMonthlyVisits(visitsMonthArr);

        // Procesar datos para el gráfico de visitas por día
        processVisitsByDay(allVisits);

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

  const processVisitsByDay = (visits: Visit[]) => {
    const today = new Date();
    const firstDay = startOfMonth(today);
    const lastDay = endOfMonth(today);
    
    const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
    
    const dailyVisits = daysInMonth.map(day => ({
      date: format(day, "yyyy-MM-dd"),
      count: 0
    }));
    
    visits.forEach(visit => {
      if (visit.createdAt) {
        const visitDate = parseISO(visit.createdAt);
        if (isWithinInterval(visitDate, { start: firstDay, end: lastDay })) {
          const dateStr = format(visitDate, "yyyy-MM-dd");
          const dayIndex = dailyVisits.findIndex(d => d.date === dateStr);
          if (dayIndex !== -1) {
            dailyVisits[dayIndex].count++;
          }
        }
      }
    });
    
    console.log("Datos diarios del mes actual:", dailyVisits);
    setVisitsByDay(dailyVisits);
  };

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
                <Card 
                  className="bg-white/90 shadow-md cursor-pointer"
                  onClick={() => setShowTodayModal(true)}
                >
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
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <p className="text-brand-gray text-sm">Visitas Este Mes</p>
                          <h3 className="text-2xl font-semibold">{stats.visitsThisMonth}</h3>
                        </div>
                        <div className="bg-brand-yellow/20 p-2 rounded-full">
                          <TrendingUp className="text-brand-yellow" size={20} />
                        </div>
                      </div>
                      <div className="mt-auto h-[80px]">
                        <VisitsChart visitsByDay={visitsByDay} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Nueva sección: Mapa de Visitas del Mes */}
          <section className="mb-8">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Mapa de Visitas del Mes</h2>
              <LocationMapMultiple 
                visits={monthlyVisits.map((visit) => ({
                  id: visit.id,
                  clientName: visit.clientName,
                  date: visit.date || visit.createdAt || "",
                  time: visit.time || "",
                  latitude: visit.latitude,
                  longitude: visit.longitude,
                }))}
              />
            </div>
          </section>
        </div>
        <Navbar />
      </div>

      {/* Modal para mostrar la lista de visitas de hoy */}
      {showTodayModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-[9999]">
          <div className="bg-white rounded-lg p-6 w-[350px]">
            <h2 className="text-2xl font-bold mb-4">Visitas de Hoy</h2>
            <ul className="max-h-60 overflow-y-auto mb-4">
              {todayVisitsList.length > 0 ? (
                todayVisitsList.map((visit) => (
                  <li key={visit.id} className="mb-2">
                    <span className="text-sm text-gray-900">{visit.time}</span>
                    {" - "}
                    <span className="text-base font-medium text-gray-800">{visit.clientName}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">No hay visitas hoy</li>
              )}
            </ul>
            <div className="mt-4">
              <Button className="text-lg font-semibold" onClick={() => setShowTodayModal(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default Dashboard;
