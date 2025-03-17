import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, PlusCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import ClientCard from "@/components/ClientCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { database } from "@/firebase/config";
import { ref, query, orderByChild, equalTo, onValue } from "firebase/database";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface Client {
  id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  department: string;
  documentType: string;
  documentNumber: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

const ClientList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!user?.uid) return;

  const clientsRef = query(
    ref(database, 'clients'),
    orderByChild('userId'),
    equalTo(user.uid)
  );

  const unsubscribe = onValue(clientsRef, (snapshot) => {
    // ... lógica existente
  }, (error) => {
    console.error("Error de permisos:", error);
    toast({
      title: "Error de acceso",
      description: "No tienes permiso para ver estos clientes",
      variant: "destructive",
    });
  });

  return () => unsubscribe();
}, [user?.uid]);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.documentNumber.includes(searchTerm)
  );

  const handleClientClick = (client: Client) => {
    navigate("/visit", { state: { selectedClient: client } });
  };

  const handleAddNewClient = () => {
    navigate("/client/new");
  };

  return (
    <PageTransition>
      <div className="min-h-screen pb-20 bg-gradient-to-b from-white to-brand-gray-light/30">
        <div className="page-container">
          <header className="sticky top-0 z-10 pt-6 pb-4 bg-gradient-to-b from-white via-white to-transparent">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Clientes</h1>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleAddNewClient}
                  className="flex items-center gap-1 bg-brand-yellow text-black hover:brightness-110"
                >
                  <PlusCircle size={16} />
                  <span>Nuevo</span>
                </Button>
              </motion.div>
            </div>
            
            <div className="relative mb-4">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-gray" 
                size={18} 
              />
              <Input
                type="text"
                placeholder="Buscar cliente..."
                className="pl-10 form-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <p>Cargando clientes...</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredClients.length > 0 ? (
                <div className="space-y-3">
                  {filteredClients.map((client, index) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <ClientCard 
                        client={client} 
                        onClick={() => handleClientClick(client)}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-48 text-center"
                >
                  <p className="text-brand-gray mb-2">No se encontraron clientes</p>
                  <Button
                    onClick={handleAddNewClient}
                    className="flex items-center gap-1 bg-brand-yellow text-black hover:brightness-110"
                  >
                    <PlusCircle size={16} />
                    <span>Agregar cliente</span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
        
        <Navbar />
      </div>
    </PageTransition>
  );
};

export default ClientList;