
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { visitPurposeOptions } from "@/types/visitTypes";
import { useGeolocation } from "@/hooks/useGeolocation";

// Datos ficticios
const mockClients = [
  { id: "1", name: "Empresa ABC", address: "Calle Principal 123" },
  { id: "2", name: "Distribuidora XYZ", address: "Av. Central 456" },
  { id: "3", name: "Consultora 123", address: "Plaza Mayor 789" },
];

const VisitForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const selectedClient = location.state?.selectedClient;
  const { latitude, longitude, getLocation } = useGeolocation();

  const [formData, setFormData] = useState({
    clientId: selectedClient?.id || "",
    clientName: selectedClient?.name || "",
    purpose: "",
    notes: "",
  });

  const [showClientSearch, setShowClientSearch] = useState(!selectedClient);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState(mockClients);

  // Get location when component mounts
  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    const results = mockClients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(results);
  }, [searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClientSelect = (client: any) => {
    setFormData((prev) => ({
      ...prev,
      clientId: client.id,
      clientName: client.name,
    }));
    setShowClientSearch(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId || !formData.purpose) {
      toast({
        title: "Campos incompletos",
        description: "Por favor selecciona un cliente y el propósito de la visita",
        variant: "destructive",
      });
      return;
    }

    if (!latitude || !longitude) {
      toast({
        title: "Error de ubicación",
        description: "No se pudo obtener la ubicación. Por favor verifica los permisos.",
        variant: "destructive",
      });
      return;
    }
    
    // Create the visit data with current date and time
    const visitData = {
      ...formData,
      date: format(new Date(), "yyyy-MM-dd"),
      time: format(new Date(), "HH:mm"),
      latitude,
      longitude,
      createdAt: new Date().toISOString()
    };
    
    // Simular guardado - reemplazar con Firebase
    console.log("Visita guardada:", visitData);
    
    toast({
      title: "Visita registrada",
      description: "La visita ha sido registrada exitosamente",
    });
    
    // Redirigir al dashboard después de guardar
    navigate("/dashboard");
  };

  const handleAddNewClient = () => {
    navigate("/client/new");
  };

  const handleShowClientSearch = () => {
    setShowClientSearch(true);
    setFormData((prev) => ({
      ...prev,
      clientId: "",
      clientName: "",
    }));
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Format current date and time for display
  const currentDate = format(new Date(), "dd/MM/yyyy");
  const currentTime = format(new Date(), "HH:mm");

  return (
    <PageTransition>
      <div className="min-h-screen pb-20 bg-gradient-to-b from-white to-brand-gray-light/30">
        <div className="page-container">
          <header className="pt-6 pb-4">
            <div className="flex items-center mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="mr-2"
              >
                <ArrowLeft size={20} />
              </Button>
              <h1 className="text-2xl font-bold">Registrar Visita</h1>
            </div>
          </header>

          <Card className="bg-white/90 shadow-md mb-6">
            <CardContent className="p-5">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <Label className="form-label">Fecha</Label>
                  <div className="p-3 bg-brand-gray-light/30 rounded-md">
                    {currentDate}
                  </div>
                </div>

                <div className="form-group">
                  <Label className="form-label">Hora</Label>
                  <div className="p-3 bg-brand-gray-light/30 rounded-md">
                    {currentTime}
                  </div>
                </div>
              </div>

              {showClientSearch ? (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="form-label">
                      Seleccionar Cliente <span className="text-red-500">*</span>
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAddNewClient}
                      className="text-xs"
                    >
                      Nuevo cliente
                    </Button>
                  </div>
                  
                  <div className="relative mb-3">
                    <Search 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-gray" 
                      size={16} 
                    />
                    <Input
                      type="text"
                      placeholder="Buscar cliente..."
                      className="pl-10 form-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto rounded-md border border-brand-gray-light">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <motion.div
                          key={client.id}
                          whileHover={{ backgroundColor: "rgba(241, 207, 0, 0.1)" }}
                          className="p-3 border-b border-brand-gray-light cursor-pointer"
                          onClick={() => handleClientSelect(client)}
                        >
                          <div className="font-medium">{client.name}</div>
                          <div className="text-xs text-brand-gray">{client.address}</div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-brand-gray">
                        No se encontraron clientes
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="form-group mb-4">
                  <Label className="form-label">Cliente</Label>
                  <div className="flex items-center">
                    <div className="flex-1 p-3 bg-brand-gray-light/30 rounded-md">
                      <div className="font-medium">{formData.clientName}</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleShowClientSearch}
                      className="ml-2"
                    >
                      Cambiar
                    </Button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="purpose" className="form-label">
                    Propósito de la visita <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("purpose", value)}
                    value={formData.purpose}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un propósito" />
                    </SelectTrigger>
                    <SelectContent>
                      {visitPurposeOptions.map((purpose) => (
                        <SelectItem key={purpose} value={purpose}>
                          {purpose}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-group">
                  <Label htmlFor="notes" className="form-label">
                    Notas
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    className="form-input min-h-[100px]"
                    placeholder="Información adicional de la visita"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <Label className="form-label flex items-center">
                    <MapPin size={14} className="mr-1" />
                    Ubicación
                  </Label>
                  
                  {latitude && longitude ? (
                    <div className="p-3 bg-brand-gray-light/30 rounded-md text-sm">
                      <p className="font-medium">Ubicación actual:</p>
                      <p className="text-brand-gray">
                        Lat: {latitude.toFixed(6)}, 
                        Lng: {longitude.toFixed(6)}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-brand-gray-light/30 rounded-md text-sm">
                      <p className="text-brand-gray">
                        Obteniendo ubicación...
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="mr-2"
                  >
                    Cancelar
                  </Button>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      className="bg-brand-yellow text-black hover:brightness-110 flex items-center gap-2"
                    >
                      <Save size={16} />
                      <span>Guardar</span>
                    </Button>
                  </motion.div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <Navbar />
      </div>
    </PageTransition>
  );
};

export default VisitForm;
