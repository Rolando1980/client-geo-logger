
export type DocumentType = "DNI" | "RUC" | "CE" | "Otro";

export interface Client {
  id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  department: string;
  documentType: DocumentType;
  documentNumber: string;
  phone?: string;
  email?: string;
  status: string;
  creationDate: string;
  seller: string;
  businessLine: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
  contactName?: string;
  notes?: string;
}
