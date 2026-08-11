import { axiosInstance } from "@/lib/axios";

export interface SubscriptionPlan {
  _id: string;
  code: string;
  name: string;
  description: string;
  targetRole: "candidate" | "recruiter";
  price: number;
  currency: string;
  billingPeriod: "monthly" | "yearly";
  features: {
    jobLimit?: number;
    featuredJobLimit?: number;
    inmailCredits?: number;
    topApplicantBadge?: boolean;
    prioritySupport?: boolean;
    analyticsLevel?: "basic" | "advanced" | "enterprise";
    candidateSearchAccess?: boolean;
    savedJobsLimit?: number;
  };
  isActive: boolean;
  isPopular?: boolean;
}

export interface UserSubscription {
  _id: string;
  userId: string;
  planId: SubscriptionPlan;
  planCode: string;
  status: "active" | "canceled" | "past_due" | "expired";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  provider: "mock" | "stripe" | "razorpay";
  providerSubscriptionId?: string;
  usages: {
    jobsPostedCount: number;
    featuredJobsCount: number;
    inmailCreditsUsed: number;
  };
}

export interface PaymentTransaction {
  _id: string;
  userId: string;
  amount: number;
  currency: string;
  provider: string;
  transactionId: string;
  status: "succeeded" | "failed" | "pending";
  type: "checkout" | "renewal" | "refund";
  paymentMethod: string;
  invoiceUrl?: string;
  createdAt: string;
}

export interface CouponDetails {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
}

export const fetchPlans = async (targetRole?: "candidate" | "recruiter") => {
  const response = await axiosInstance.get<{ success: boolean; data: SubscriptionPlan[] }>(
    "/v1/subscriptions/plans",
    { params: { role: targetRole } }
  );
  return response.data.data;
};

export const fetchMySubscription = async () => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: { subscription: UserSubscription; plan: SubscriptionPlan };
  }>("/v1/subscriptions/me");
  return response.data.data;
};

export const processCheckout = async (
  planCode: string,
  paymentMethod: string = "card",
  couponCode?: string
) => {
  const response = await axiosInstance.post<{
    success: boolean;
    message: string;
    data: { subscription: UserSubscription; transaction: PaymentTransaction };
  }>("/v1/subscriptions/checkout", { planCode, paymentMethod, couponCode });
  return response.data;
};

export const validateCoupon = async (code: string) => {
  const response = await axiosInstance.post<{
    success: boolean;
    message: string;
    data: CouponDetails;
  }>("/v1/subscriptions/validate-coupon", { code });
  return response.data;
};

export const boostJob = async (jobId: string) => {
  const response = await axiosInstance.post<{
    success: boolean;
    message: string;
    data: any;
  }>("/v1/subscriptions/boost-job", { jobId });
  return response.data;
};

export const cancelSubscription = async () => {
  const response = await axiosInstance.post<{
    success: boolean;
    message: string;
    data: UserSubscription;
  }>("/v1/subscriptions/cancel");
  return response.data;
};

export const createRazorpayOrder = async (planCode: string, couponCode?: string) => {
  const response = await axiosInstance.post<{
    success: boolean;
    data: {
      orderId: string;
      amount: number;
      currency: string;
      keyId: string;
      planName: string;
    };
  }>("/v1/subscriptions/create-razorpay-order", { planCode, couponCode });
  return response.data.data;
};

export const verifyRazorpayPayment = async (payload: {
  orderId: string;
  paymentId: string;
  signature: string;
  planCode: string;
  couponCode?: string;
}) => {
  const response = await axiosInstance.post<{
    success: boolean;
    message: string;
    data: { subscription: UserSubscription; transaction: PaymentTransaction };
  }>("/v1/subscriptions/verify-razorpay-payment", payload);
  return response.data;
};

export const fetchBillingHistory = async () => {
  const response = await axiosInstance.get<{ success: boolean; data: PaymentTransaction[] }>(
    "/v1/subscriptions/transactions"
  );
  return response.data.data;
};
