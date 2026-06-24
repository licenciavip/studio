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

/** Configuración de la cuenta de cobro (Firestore: config/payment). */
export interface PaymentConfig {
  bank: string;
  holder: string;
  number: string;
  cci?: string;
}

/** Perfil público de un usuario (Firestore: publicProfiles/{uid}). Solo datos seguros. */
export interface PublicProfile {
  uid: string;
  displayName: string;
  /** Semilla del avatar prediseñado, o vacío para usar iniciales. */
  avatarSeed?: string;
  bio?: string;
  /** Contacto */
  phone?: string;
  whatsapp?: string;
  /** Verificaciones (sin SMS por ahora; el tel. real queda para Blaze). */
  verifiedEmail?: boolean;
  verifiedProfile?: boolean;
  createdAt?: any;
  /** Agregados de reputación. */
  ratingSum?: number;
  ratingCount?: number;
}

/** Reseña de un miembro a un anfitrión (Firestore: reviews/{hostId}__{raterId}). */
export interface Review {
  id: string;
  hostId: string;
  raterId: string;
  raterName: string;
  groupId: string;
  stars: number;
  comment?: string;
  createdAt?: any;
}

/** Documento de usuario en Firestore. */
export interface UserDoc {
  id: string;
  uid?: string;
  displayName?: string;
  email?: string;
  role?: string;
  blocked?: boolean;
  createdAt?: any;
}

/** Estado de revisión de un grupo publicado. */
export type GroupApproval = 'pending' | 'approved' | 'rejected';

/** Grupo (publicación de suscripción compartida) almacenado en Firestore. */
export interface GroupDoc {
  id: string;
  hostId: string;
  hostName: string;
  serviceId: string;
  serviceName: string;
  serviceColor?: string | null;
  slotsTotal: number;
  slotsFilled: number;
  pricePerSlot: number;
  hostEarning: number;
  status: 'Activo' | 'Incompleto' | 'Finalizado';
  /** Revisión del admin antes de quedar visible. */
  approval: GroupApproval;
  rejectedReason?: string;
  reviewedBy?: string;
  reviewedAt?: any;
  credentials: { email: string; pass: string };
  nextBill: string;
  createdAt: any;
  updatedAt: any;
}

/** Servicio del catálogo, gestionado por el admin en Firestore. */
export interface ServiceDoc {
  id: string;
  name: string;
  planName?: string;
  color?: string;
  category: string;
  /** Precio que paga el miembro por cupo/mes. */
  pricePerMonth: number;
  hostEarnings?: number;
  /** Ganancia de Poolera por cupo/mes (comisión). Anfitrión recibe = pricePerMonth - platformFee. */
  platformFee: number;
  /** Máximo de asientos por cuenta (incluye al dueño). Compartibles = maxSlots - 1. */
  maxSlots: number;
  active: boolean;
  createdAt?: any;
  updatedAt?: any;
}
