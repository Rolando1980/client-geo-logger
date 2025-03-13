
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface GeoLocationButtonProps {
  onLocationCaptured: (latitude: number, longitude: number) => void;
}

const GeoLocationButton = ({ onLocationCaptured }: GeoLocationButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "La geolocalización no está disponible en este dispositivo",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationCaptured(latitude, longitude);
        toast({
          title: "Ubicación capturada",
          description: "Las coordenadas han sido registradas correctamente",
        });
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Error de geolocalización",
          description: "No se pudo obtener la ubicación. Por favor, verifica los permisos.",
          variant: "destructive",
        });
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        type="button"
        onClick={getLocation}
        disabled={isLoading}
        className="flex items-center space-x-2 bg-brand-yellow text-black hover:brightness-110"
      >
        <MapPin size={18} />
        <span>{isLoading ? "Obteniendo ubicación..." : "Capturar ubicación"}</span>
      </Button>
    </motion.div>
  );
};

export default GeoLocationButton;
