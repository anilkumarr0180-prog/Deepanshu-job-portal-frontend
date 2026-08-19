import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "@/features/auth/hooks/useAuth";
import {
  Check,
  Crown,
  ShieldCheck,
  Lock,
  ArrowRight,
  UserCheck,
  Building2,
  XCircle,
  Sparkles,
  Target,
  Rocket,
  HelpCircle,
  ChevronDown,
  Clock,
} from "lucide-react";

import EnterpriseCheckoutModal from "../components/EnterpriseCheckoutModal";
import PaymentSuccessModal from "../components/PaymentSuccessModal";
import {
  fetchPlans,
  fetchMySubscription,
  verifyPolarPayment,
  type SubscriptionPlan,
  type UserSubscription,
} from "../api/subscriptionApi";

export default function PricingPage() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [activeRoleTab, setActiveRoleTab] = useState<"candidate" | "recruiter">(
    authUser?.role === "recruiter" ? "recruiter" : "candidate"
  );
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const [selectedCurrency, setSelectedCurrency] = useState<"INR" | "USD">("INR");
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSub, setUserSub] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionPlan | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [successModalData, setSuccessModalData] = useState<{
    isOpen: boolean;
    planName: string;
    amount: string;
    billingPeriod: string;
  }>({
    isOpen: false,
    planName: "",
    amount: "",
    billingPeriod: "",
  });

  useEffect(() => {
    if (authUser?.role === "recruiter") {
      setActiveRoleTab("recruiter");
    } else if (authUser?.role === "candidate") {
      setActiveRoleTab("candidate");
    }
  }, [authUser?.role]);

  useEffect(() => {
    loadData();
  }, [activeRoleTab, authUser]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const plansData = await fetchPlans(activeRoleTab);
      const canonicalPlans = (plansData || []).filter(
        (p) =>
          !p.code?.toLowerCase().startsWith("unmapped_") &&
          !p.code?.toLowerCase().startsWith("test_") &&
          !p.code?.toLowerCase().startsWith("scratch_") &&
          !p.name?.toLowerCase().includes("unmapped")
      );
      setPlans(canonicalPlans);

      // Verify Polar checkout if checkoutId is present in URL search params
      const searchParams = new URLSearchParams(window.location.search);
      const checkoutId =
        searchParams.get("checkoutId") ||
        searchParams.get("checkout_id") ||
        searchParams.get("polar_checkout_id");
      const planCode = searchParams.get("planCode") || undefined;
      const couponCode = searchParams.get("couponCode") || undefined;

      if (checkoutId && authUser) {
        const sessionKey = `verified_polar_${checkoutId}`;
        if (!sessionStorage.getItem(sessionKey)) {
          try {
            const verifyRes = await verifyPolarPayment({
              checkoutId,
              planCode,
              couponCode,
            });
            sessionStorage.setItem(sessionKey, "true");
            toast.success(verifyRes.message || "Subscription activated via Polar!");
            
            // Look up plan details for the popup
            const matchedPlan = canonicalPlans.find((p) => p.code === planCode);
            const period = matchedPlan?.billingPeriod || "monthly";
            const amtStr = matchedPlan?.usdPrice ? `$${matchedPlan.usdPrice} USD` : (planCode?.includes("yearly") ? "$799 USD" : "$99 USD");

            setSuccessModalData({
              isOpen: true,
              planName: matchedPlan?.name || "Premium Subscription",
              amount: amtStr,
              billingPeriod: period,
            });
          } catch (err: any) {
            console.error("Polar verification error:", err);
            toast.error(err?.response?.data?.message || "Polar payment verification failed.");
          }
        }
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }

      if (authUser) {
        const subData = await fetchMySubscription();
        if (subData?.subscription) {
          setUserSub(subData.subscription);
        }
      }
    } catch (error) {
      console.error("Failed to load plans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (!authUser) {
      toast("Please log in to upgrade your subscription.", { icon: "🔒" });
      navigate("/login");
      return;
    }

    if (userSub?.planCode === plan.code) {
      toast.success("You are currently on this plan!");
      return;
    }

    const originalPlan = plans.find((p) => p.code === plan.code) || plan;
    const basePlanPrice = originalPlan.price;
    const activePlanPrice = userSub?.planId?.price ?? 0;
    if (activePlanPrice > 0 && basePlanPrice <= activePlanPrice) {
      toast.error(`You are already subscribed to a higher plan (${userSub?.planId?.name || "Active Tier"}).`);
      return;
    }

    if (plan.price === 0) {
      toast("Free tier is active by default.", { icon: "ℹ️" });
      return;
    }

    setSelectedPlanForCheckout(plan);
  };

  const faqs = [
    {
      q: "Can I upgrade or downgrade my plan at any time?",
      a: "Yes! You can switch between plans or cancel auto-renewal anytime from your Billing Dashboard. Upgrades take effect immediately.",
    },
    {
      q: "How do Featured Jobs work for recruiters?",
      a: "Featured Jobs automatically pin your job listing to the top of candidate search feeds with a highlighted glowing badge, boosting candidate applications by 4x.",
    },
    {
      q: "What is the Candidate Top Applicant Badge?",
      a: "As a Career Premium member, your profile is highlighted at the top of recruiter applicant stacks with a verified Top Applicant badge.",
    },
    {
      q: "Are there any hidden contract fees or setup charges?",
      a: "None! What you see is what you pay. All plans come with transparent monthly or annual pricing and zero hidden fees.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Mesh Ambient Glow Backdrop */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-blue-600/10 rounded-full filter blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>JobsBox Subscription Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent mb-6 leading-tight">
            Transparent Pricing for Ambitious Talent & Employers
          </h1>

          <p className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed">
            Choose the plan engineered to accelerate your career or scale your hiring pipeline. Instant setup, zero contracts, cancel anytime.
          </p>

          {/* Role & Billing Switch Controls */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Role Switcher — hide the other-role tab when logged in */}
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
              {/* Show Candidate tab only if not a recruiter */}
              {authUser?.role !== "recruiter" && (
                <button
                  onClick={() => setActiveRoleTab("candidate")}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${activeRoleTab === "candidate"
                      ? "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                      : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>For Candidates</span>
                </button>
              )}

              {/* Show Recruiter tab only if not a candidate */}
              {authUser?.role !== "candidate" && (
                <button
                  onClick={() => setActiveRoleTab("recruiter")}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${activeRoleTab === "recruiter"
                      ? "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                      : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>For Recruiters</span>
                </button>
              )}
            </div>

            {/* Annual Discount Toggle */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs">
              <span className={billingInterval === "monthly" ? "text-white font-bold" : "text-slate-400"}>Monthly</span>
              <button
                onClick={() => setBillingInterval(billingInterval === "monthly" ? "yearly" : "monthly")}
                className="relative w-12 h-6 rounded-full bg-slate-800 transition-colors p-1"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-indigo-500 shadow-md transition-transform ${billingInterval === "yearly" ? "translate-x-6" : "translate-x-0"
                    }`}
                />
              </button>
              <span className={billingInterval === "yearly" ? "text-white font-bold" : "text-slate-400"}>Yearly</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold uppercase">
                Save 20%
              </span>
            </div>

            {/* Currency Switcher Toggle (INR Razorpay / USD Polar) */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-xl backdrop-blur-xl text-xs">
              <button
                onClick={() => setSelectedCurrency("INR")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all duration-300 ${
                  selectedCurrency === "INR"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>₹ INR</span>
                <span className="text-[10px] opacity-75 font-normal">(Razorpay)</span>
              </button>
              <button
                onClick={() => setSelectedCurrency("USD")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all duration-300 ${
                  selectedCurrency === "USD"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>$ USD</span>
                <span className="text-[10px] opacity-75 font-normal">(Polar)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-20">
            {(() => {
              const hasDedicatedYearlyPlans = plans.some((p) => p.billingPeriod === "yearly");
              const visiblePlans = hasDedicatedYearlyPlans
                ? plans.filter((p) => (p.price === 0 ? true : p.billingPeriod === billingInterval))
                : plans.filter((p) => p.billingPeriod === "monthly" || p.price === 0);

              const isUSD = selectedCurrency === "USD";
              const currencySymbol = isUSD ? "$" : "₹";

              return visiblePlans.map((plan) => {
                const isCurrent = userSub?.planCode === plan.code;
                const activePlanPrice = userSub?.planId?.price ?? 0;
                const isYearly = billingInterval === "yearly";

                const basePrice = isUSD
                  ? (plan.usdPrice !== undefined && plan.usdPrice !== null ? plan.usdPrice : (plan.price > 0 ? Math.round(plan.price / 80) : 0))
                  : plan.price;

                const displayPrice =
                  !hasDedicatedYearlyPlans && isYearly && basePrice > 0
                    ? Math.round(basePrice * 0.8 * 12)
                    : basePrice;

                const isLowerTier = !isCurrent && activePlanPrice > 0 && plan.price <= activePlanPrice;
                const isPopular = plan.isPopular;

                const effectivePlan: SubscriptionPlan = {
                  ...plan,
                  price: displayPrice,
                  currency: selectedCurrency,
                  provider: isUSD ? "polar" : "razorpay",
                  billingPeriod: isYearly && basePrice > 0 ? "yearly" : (plan.billingPeriod || "monthly"),
                  code:
                    !hasDedicatedYearlyPlans && isYearly && basePrice > 0 && !plan.code.includes("yearly")
                      ? `${plan.code}_yearly`
                      : plan.code,
                };

                return (
                  <div
                    key={plan.code}
                    className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${isPopular
                        ? "bg-gradient-to-b from-slate-900/90 via-slate-900/95 to-indigo-950/40 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/15 lg:-translate-y-2"
                        : "bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1"
                      } backdrop-blur-2xl`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-[11px] font-extrabold uppercase tracking-widest shadow-lg shadow-indigo-500/30 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                        <span>Most Popular</span>
                      </div>
                    )}

                    <div>
                      {/* Tier Icon & Name */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <PlanIcon code={plan.code} />
                          <h3 className="text-xl font-bold text-white tracking-tight">
                            {plan.name} {isYearly && basePrice > 0 && !plan.name.includes("Annual") && !plan.name.includes("Yearly") ? "(Annual)" : ""}
                          </h3>
                        </div>

                        {isCurrent && (
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                            Active Plan
                          </span>
                        )}
                      </div>

                      <p className="text-slate-400 text-sm mb-6 min-h-[40px] leading-relaxed">{plan.description}</p>

                      {/* Price Tag */}
                      <div className="flex items-baseline gap-1.5 mb-8 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                        <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                          {currencySymbol}{displayPrice.toLocaleString(isUSD ? "en-US" : "en-IN")}
                        </span>
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                          /{isYearly && basePrice > 0 ? "year" : (plan.billingPeriod || "month")}
                        </span>
                      </div>

                      {/* Feature Checklist */}
                      <div className="space-y-3.5 mb-8 border-t border-slate-800/80 pt-6">
                        {plan.targetRole === "candidate" ? (
                          <>
                            <FeatureItem title="Unlimited Job Applications" enabled={true} />
                            <FeatureItem
                              title="Top Applicant Badge on Profile"
                              enabled={Boolean(plan.features?.topApplicantBadge)}
                            />
                            <FeatureItem
                              title={`Direct InMail Credits (${plan.features?.inmailCredits || 0}/mo)`}
                              enabled={(plan.features?.inmailCredits || 0) > 0}
                            />
                            <FeatureItem
                              title="Priority Resume Ranking to Recruiters"
                              enabled={Boolean(plan.features?.topApplicantBadge)}
                            />
                            <FeatureItem
                              title="Advanced Profile Search Analytics"
                              enabled={plan.features?.analyticsLevel === "advanced"}
                            />
                          </>
                        ) : (
                          <>
                            <FeatureItem
                              title={`Active Job Listings (${plan.features?.jobLimit === -1 ? "Unlimited" : plan.features?.jobLimit || 1})`}
                              enabled={true}
                            />
                            <FeatureItem
                              title={`Featured Job Boost Slots (${plan.features?.featuredJobLimit || 0} Slots)`}
                              enabled={(plan.features?.featuredJobLimit || 0) > 0}
                            />
                            <FeatureItem
                              title="Full Candidate Search & Resume Database"
                              enabled={Boolean(plan.features?.candidateSearchAccess)}
                            />
                            <FeatureItem
                              title={`Direct Candidate InMail (${plan.features?.inmailCredits === -1 ? "Unlimited" : plan.features?.inmailCredits || 0}/mo)`}
                              enabled={(plan.features?.inmailCredits || 0) > 0 || plan.features?.inmailCredits === -1}
                            />
                            <FeatureItem
                              title={`Hiring Funnel Analytics (${plan.features?.analyticsLevel || "basic"})`}
                              enabled={true}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleSelectPlan(effectivePlan)}
                      disabled={isCurrent || isLowerTier}
                      className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${isCurrent || isLowerTier
                          ? "bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60"
                          : isPopular
                            ? "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 hover:scale-[1.02]"
                            : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:scale-[1.02]"
                        }`}
                    >
                      <span>
                        {isCurrent
                          ? "Current Active Plan"
                          : isLowerTier
                            ? "Included in Higher Plan"
                            : plan.price === 0
                              ? "Default Free Tier"
                              : activePlanPrice > 0
                                ? "Upgrade (Prorated Discount)"
                                : "Upgrade Plan"}
                      </span>
                      {!isCurrent && !isLowerTier && plan.price > 0 && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* Enterprise Trust Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 bg-slate-900/30 border border-slate-800/60 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1">Bank-Grade Encryption</h4>
              <p className="text-slate-400 text-xs leading-relaxed">256-bit SSL encrypted transactions backed by enterprise payment security standards.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1">Instant Feature Activation</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Featured jobs, top applicant badges, and credits unlock immediately upon confirmation.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1">1-Click Cancelation</h4>
              <p className="text-slate-400 text-xs leading-relaxed">No long-term contracts. Cancel auto-renewal anytime directly from your billing dashboard.</p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white mb-2 flex items-center justify-center gap-2">
              <HelpCircle className="w-7 h-7 text-indigo-400" />
              <span>Frequently Asked Questions</span>
            </h2>
            <p className="text-slate-400 text-sm">Everything you need to know about JobsBox plans and billing.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-900/50 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-xl"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full py-4 px-6 text-left flex justify-between items-center font-bold text-slate-200 hover:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-indigo-400 transition-transform duration-300 ${openFaqIndex === idx ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Razorpay Enterprise Checkout Modal */}
      <EnterpriseCheckoutModal
        isOpen={Boolean(selectedPlanForCheckout)}
        plan={selectedPlanForCheckout}
        userSub={userSub}
        onClose={() => setSelectedPlanForCheckout(null)}
        onSuccess={(result) => {
          toast.success(`🎉 Successfully upgraded to ${selectedPlanForCheckout?.name}!`);
          if (result?.subscription) {
            setUserSub(result.subscription);
          }
          setSelectedPlanForCheckout(null);
        }}
      />

      {/* Polar Success Confirmation Modal */}
      <PaymentSuccessModal
        isOpen={successModalData.isOpen}
        onClose={() => setSuccessModalData({ ...successModalData, isOpen: false })}
        planName={successModalData.planName}
        amount={successModalData.amount}
        billingPeriod={successModalData.billingPeriod}
      />
    </div>
  );
}

function PlanIcon({ code }: { code: string }) {
  if (code.includes("enterprise")) {
    return (
      <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
        <Rocket className="w-6 h-6" />
      </div>
    );
  }
  if (code.includes("lite") || code.includes("premium")) {
    return (
      <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
        <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
      </div>
    );
  }
  return (
    <div className="p-2.5 rounded-2xl bg-slate-800 text-slate-400 border border-slate-700">
      <Target className="w-6 h-6" />
    </div>
  );
}

function FeatureItem({ title, enabled }: { title: string; enabled: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {enabled ? (
        <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
          <Check className="w-3.5 h-3.5" />
        </div>
      ) : (
        <div className="p-1 rounded-full bg-slate-800/80 text-slate-600 shrink-0">
          <XCircle className="w-3.5 h-3.5" />
        </div>
      )}
      <span className={enabled ? "text-slate-200 font-medium" : "text-slate-500 line-through"}>
        {title}
      </span>
    </div>
  );
}
