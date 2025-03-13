
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    if (isEditing) {
      // Simular la obtención de datos del cliente - reemplazar con Firebase
      // Solo para demostración
      const mockClient = {
        name: "Empresa ABC",
        address: "Calle Principal 123",
        phone: "555-123-4567",
        email: "contacto@empresaabc.com",
        notes: "Cliente preferente",
      };
      
      setFormData(mockClient);
    }
  }, [isEditing, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address) {
      toast({
        title: "Campos incompletos",
        description: "El nombre y la dirección son obligatorios",
        variant: "destructive",
      });
      return;
    }
    
    // Simular guardado - reemplazar con Firebase
    console.log("Cliente guardado:", formData);
    
    toast({
      title: isEditing ? "Cliente actualizado" : "Cliente creado",
      description: isEditing 
        ? "Los datos del cliente han sido actualizados" 
        : "El cliente ha sido creado exitosamente",
    });
    
    // Redirigir a la lista de clientes después de guardar
    navigate("/clients");
  };

  const handleCancel = () => {
    navigate(-1);
  };

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
              <h1 className="text-2xl font-bold">
                {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
              </h1>
            </div>
          </header>

          <Card className="bg-white/90 shadow-md">
            <CardContent className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="name" className="form-label">
                    Nombre <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="Nombre del cliente"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="address" className="form-label">
                    Dirección <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    className="form-input"
                    placeholder="Dirección completa"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="phone" className="form-label">
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    className="form-input"
                    placeholder="Número de teléfono"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="email" className="form-label">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="notes" className="form-label">
                    Notas
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    className="form-input min-h-[100px]"
                    placeholder="Información adicional del cliente"
                    value={formData.notes}
                    onChange={handleChange}
                  />
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

export default ClientForm;
