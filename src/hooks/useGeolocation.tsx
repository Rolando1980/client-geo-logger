
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });
  const { toast } = useToast();

  const getLocation = () => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "La geolocalización no está disponible en este dispositivo",
      }));
      toast({
        title: "Error",
        description: "La geolocalización no está disponible en este dispositivo",
        variant: "destructive",
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState({
          latitude: null,
          longitude: null,
          error: error.message,
          loading: false,
        });
        toast({
          title: "Error de geolocalización",
          description: error.message,
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return { ...state, getLocation };
};
