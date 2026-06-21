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

/** Entidad financiera destino del retiro. */
export type WithdrawalEntity = 'yape' | 'bcp' | 'plin';

/** Cuenta de retiro registrada por el usuario. */
export interface WithdrawalAccount {
  id: string;
  userId: string;
  /** Nombre personalizado de la cuenta (opcional). */
  accountName?: string;
  holderName: string;
  docType: string; // 'DNI'
  docNumber: string;
  entity: WithdrawalEntity;
  /** N° de celular (Yape/Plin) o N° de cuenta (BCP). */
  destination: string;
  isPrimary: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
  updatedAt: any;
}

/** Estado de una solicitud de retiro. */
export type WithdrawalStatus = 'pending' | 'paid' | 'rejected';

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  accountId: string;
  entity: WithdrawalEntity;
  holderName: string;
  destination: string;
  docNumber?: string;
  status: WithdrawalStatus;
  rejectedReason?: string;
  reviewedBy?: string;
  reviewedAt?: any;
  createdAt: any;
  updatedAt: any;
}

export type DisputeStatus = 'open' | 'resolved' | 'rejected';

export interface Dispute {
  id: string;
  userId: string;
  orderId: string;
  evidence: string;
  status: DisputeStatus;
  /** Nota de resolución del admin. */
  resolution?: string;
  /** Reembolso proporcional acreditado al usuario, si aplica. */
  refundAmount?: number;
  /** Recomendación opcional de la IA. */
  aiRecommendation?: string;
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
