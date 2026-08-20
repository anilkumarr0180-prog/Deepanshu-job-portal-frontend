import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CreditCard,
  Crown,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  Layers,
  Loader2,
  Sparkles,
} from "lucide-react";

import {
  fetchMySubscription,
  fetchBillingHistory,
  cancelSubscription,
  reactivateSubscription,
  downloadInvoiceApi,
  verifyPolarPayment,
  type UserSubscription,
  type SubscriptionPlan,
  type PaymentTransaction,
} from "../api/subscriptionApi";

import useAuth from "@/features/auth/hooks/useAuth";

import PaymentSuccessModal from "../components/PaymentSuccessModal";

export default function BillingSettingsPage() {
  const { user } = useAuth();
  const pricingRoute =
    user?.role === "candidate"
      ? "/candidate/pricing"
      : user?.role === "recruiter"
        ? "/recruiter/pricing"
        : "/pricing";

  const [subData, setSubData] = useState<{
    subscription: UserSubscription;
    plan: SubscriptionPlan;
  } | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [downloadingTxId, setDownloadingTxId] = useState<string | null>(null);
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

  const handleDownloadInvoice = async (txId: string) => {
    if (!txId) return;
    setDownloadingTxId(txId);
    try {
      const htmlData = await downloadInvoiceApi(txId);
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(htmlData);
        printWindow.document.close();
      } else {
        toast.error("Please allow popups to view receipt PDF.");
      }
    } catch (error: any) {
      console.error("Download invoice error:", error);
      toast.error(error?.response?.data?.message || "Failed to download receipt PDF");
    } finally {
      setDownloadingTxId(null);
    }
  };

  useEffect(() => {
    loadBillingInfo();
  }, []);

  const loadBillingInfo = async () => {
    try {
      setIsLoading(true);

      // Verify Polar checkout if checkoutId is in URL query parameters
      const searchParams = new URLSearchParams(window.location.search);
      const checkoutId =
        searchParams.get("checkoutId") ||
        searchParams.get("checkout_id") ||
        searchParams.get("polar_checkout_id");
      const planCode = searchParams.get("planCode") || undefined;
      const couponCode = searchParams.get("couponCode") || undefined;

      if (checkoutId) {
        const sessionKey = `verified_polar_${checkoutId}`;
        if (!sessionStorage.getItem(sessionKey)) {
          try {
            const verifyRes = await verifyPolarPayment({
              checkoutId,
              planCode,
              couponCode,
            });
            sessionStorage.setItem(sessionKey, "true");
            toast.success(verifyRes.message || "Polar payment verified & subscription activated!");

            // Dynamically set success modal attributes based on plan details
            const matchedPlanName = planCode?.includes("enterprise") 
              ? "Recruiter Enterprise" 
              : planCode?.includes("lite") 
              ? "Recruiter Lite" 
              : planCode?.includes("premium") 
              ? "Career Premium" 
              : planCode?.includes("pro") 
              ? "Career Pro" 
              : "Premium Subscription";
              
            const period = planCode?.includes("yearly") ? "yearly" : "monthly";
            const amtStr = planCode?.includes("enterprise") 
              ? (planCode?.includes("yearly") ? "$799 USD" : "$99 USD")
              : planCode?.includes("lite")
              ? (planCode?.includes("yearly") ? "$149 USD" : "$15 USD")
              : planCode?.includes("premium")
              ? (planCode?.includes("yearly") ? "$39 USD" : "$4 USD")
              : (planCode?.includes("yearly") ? "$19 USD" : "$2 USD");

            setSuccessModalData({
              isOpen: true,
              planName: matchedPlanName,
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

      const [data, history] = await Promise.all([
        fetchMySubscription().catch(() => null),
        fetchBillingHistory().catch(() => []),
      ]);

      if (data) setSubData(data);
      if (history) setTransactions(history);
    } catch (error) {
      console.error("Failed to load billing settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel auto-renewal for your subscription?")) {
      return;
    }

    try {
      setIsCanceling(true);
      await cancelSubscription();
      toast.success("Subscription auto-renewal disabled. Unused period remains active.");
      loadBillingInfo();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel auto-renewal.");
    } finally {
      setIsCanceling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setIsReactivating(true);
      await reactivateSubscription();
      toast.success("🎉 Auto-pay re-enabled! Subscription will automatically renew at period end.");
      loadBillingInfo();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to re-enable auto-pay.");
    } finally {
      setIsReactivating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24 bg-[#030712] min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  const subscription = subData?.subscription;
  const plan = subData?.plan;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <CreditCard className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                Billing & Subscription
              </h1>
            </div>
            <p className="text-slate-400 text-sm mt-2">
              Manage your active subscription plan, check feature quotas, and view invoice history.
            </p>
          </div>

          <Link
            to={pricingRoute}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Explore Upgrade Plans</span>
          </Link>
        </div>

        {/* Active Plan Overview Card */}
        <div className="bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-black text-white tracking-tight">{plan?.name || "Free Tier"}</h2>
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{subscription?.status || "Active"}</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm">{plan?.description}</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-950/60 px-5 py-3 rounded-2xl border border-slate-800/80">
              <div className="text-right">
                <div className="text-3xl font-black text-white tracking-tight">
                  {subscription?.provider === "polar" || plan?.currency === "USD" ? "$" : "₹"}
                  {(subscription?.provider === "polar" || plan?.currency === "USD"
                    ? (plan?.usdPrice ?? (plan?.price ? Math.round(plan.price / 80) : 0))
                    : (plan?.price || 0)
                  ).toLocaleString(subscription?.provider === "polar" || plan?.currency === "USD" ? "en-US" : "en-IN")}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Per {plan?.billingPeriod === "yearly" ? "year" : "month"}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                  {(!plan?.price || plan.price === 0)
                    ? "Billing Cycle"
                    : subscription?.cancelAtPeriodEnd
                      ? "Expires On"
                      : "Next Billing Date"}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {(!plan?.price || plan.price === 0)
                    ? "Lifetime Free"
                    : subscription?.currentPeriodEnd
                      ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                      : "Lifetime Free"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className={`p-2.5 rounded-xl border ${(!plan?.price || plan.price === 0)
                  ? "bg-slate-800/40 text-slate-400 border-slate-700/40"
                  : subscription?.cancelAtPeriodEnd
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Auto Renewal</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {(!plan?.price || plan.price === 0)
                    ? "Not Applicable (Free Plan)"
                    : subscription?.cancelAtPeriodEnd
                      ? `Disabled (Expires ${subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "at cycle end"})`
                      : "Active (Auto-renews)"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Payment Gateway</div>
                <div className="text-sm font-bold text-white mt-0.5 capitalize">
                  {(!plan?.price || plan.price === 0) ? "Internal / Free" : (subscription?.provider || "Razorpay")}
                </div>
              </div>
            </div>
          </div>

          {plan?.targetRole === "recruiter" && (
            <div className="pt-6 space-y-4">
              <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Feature Quota Usage</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UsageBar
                  label="Active Job Posts"
                  current={subscription?.usages?.jobsPostedCount || 0}
                  limit={plan?.features?.jobLimit ?? 1}
                />
                <UsageBar
                  label="Featured Job Boost Slots"
                  current={subscription?.usages?.featuredJobsCount || 0}
                  limit={plan?.features?.featuredJobLimit ?? 0}
                />
              </div>
            </div>
          )}

          {/* Actions Bar */}
          <div className="pt-6 flex flex-wrap justify-end gap-3">
            <Link
              to={pricingRoute}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{plan?.price && plan.price > 0 ? "Upgrade / Change Plan" : "View Premium Plans"}</span>
            </Link>

            {plan?.price && plan.price > 0 && !subscription?.cancelAtPeriodEnd && (
              <button
                onClick={handleCancelSubscription}
                disabled={isCanceling}
                className="px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all hover:scale-[1.02]"
              >
                {isCanceling ? "Processing..." : "Cancel Auto-Pay"}
              </button>
            )}

            {plan?.price && plan.price > 0 && subscription?.cancelAtPeriodEnd && (
              <button
                onClick={handleReactivateSubscription}
                disabled={isReactivating}
                className="px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                {isReactivating ? "Processing..." : "Turn On Auto-Pay"}
              </button>
            )}
          </div>
        </div>

        <div className="rounded-3xl p-8 bg-slate-900/40 border border-slate-800/80 backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-400" />
                <span>Billing History & Invoices</span>
              </h3>
              <p className="text-slate-400 text-xs mt-1">Download official PDF receipts and transaction records for tax filing.</p>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No previous invoices or payments recorded.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-extrabold tracking-widest border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Transaction ID</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4 font-mono text-xs text-indigo-400 font-bold">{tx.transactionId}</td>
                      <td className="py-4 px-4 text-slate-300 text-xs font-medium">{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4 font-black text-white">
                        {tx.currency === "USD" ? "$" : "₹"}
                        {tx.amount.toLocaleString(tx.currency === "USD" ? "en-US" : "en-IN")} {tx.currency || (tx.provider === "polar" ? "USD" : "INR")}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="capitalize">{tx.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(tx._id || tx.transactionId)}
                          disabled={downloadingTxId === (tx._id || tx.transactionId)}
                          className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-500/20 transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
                        >
                          {downloadingTxId === (tx._id || tx.transactionId) ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                          ) : (
                            <>
                              <span>Receipt PDF</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

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

function UsageBar({ label, current, limit }: { label: string; current: number; limit: number }) {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 10 : Math.min(100, Math.round((current / (limit || 1)) * 100));

  return (
    <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
      <div className="flex justify-between items-center text-xs font-bold mb-2.5">
        <span className="text-slate-300">{label}</span>
        <span className="text-indigo-400 font-extrabold">
          {current} / {isUnlimited ? "Unlimited" : limit}
        </span>
      </div>
      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-indigo-500/50"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
