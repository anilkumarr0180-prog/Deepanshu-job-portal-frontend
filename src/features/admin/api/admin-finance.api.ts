import { axiosInstance } from "@/lib/axios";

export interface FinanceKPI {
  totalGross: number;
  grossUsd?: number;
  grossInr?: number;
  mrr: number;
  mrrUsd?: number;
  mrrInr?: number;
  activePaidSubscriptions: number;
  avgOrderValue: number;
  totalTransactions: number;
  succeededTransactions: number;
  failedTransactions: number;
  successRate: number;
}

export interface DailyRevenuePoint {
  date: string;
  revenue: number;
  transactions: number;
}

export interface AdminTransaction {
  _id: string;
  transactionId: string;
  provider: string;
  providerOrderId?: string;
  providerPaymentId?: string;
  amount: number;
  currency: string;
  status: "succeeded" | "failed" | "pending" | "refunded";
  type: string;
  paymentMethod: string;
  paidAt?: string;
  createdAt: string;
  invoiceUrl?: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  planId?: {
    _id: string;
    name: string;
    code: string;
    price: number;
    billingPeriod: string;
  };
  metadata?: Record<string, any>;
}

export interface AdminSubscriptionPlan {
  _id: string;
  code?: string;
  name: string;
  description: string;
  role: "JOB_SEEKER" | "RECRUITER" | "candidate" | "recruiter";
  targetRole?: "candidate" | "recruiter";
  price: number;
  usdPrice?: number;
  currency: "USD" | "INR" | string;
  durationInDays?: number;
  durationDays?: number;
  billingPeriod?: "monthly" | "yearly";
  features: Array<{ title: string; description?: string; enabled?: boolean } | string> | any;
  providerMappings?: any;
  provider?: string;
  providerPlanId?: string;
  planId?: string;
  isActive: boolean;
  isPopular?: boolean;
  isRecommended?: boolean;
  isDeleted?: boolean;
  prices?: Array<{
    billingCycle: string;
    price: number;
    currency: string;
    durationInDays: number;
    providerPriceIds?: string[];
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCoupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxUses: number;
  timesUsed: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface FinanceOverviewResponse {
  kpi: FinanceKPI;
  thirtyDayTimeSeries: DailyRevenuePoint[];
  recentTransactions: AdminTransaction[];
}

export interface TransactionsResponse {
  items: AdminTransaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const fetchFinanceOverview = async (): Promise<FinanceOverviewResponse> => {
  const response = await axiosInstance.get("/admin/finance/overview");
  return response.data.data;
};

export const fetchAdminTransactions = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  provider?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
}): Promise<TransactionsResponse> => {
  const response = await axiosInstance.get("/admin/finance/transactions", { params });
  return response.data.data;
};

export const fetchAdminPlans = async (): Promise<AdminSubscriptionPlan[]> => {
  const response = await axiosInstance.get("/admin/finance/plans");
  return response.data.data;
};

export const createAdminPlan = async (
  payload: Partial<AdminSubscriptionPlan>
): Promise<AdminSubscriptionPlan> => {
  const response = await axiosInstance.post("/admin/finance/plans", payload);
  return response.data.data;
};

export const updateAdminPlan = async (
  planId: string,
  payload: Partial<AdminSubscriptionPlan>
): Promise<AdminSubscriptionPlan> => {
  const response = await axiosInstance.put(`/admin/finance/plans/${planId}`, payload);
  return response.data.data;
};

export const deleteAdminPlan = async (planId: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/admin/finance/plans/${planId}`);
    return response.data.data;
  } catch (_err) {
    // Fallback: Soft delete via update endpoint if DELETE route isn't mapped
    return await updateAdminPlan(planId, { isDeleted: true, isActive: false });
  }
};

export const fetchAdminCoupons = async (): Promise<AdminCoupon[]> => {
  const response = await axiosInstance.get("/admin/finance/coupons");
  return response.data.data;
};

export const createAdminCoupon = async (payload: {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxUses?: number;
  expiresAt?: string;
  isActive?: boolean;
}): Promise<AdminCoupon> => {
  const response = await axiosInstance.post("/admin/finance/coupons", payload);
  return response.data.data;
};

export const toggleAdminCoupon = async (couponId: string): Promise<AdminCoupon> => {
  const response = await axiosInstance.patch(`/admin/finance/coupons/${couponId}/toggle`);
  return response.data.data;
};

export const overrideUserSubscription = async (payload: {
  userId: string;
  planCode: string;
  durationDays: number;
  reason?: string;
}) => {
  const response = await axiosInstance.post("/admin/finance/subscriptions/override", payload);
  return response.data.data;
};

export const syncPolarPlansApi = async (): Promise<{
  createdProducts: number;
  createdPrices: number;
  existingMappings: number;
  skippedFree: number;
  errors: number;
  details: Array<{ code: string; status: string; productId?: string; priceId?: string; error?: string }>;
}> => {
  const response = await axiosInstance.post("/admin/finance/plans/sync-polar");
  return response.data.data;
};

