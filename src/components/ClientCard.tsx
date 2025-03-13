
import { motion } from "framer-motion";
import { MapPin, Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Client {
  id: string;
  name: string;
  address: string;
  lastVisit?: string;
}

interface ClientCardProps {
  client: Client;
  onClick: (client: Client) => void;
}

const ClientCard = ({ client, onClick }: ClientCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="mb-3 overflow-hidden cursor-pointer border-l-4 border-l-brand-yellow"
        onClick={() => onClick(client)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-lg">{client.name}</h3>
              <div className="flex items-center text-brand-gray text-sm mt-1">
                <MapPin size={14} className="mr-1" />
                <span className="truncate max-w-[200px]">{client.address}</span>
              </div>
              {client.lastVisit && (
                <div className="flex items-center text-brand-gray text-sm mt-1">
                  <Calendar size={14} className="mr-1" />
                  <span>Última visita: {client.lastVisit}</span>
                </div>
              )}
            </div>
            <ChevronRight className="text-brand-gray" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientCard;
