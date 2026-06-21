export type CategorySlug =
  | 'streaming'
  | 'musica'
  | 'ia'
  | 'gaming'
  | 'educacion'
  | 'diseno'
  | 'seguridad'
  | 'deportes'
  | 'bienestar'
  | 'software';

export type Subscription = {
  id: string;
  service: string;
  host: string;
  price: number;
  currency: string;
  rating: number;
  availableSlots: number;
  totalSlots: number;
  logoId: string;
  country: string;
  avatarUrl: string;
};

export type OrderStatus = 'Activo' | 'Pendiente' | 'En disputa' | 'Finalizado';

export type PaymentOrderStatus = 'pending' | 'uploaded' | 'under_review' | 'approved' | 'rejected' | 'expired' | 'cancelled';
export type PaymentReviewStatus = 'waiting_upload' | 'uploaded' | 'needs_manual_review' | 'approved' | 'rejected';

export interface PaymentOrder {
  id: string;
  userId: string;
  type: 'wallet_recharge' | 'membership_payment';
  relatedRequestId?: string;
  relatedGroupId?: string;
  amountExpected: number;
  amountPaid?: number;
  currency: string;
  paymentCode: string;
  bankDestination: string;
  destinationAccountNumber: string;
  operationNumber?: string;
  bankOrigin?: string;
  paidAt?: any;
  payerName?: string;
  proofImageUrl?: string;
  status: PaymentOrderStatus;
  reviewStatus: PaymentReviewStatus;
  rejectedReason?: string;
  reviewedBy?: string;
  reviewedAt?: any;
  expiresAt: any;
  createdAt: any;
  updatedAt: any;
}

export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
  updatedAt: any;
}

/** Estado de una solicitud de retiro. */
export type WithdrawalStatus = 'pending' | 'paid' | 'rejected';

/** Método de pago del retiro. */
export type WithdrawalMethod = 'yape' | 'transfer';

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  method: WithdrawalMethod;
  /** Número de Yape o número de cuenta destino. */
  destination: string;
  /** Nombre del titular de la cuenta/Yape. */
  holderName: string;
  status: WithdrawalStatus;
  rejectedReason?: string;
  reviewedBy?: string;
  reviewedAt?: any;
  createdAt: any;
  updatedAt: any;
}

export type Service = {
  id: string;
  name: string;
  logoId: string;
  color?: string;
  discount?: string;
  pricePerMonth?: string;
  hostEarnings?: string; // Lo que recibe el anfitrión
  planName?: string;
};

export interface Group {
  id: string;
  service: string;
  host: string;
  userRole: 'Anfitrión' | 'Miembro';
  slots: { filled: number; total: number };
  publicPrice: number;
  netEarning: number;
  status: 'Activo' | 'Incompleto' | 'Finalizado';
  credentials: { email: string; pass: string };
  nextBill: string;
}

export interface Order {
  id: string;
  service: string;
  host: string;
  price: number;
  status: OrderStatus;
  expires: string;
}
