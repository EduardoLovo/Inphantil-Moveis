export interface ShippingQuote {
  id: number;
  createdAt: string;

  // Dados do Cliente
  customerName: string;
  customerCpf: string;
  customerZipCode: string;
  customerCity: string;
  customerState: string;
  customerAddress: string;
  quoteDetails: string;

  // Quem criou
  createdById: number;
  createdBy?: {
    id: number;
    name: string;
    email: string;
  };

  // Dados da Resposta (Logística)
  carrierName?: string;
  deliveryDeadline?: string;
  volumeQuantity?: number;
  weight?: string;
  orderValue?: number;
  shippingValue?: number;
  bedSize?: string;
  hasWallProtector: boolean;
  wallProtectorSize?: string;
  hasRug: boolean;
  rugSize?: string;
  hasAccessories: boolean;
  accessoryQuantity?: number;
  isConcluded: boolean;
  concludedAt?: string;
}
