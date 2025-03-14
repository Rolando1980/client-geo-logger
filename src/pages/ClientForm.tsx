
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
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
import { useClients } from "@/hooks/useClients";
import { useAuth } from "@/hooks/useAuth";
import { DocumentType } from "@/types/client";

// Datos para los selectores de ubicación
const locationOptions = [
  { district: "Comas", province: "Lima", department: "Lima" },
  { district: "Breña", province: "Lima", department: "Lima" },
  { district: "San Isidro", province: "Lima", department: "Lima" },
  { district: "Miraflores", province: "Lima", department: "Lima" },
  { district: "Barranco", province: "Lima", department: "Lima" },
  { district: "San Borja", province: "Lima", department: "Lima" },
  { district: "Surco", province: "Lima", department: "Lima" },
  { district: "Magdalena", province: "Lima", department: "Lima" },
  { district: "Jesús María", province: "Lima", department: "Lima" },
  { district: "Lince", province: "Lima", department: "Lima" },
];

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveClient, getClient, loading } = useClients();
  const { user } = useAuth();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    district: "",
    province: "",
    department: "",
    email: "",
    documentType: "DNI" as DocumentType,
    documentNumber: "",
    contactName: "",
    phone: "",
    notes: "",
  });

  const [locationDisplay, setLocationDisplay] = useState("");

  useEffect(() => {
    if (isEditing && id) {
      const fetchClient = async () => {
        const clientData = await getClient(id);
        if (clientData) {
          setFormData({
            name: clientData.name,
            address: clientData.address,
            district: clientData.district,
            province: clientData.province,
            department: clientData.department,
            email: clientData.email || "",
            documentType: clientData.documentType,
            documentNumber: clientData.documentNumber,
            contactName: clientData.contactName,
            phone: clientData.phone || "",
            notes: clientData.notes || "",
          });
          
          setLocationDisplay(`${clientData.district}, ${clientData.province}, ${clientData.department}`);
        }
      };
      
      fetchClient();
    }
  }, [isEditing, id, getClient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    
    if (!formData.name || !formData.address || !formData.district || !formData.documentType || !formData.documentNumber) {
      toast({
        title: "Campos incompletos",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      });
      return;
    }
    
    const result = await saveClient(formData);
    
    if (result) {
      navigate("/clients");
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
                  <Label className="form-label">
                    Tipo Documento <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup 
                    value={formData.documentType} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, documentType: value as DocumentType }))}
                    className="flex space-x-4 mt-1"
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
