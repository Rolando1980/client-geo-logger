
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, PlusCircle, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import ClientCard from "@/components/ClientCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";

// Datos ficticios
const mockClients = [
  { id: "1", name: "Empresa ABC", address: "Calle Principal 123", lastVisit: "22/06/2023" },
  { id: "2", name: "Distribuidora XYZ", address: "Av. Central 456" },
  { id: "3", name: "Consultora 123", address: "Plaza Mayor 789", lastVisit: "15/05/2023" },
  { id: "4", name: "Tecnología ACME", address: "Boulevard Norte 321", lastVisit: "10/06/2023" },
  { id: "5", name: "Servicios Generales", address: "Calle Secundaria 654" },
];

const ClientList = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState(clients);

  useEffect(() => {
    const results = clients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(results);
  }, [searchTerm, clients]);

  const handleClientClick = (client: any) => {
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
                    <ClientCard client={client} onClick={handleClientClick} />
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
        </div>
        
        <Navbar />
      </div>
    </PageTransition>
  );
};

export default ClientList;
