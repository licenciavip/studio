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