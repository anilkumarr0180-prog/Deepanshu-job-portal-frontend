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
} from "lucide-react";

import {
  fetchMySubscription,
  fetchBillingHistory,
  cancelSubscription,
  reactivateSubscription,
  type UserSubscription,
  type SubscriptionPlan,
  type PaymentTransaction,
} from "../api/subscriptionApi";

import useAuth from "@/features/auth/hooks/useAuth";

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

  useEffect(() => {
    loadBillingInfo();
  }, []);

  const loadBillingInfo = async () => {
    try {
      setIsLoading(true);
      const data = await fetchMySubscription();
      setSubData(data);

      const history = await fetchBillingHistory();
      setTransactions(history);
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
                <div className="text-3xl font-black text-white tracking-tight">₹{plan?.price?.toLocaleString("en-IN") || 0}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Per {plan?.billingPeriod || "month"}</div>
              </div>
            </div>
          </div>

          {/* Subscription Details & Renewal Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Renewal Date</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {subscription?.currentPeriodEnd
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                    : "Lifetime Free"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className={`p-2.5 rounded-xl border ${
                subscription?.cancelAtPeriodEnd
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Auto Renewal</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {subscription?.cancelAtPeriodEnd
                    ? `Disabled (Expires ${subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : "at cycle end"})`
                    : "Active Enabled"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Payment Gateway</div>
                <div className="text-sm font-bold text-white mt-0.5 capitalize">{subscription?.provider || "Razorpay"}</div>
              </div>
            </div>
          </div>

          {/* Usage Progress Bars (Recruiters & Candidates) */}
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
              <>
                <button
                  onClick={handleReactivateSubscription}
                  disabled={isReactivating}
                  className="px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all hover:scale-[1.02]"
                >
                  {isReactivating ? "Processing..." : "Turn On Auto-Pay"}
                </button>
                <Link
                  to={pricingRoute}
                  className="px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 transition-all hover:scale-[1.02]"
                >
                  Renew / Upgrade Plan
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Invoice & Transaction Audit Log */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
          <h2 className="text-xl font-extrabold text-white mb-6 flex items-center gap-2.5">
            <Receipt className="w-5 h-5 text-indigo-400" />
            <span>Billing History & Invoices</span>
          </h2>

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
                      <td className="py-4 px-4 font-black text-white">₹{tx.amount} {tx.currency}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="capitalize">{tx.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {tx.invoiceUrl ? (
                          <a
                            href={tx.invoiceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 transition-all hover:scale-105"
                          >
                            <span>Receipt PDF</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-slate-500 text-xs font-medium">Receipt</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
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
