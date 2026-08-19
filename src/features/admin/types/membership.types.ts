export interface IMembershipFeature {
  title: string;
  description?: string;
  enabled?: boolean;
}

export interface IMembershipPlan {
  _id?: string;
  id?: string;
  name: string;
  role: "JOB_SEEKER" | "RECRUITER";
  price: number;
  currency: "USD" | "INR";
  durationInDays: number;
  description: string;
  features: IMembershipFeature[];
  isPopular: boolean;
  isRecommended: boolean;
  isActive: boolean;
  isDeleted?: boolean;
  planId?: string;
  createdAt?: string;
  updatedAt?: string;
}
