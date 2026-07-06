export type LoginResponse = {
  token: string;
  refreshToken: string;
  email: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
};

export type Overview = {
  totalUsers: number;
  usersByRole: Record<string, number>;
  usersByStatus: Record<string, number>;
  totalAppointments: number;
  appointmentsByStatus: Record<string, number>;
  paidPaymentCount: number;
  grossRevenue: number;
  refundedAmount: number;
  netRevenue: number;
  verifiedKyc: number;
};

export type OrgStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
export type Organization = {
  id: number;
  name: string;
  type: "CLINIC" | "HOSPITAL";
  bizNo: string;
  status: OrgStatus;
  address?: string;
  phone?: string;
};

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "WITHDRAWN";
export type AdminUser = {
  id: number;
  email: string;
  phone?: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
  status: UserStatus;
  createdAt?: string;
};

export type PeriodReport = {
  id: number;
  period: string;
  generatedBy: number;
  createdAt?: string;
  newUsers: number;
  newAppointments: number;
  paidPaymentCount: number;
  grossRevenue: number;
  refundedAmount: number;
  netRevenue: number;
  platformFee: number;
  kycVerified: number;
};

export type ReportListItem = {
  id: number;
  period: string;
  generatedBy: number;
  createdAt?: string;
};

export type DoctorVerification = "PENDING" | "VERIFIED" | "REJECTED" | "SUSPENDED";
export type AdminDoctor = {
  id: number;
  userId: number;
  name?: string;
  email: string;
  specialty?: string;
  organizationId: number;
  organizationName: string;
  organizationStatus: OrgStatus;
  verificationStatus: DoctorVerification;
};
