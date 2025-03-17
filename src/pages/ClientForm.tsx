
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { database } from "@/firebase/config";
import { ref, get, set, update, push } from "firebase/database";
import { DocumentType } from "@/types/client";
import { locationOptions } from "@/types/locationOptions";

interface ClientFormState {
  name: string;
  address: string;
  district: string;
  province: string;
  department: string;
  email: string;
  documentType: DocumentType;
  documentNumber: string;
  contactName: string;
  phone: string;
  notes: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ClientFormState>({
    name: "",
    address: "",
    district: "",
    province: "",
    department: "",
    email: "",
    documentType: "DNI",
    documentNumber: "",
    contactName: "",
    phone: "",
    notes: "",
    userId: user?.uid || "",
  });

  const [locationDisplay, setLocationDisplay] = useState("");

  useEffect(() => {
    const fetchClient = async () => {
      if (isEditing && id && user?.uid) {
        try {
          const clientRef = ref(database, `clients/${id}`);
          const snapshot = await get(clientRef);
          
          if (snapshot.exists()) {
            const clientData = snapshot.val();
            setFormData({
              ...clientData,
              userId: user.uid,
            });
            setLocationDisplay(
              `${clientData.district}, ${clientData.province}, ${clientData.department}`
            );
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "No se pudo cargar el cliente",
            variant: "destructive",
          });
        }
      }
    };

    fetchClient();
  }, [isEditing, id, user?.uid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "documentNumber") {
      let isValid = true;
      let newValue = value;
      
      // Validaciones específicas según el tipo de documento
      if (formData.documentType === "DNI") {
        // Solo permitir dígitos y máximo 8 caracteres
        newValue = value.replace(/\D/g, '').slice(0, 8);
      } else if (formData.documentType === "RUC") {
        // Solo permitir dígitos y máximo 11 caracteres
        newValue = value.replace(/\D/g, '').slice(0, 11);
        // Validar que comience con 10, 15, 17 o 20
        if (newValue.length >= 2) {
          const prefix = newValue.substring(0, 2);
          isValid = ["10", "15", "17", "20"].includes(prefix);
        }
      } else {
        // Para CE y Otro: máximo 20 caracteres
        newValue = value.slice(0, 20);
      }
      
      // Solo actualizar si es un valor válido
      if (isValid) {
        setFormData((prev) => ({ ...prev, [name]: newValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationChange = (value: string) => {
    const [district, province, department] = value.split(", ");
    setLocationDisplay(value);
    setFormData((prev) => ({
      ...prev,
      district,
      province,
      department
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      toast({
        title: "Error de autenticación",
        description: "Debes iniciar sesión para realizar esta acción",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!formData.name || !formData.address || !formData.district || 
        !formData.documentType || !formData.documentNumber) {
      toast({
        title: "Campos incompletos",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const clientData = {
        ...formData,
        userId: user.uid,
        updatedAt: new Date().toISOString(),
        ...(!isEditing && { createdAt: new Date().toISOString() })
      };

      if (isEditing && id) {
        await update(ref(database, `clients/${id}`), clientData);
      } else {
        const newClientRef = ref(database, 'clients');
        await set(push(newClientRef), clientData);
      }

      toast({
        title: isEditing ? "Cliente actualizado" : "Cliente creado",
        description: `Los datos del cliente se han ${isEditing ? 'actualizado' : 'guardado'} correctamente`,
      });
      
      navigate("/clients");
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el cliente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                  <Label className="form-label">
                    Tipo Documento <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup 
                    value={formData.documentType} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, documentType: value as DocumentType }))}
                    className="flex space-x-4 mt-1"
                    required
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="DNI" id="dni" />
                      <Label htmlFor="dni">DNI</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="RUC" id="ruc" />
                      <Label htmlFor="ruc">RUC</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="CE" id="ce" />
                      <Label htmlFor="ce">CE</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="Otro" id="otro" />
                      <Label htmlFor="otro">Otro</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="form-group">
                  <Label htmlFor="documentNumber" className="form-label">
                    Número Documento <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="documentNumber"
                    name="documentNumber"
                    className="form-input"
                    placeholder="Número de documento"
                    value={formData.documentNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

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
                  <Label htmlFor="location" className="form-label">
                    Distrito / Provincia / Departamento <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={locationDisplay}
                    onValueChange={handleLocationChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationOptions.map((location, index) => (
                        <SelectItem 
                          key={index} 
                          value={`${location.district}, ${location.province}, ${location.department}`}
                        >
                          {location.district}, {location.province}, {location.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="contactName" className="form-label">
                    Nombre Contacto
                  </Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    className="form-input"
                    placeholder="Nombre de la persona de contacto"
                    value={formData.contactName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="phone" className="form-label">
                    Celular
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
                      disabled={loading}
                    >
                      <Save size={16} />
                      <span>{loading ? "Guardando..." : "Guardar"}</span>
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
