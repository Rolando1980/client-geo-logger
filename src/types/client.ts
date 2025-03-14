
export interface Client {
  id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  department: string;
  email: string;
  documentType: 'DNI' | 'RUC' | 'CE' | 'Otro';
  documentNumber: string;
  contactName: string;
  phone: string;
  notes?: string;
  // Campos internos
  status: string;
  creationDate: string;
  seller: string;
  businessLine: string;
}

export type DocumentType = 'DNI' | 'RUC' | 'CE' | 'Otro';
