
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ref, set, get, child, push } from "firebase/database";
import { database } from "@/firebase/config";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Client } from "@/types/client";

export const useClients = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const saveClient = async (clientData: Omit<Client, 'id' | 'status' | 'creationDate' | 'seller' | 'businessLine'>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para guardar clientes",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);
      
      // Generar ID único
      const clientId = uuidv4();
      
      // Crear objeto cliente completo con campos internos
      const newClient: Client = {
        id: clientId,
        ...clientData,
        status: "Prospecto",
        creationDate: new Date().toISOString(),
        seller: user.email,
        businessLine: "General" // Por ahora un valor por defecto, se puede personalizar más adelante
      };
      
      // Guardar en Firebase
      const clientsRef = ref(database, `clients/${clientId}`);
      await set(clientsRef, newClient);
      
      toast({
        title: "Cliente guardado",
        description: "El cliente ha sido registrado correctamente",
      });
      
      return clientId;
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el cliente",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getClient = async (clientId: string) => {
    try {
      setLoading(true);
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `clients/${clientId}`));
      
      if (snapshot.exists()) {
        return snapshot.val() as Client;
      } else {
        toast({
          title: "Cliente no encontrado",
          description: "No se encontró información del cliente",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error("Error al obtener cliente:", error);
      toast({
        title: "Error",
        description: "No se pudo obtener la información del cliente",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    saveClient,
    getClient
  };
};
