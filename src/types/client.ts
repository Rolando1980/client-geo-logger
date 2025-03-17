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
  userId: string;
  createdAt: string;
  updatedAt?: string;
}