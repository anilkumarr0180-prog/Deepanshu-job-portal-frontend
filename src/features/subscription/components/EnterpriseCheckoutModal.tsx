import { useState, useEffect } from "react";
import {
  Lock,
  CheckCircle2,
  ShieldCheck,
  X,
  AlertOctagon,
  Copy,
  Check,
  Shield,
  Loader2,
  Sparkles,
  Zap,
  CreditCard,
  Smartphone,
  Building,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "@/features/auth/hooks/useAuth";
import type { SubscriptionPlan } from "../api/subscriptionApi";
import { createRazorpayOrder, verifyRazorpayPayment, createPolarCheckout, validateCoupon } from "../api/subscriptionApi";

// ─── Razorpay SDK Types ─────────────────────────────────────────────────────

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: {
    ondismiss?: () => void;
    confirm_close?: boolean;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

// ─── Load Razorpay SDK Script ────────────────────────────────────────────────

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface EnterpriseCheckoutModalProps {
  isOpen: boolean;
  plan: SubscriptionPlan | null;
  userSub?: any;
  onClose: () => void;
  onSuccess: (result: { subscription: any; transaction: any }) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function EnterpriseCheckoutModal({
  isOpen,
  plan,
  userSub,
  onClose,
  onSuccess,
}: EnterpriseCheckoutModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<"details" | "confirming" | "success">("details");
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number | null>(null);
  const [copiedTxn, setCopiedTxn] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [confirmingStep, setConfirmingStep] = useState(1);
  const [isLaunchingRazorpay, setIsLaunchingRazorpay] = useState(false);
  const [isLaunchingPolar, setIsLaunchingPolar] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<"razorpay" | "polar">("razorpay");

  const [successReceipt, setSuccessReceipt] = useState<{
    txnId: string;
    amount: number;
    date: string;
    method: string;
  } | null>(null);

  // Auto-select gateway based on plan defaults
  useEffect(() => {
    if (plan) {
      if (plan.currency === "USD" || plan.provider === "polar" || plan.providerMappings?.polar?.priceId) {
        setSelectedGateway("polar");
      } else {
        setSelectedGateway("razorpay");
      }
    }
  }, [plan]);

  // Prevent accidental reload during payment verification
  useEffect(() => {
    if (step === "confirming") {
      const handler = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "Payment verification in progress. Do not refresh.";
      };
      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }
  }, [step]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("details");
      setCouponCode("");
      setDiscountPercent(null);
      setSuccessReceipt(null);
      setProgressPercent(0);
      setConfirmingStep(1);
    }
  }, [isOpen]);

  if (!isOpen || !plan) return null;

  // ─── Price & Proration Calculations ────────────────────────────────────────

  let prorationCredit = 0;
  let remainingDays = 0;

  if (
    userSub &&
    userSub.planId &&
    typeof userSub.planId.price === "number" &&
    userSub.planId.price > 0 &&
    plan.price > userSub.planId.price
  ) {
    const end = new Date(userSub.currentPeriodEnd).getTime();
    const start = new Date(userSub.currentPeriodStart).getTime();
    const now = Date.now();
    if (end > now && end > start) {
      const totalMs = end - start;
      const remainingMs = end - now;
      const ratio = Math.max(0, Math.min(1, remainingMs / totalMs));
      const unadjustedCredit = userSub.planId.price * ratio;
      // Cap proration credit so upgrade subtotal remains at least 1 Rupee/Dollar
      prorationCredit = Number(Math.min(unadjustedCredit, plan.price - 1).toFixed(2));
      remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
    }
  }

  const subtotal = plan.price;
  const afterProration = Math.max(1, subtotal - prorationCredit);
  const discountAmount = discountPercent ? Number(((afterProration * discountPercent) / 100).toFixed(2)) : 0;
  const afterDiscount = Math.max(1, afterProration - discountAmount);
  const tax = Number((afterDiscount * 0.18).toFixed(2));
  const finalTotal = Math.max(1, Math.round(afterDiscount + tax));

  // ─── Apply Coupon ──────────────────────────────────────────────────────────

  const handleApplyCoupon = async () => {
    const code = couponCode.toUpperCase().trim();
    if (!code) return;
    try {
      const res = await validateCoupon(code);
      if (res && res.data) {
        setDiscountPercent(res.data.discountValue);
        toast.success(`🎉 Promo ${res.data.code} applied! ${res.data.discountValue}${res.data.discountType === "percentage" ? "%" : " off"}`);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid promo code");
    }
  };

  // ─── Polar Payment Flow ───────────────────────────────────────────────────

  const handlePayWithPolar = async () => {
    setIsLaunchingPolar(true);
    try {
      // Redirect back to current page on payment completion
      const redirectPath = window.location.pathname || (user?.role === "recruiter" ? "/recruiter/billing" : "/candidate/billing");
      const params = new URLSearchParams();
      params.set("planCode", plan.code);
      if (couponCode && couponCode.trim()) {
        params.set("couponCode", couponCode.trim());
      }
      const successUrl = `${window.location.origin}${redirectPath}?${params.toString()}`;

      const checkoutData = await createPolarCheckout({
        planCode: plan.code,
        couponCode: couponCode || undefined,
        successUrl,
      });

      // Redirect user directly to Polar hosted checkout URL to complete payment
      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      } else {
        toast.error("Polar checkout URL was not returned by server.");
        setIsLaunchingPolar(false);
      }
    } catch (err: any) {
      setIsLaunchingPolar(false);
      toast.error(err?.response?.data?.message || "Failed to launch Polar checkout.");
    }
  };

  // ─── Main Payment Flow (Razorpay) ──────────────────────────────────────────

  const handlePayWithRazorpay = async () => {
    setIsLaunchingRazorpay(true);

    try {
      // 1. Load Razorpay SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded || !window.Razorpay) {
        toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
        setIsLaunchingRazorpay(false);
        return;
      }

      // 2. Create order on backend
      let orderData: {
        orderId?: string;
        amount: number;
        currency: string;
        keyId: string;
        planName: string;
        isMock?: boolean;
      };

      try {
        orderData = await createRazorpayOrder(plan.code, couponCode || undefined);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to create payment order.");
        setIsLaunchingRazorpay(false);
        return;
      }

      // 3. Open Razorpay popup
      const razorpayOptions: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "JobsBox Portal",
        description: `${plan.name} Subscription`,
        ...(orderData.orderId ? { order_id: orderData.orderId } : {}),
        prefill: {
          name: user?.name || "Test Recruiter",
          email: user?.email || "recruiter@example.com",
          contact: "9876543210",
        },
        handler: async (response) => {
          // 4. After Razorpay success → verify on backend
          setIsLaunchingRazorpay(false);
          setStep("confirming");
          setProgressPercent(20);
          setConfirmingStep(1);

          try {
            // Step 1 animation
            await new Promise((r) => setTimeout(r, 700));
            setProgressPercent(50);
            setConfirmingStep(2);

            // Step 2: Verify payment signature
            await new Promise((r) => setTimeout(r, 500));
            const verifyResult = await verifyRazorpayPayment({
              orderId: response.razorpay_order_id || orderData.orderId || "",
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              planCode: plan.code,
              couponCode: couponCode || undefined,
            });

            setProgressPercent(85);
            setConfirmingStep(3);
            await new Promise((r) => setTimeout(r, 600));
            setProgressPercent(100);

            // 5. Success screen
            setSuccessReceipt({
              txnId: response.razorpay_payment_id,
              amount: finalTotal,
              date: new Date().toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
              method: "Razorpay",
            });

            setStep("success");
            onSuccess(verifyResult.data);
          } catch (err: any) {
            toast.error(err?.response?.data?.message || "Payment verification failed.");
            setStep("details");
          }
        },
        theme: { color: "#6366f1" },
        modal: {
          ondismiss: () => {
            setIsLaunchingRazorpay(false);
            toast("Payment cancelled. You can try again.", { icon: "ℹ️" });
          },
          confirm_close: true,
        },
      };

      setIsLaunchingRazorpay(false);
      const rzp = new window.Razorpay(razorpayOptions);
      rzp.open();
    } catch (err: any) {
      setIsLaunchingRazorpay(false);
      toast.error("Something went wrong. Please try again.");
      console.error("Razorpay error:", err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedTxn(true);
    toast.success("Transaction ID copied!");
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  const rawCurrency = (plan?.currency || "INR").toUpperCase();
  const currencySymbol = rawCurrency === "USD" ? "$" : rawCurrency === "INR" ? "₹" : `${rawCurrency} `;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-fadeIn font-sans">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full filter blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/15 rounded-full filter blur-[140px] pointer-events-none" />

      <div className="bg-[#0a0d1a]/98 border border-slate-800/80 rounded-3xl max-w-2xl w-full shadow-2xl shadow-black/50 relative overflow-hidden text-slate-100 flex flex-col md:flex-row backdrop-blur-2xl">

        {/* Close Button (hidden during confirming) */}
        {step !== "confirming" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-900/60 border border-slate-800 transition-all hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* ── SUCCESS SCREEN ─────────────────────────────────────────── */}
        {step === "success" && successReceipt && (
          <div className="p-8 w-full text-center space-y-6 animate-fadeIn my-auto relative overflow-hidden">
            {/* Celebration particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[
                { top: "8%", left: "10%", color: "bg-emerald-400", cls: "animate-ping", size: "w-2 h-2" },
                { top: "15%", right: "12%", color: "bg-amber-400", cls: "animate-bounce", size: "w-3 h-3" },
                { bottom: "20%", left: "15%", color: "bg-indigo-400", cls: "animate-pulse", size: "w-2.5 h-2.5" },
                { top: "50%", right: "8%", color: "bg-pink-400", cls: "animate-ping", size: "w-2 h-2" },
                { top: "30%", left: "50%", color: "bg-cyan-400", cls: "animate-bounce", size: "w-1.5 h-1.5" },
              ].map((p, i) => (
                <div
                  key={i}
                  className={`absolute rounded-full ${p.color} ${p.cls} ${p.size}`}
                  style={{ top: p.top, left: p.left, right: (p as any).right, bottom: (p as any).bottom }}
                />
              ))}
            </div>

            {/* Big green check */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: "1.5s" }} />
              <div className="absolute inset-2 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: "2s" }} />
              <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center relative z-10 shadow-2xl shadow-emerald-500/50">
                <CheckCircle2 className="w-12 h-12 text-white stroke-[2.5]" />
              </div>
            </div>

            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-extrabold uppercase tracking-widest mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Payment Confirmed • Features Unlocked</span>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tight">Subscription Active!</h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                You're now on <span className="text-white font-bold">{plan.name}</span>. All features are live immediately.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-left space-y-3.5 shadow-inner">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Payment ID:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-indigo-400 font-bold text-[11px]">{successReceipt.txnId}</span>
                  <button
                    onClick={() => copyToClipboard(successReceipt.txnId)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 transition-colors"
                  >
                    {copiedTxn ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Date & Time:</span>
                <span className="text-slate-200 font-medium">{successReceipt.date}</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Plan:</span>
                <span className="text-white font-bold">{plan.name}</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Charged:</span>
                <span className="text-white font-black text-sm">{currencySymbol}{Math.round(finalTotal).toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center border-t border-slate-800 pt-3 text-xs">
                <span className="text-slate-400">Payment Gateway:</span>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{successReceipt.method} • 256-bit SSL</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all"
            >
              <span className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                Go to Dashboard
              </span>
            </button>
          </div>
        )}

        {/* ── CONFIRMING PAYMENT SCREEN ───────────────────────────────── */}
        {step === "confirming" && (
          <div className="p-8 sm:p-12 w-full text-center space-y-8 animate-fadeIn my-auto">
            {/* Warning Banner */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3 text-amber-300">
              <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
              <div className="text-xs font-extrabold text-left leading-relaxed">
                <span>DO NOT REFRESH OR PRESS BACK</span>
                <span className="block font-normal text-[11px] text-amber-300/80 mt-0.5">
                  Verifying your payment...
                </span>
              </div>
            </div>

            {/* Animated Loader Ring */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping" style={{ animationDuration: "1.8s" }} />
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-indigo-400/30 animate-spin" style={{ animationDuration: "3s" }} />
              <div className="absolute inset-4 rounded-full border-2 border-dotted border-purple-400/20 animate-spin" style={{ animationDuration: "5s", animationDirection: "reverse" }} />
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-indigo-500/50 relative z-10 border border-indigo-300/20">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-indigo-400 text-xs font-extrabold uppercase tracking-widest mb-2">
                <Shield className="w-4 h-4" />
                <span>Confirming your payment</span>
              </div>
              <h3 className="text-2xl font-black text-white mt-1">Verifying Signature</h3>
              <p className="text-slate-400 text-xs mt-2">This usually takes a few seconds. Please wait...</p>
            </div>

            {/* Step Progress */}
            <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 text-left space-y-4 max-w-sm mx-auto">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Gateway Status</span>
                <span className="text-indigo-400 font-mono font-bold">{progressPercent}%</span>
              </div>

              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 mb-4">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm shadow-indigo-500/50"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <ConfirmStep step={1} current={confirmingStep} title="Payment Signature Received" subtitle="Payment captured by gateway" />
              <ConfirmStep step={2} current={confirmingStep} title="Verifying Signature" subtitle="Cryptographic security verification" />
              <ConfirmStep step={3} current={confirmingStep} title="Activating Subscription" subtitle="Unlocking all plan features & quotas" />
            </div>
          </div>
        )}

        {/* ── DETAILS SCREEN (Payment Method Selection) ──────────────── */}
        {step === "details" && (
          <>
            {/* Left: Form */}
            <div className="p-6 sm:p-8 md:w-[58%] space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Secured Gateway • 256-Bit SSL
                  </span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">Complete Payment</h3>
                <p className="text-slate-400 text-xs mt-1">
                  Select your preferred payment gateway to complete checkout.
                </p>
              </div>

              {/* Gateway Switcher Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedGateway("razorpay")}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-extrabold transition-all ${
                    selectedGateway === "razorpay"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Razorpay (INR ₹)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGateway("polar")}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-extrabold transition-all ${
                    selectedGateway === "polar"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Polar ({rawCurrency})</span>
                </button>
              </div>

              {selectedGateway === "razorpay" ? (
                /* Razorpay Info Card */
                <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-purple-950/40 border border-indigo-500/20 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-[#072654] rounded-lg flex items-center justify-center shadow-md">
                        <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none">
                          <path d="M8 32L20 8l12 24H8z" fill="#3395FF" />
                          <path d="M14 20l6-12 6 12H14z" fill="#fff" opacity="0.7" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-white font-extrabold text-sm">Razorpay</span>
                        <div className="text-[10px] text-slate-400 font-medium">India's Most Trusted Gateway</div>
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                      Test Mode
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Supported Payment Methods</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { icon: <CreditCard className="w-4 h-4" />, label: "Cards", sub: "Visa, MC, Amex" },
                        { icon: <Smartphone className="w-4 h-4" />, label: "UPI", sub: "GPay, PhonePe" },
                        { icon: <Building className="w-4 h-4" />, label: "Banking", sub: "HDFC, ICICI, SBI" },
                      ].map((m) => (
                        <div key={m.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 text-center">
                          <div className="text-indigo-400 flex justify-center mb-1">{m.icon}</div>
                          <div className="text-white text-[11px] font-bold">{m.label}</div>
                          <div className="text-slate-500 text-[9px]">{m.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3 text-[10px] text-slate-400 leading-relaxed">
                    <span className="text-amber-400 font-bold">⚡ 1-Click Test:</span> In the Razorpay popup, select <span className="text-white font-bold">Netbanking</span> (Bank of Baroda / Canara Bank) and click <span className="text-emerald-400 font-bold">Success</span>!
                  </div>
                </div>
              ) : (
                /* Polar Info Card */
                <div className="bg-gradient-to-br from-blue-950/60 via-slate-900/80 to-indigo-950/40 border border-blue-500/20 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md text-white font-black text-xs">
                        <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                      </div>
                      <div>
                        <span className="text-white font-extrabold text-sm">Polar Gateway</span>
                        <div className="text-[10px] text-slate-400 font-medium">Polar Hosted Checkout ({rawCurrency})</div>
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                      Hosted Checkout
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Supported Payment Methods</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { icon: <CreditCard className="w-4 h-4" />, label: "Global Cards", sub: "Visa, MC, Amex" },
                        { icon: <Shield className="w-4 h-4" />, label: "Apple / Google", sub: "Mobile One-Click" },
                        { icon: <Zap className="w-4 h-4 text-amber-300" />, label: "Instant Sync", sub: "Auto-Activation" },
                      ].map((m) => (
                        <div key={m.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 text-center">
                          <div className="text-blue-400 flex justify-center mb-1">{m.icon}</div>
                          <div className="text-white text-[11px] font-bold">{m.label}</div>
                          <div className="text-slate-500 text-[9px]">{m.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3 text-[10px] text-slate-400 leading-relaxed">
                    <span className="text-blue-400 font-bold">⚡ Secure Checkout:</span> You will be redirected to Polar's secure checkout page to complete payment.
                  </div>
                </div>
              )}

              {/* Security features */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: <Shield className="w-4 h-4 text-emerald-400" />, label: "SSL Encrypted" },
                  { icon: <CheckCircle2 className="w-4 h-4 text-indigo-400" />, label: "PCI DSS Compliant" },
                  { icon: <Zap className="w-4 h-4 text-amber-400" />, label: "Instant Activation" },
                ].map((f) => (
                  <div key={f.label} className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-2.5">
                    <div className="flex justify-center mb-1">{f.icon}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">{f.label}</div>
                  </div>
                ))}
              </div>

              {/* Pay Button */}
              {selectedGateway === "polar" ? (
                <button
                  type="button"
                  onClick={handlePayWithPolar}
                  disabled={isLaunchingPolar}
                  className="w-full py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLaunchingPolar ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Redirecting to Polar...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-emerald-300" />
                      <span>Pay with Polar ({currencySymbol}{Math.round(finalTotal).toLocaleString()})</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePayWithRazorpay}
                  disabled={isLaunchingRazorpay}
                  className="w-full py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLaunchingRazorpay ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Launching Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-emerald-300" />
                      <span>Pay {currencySymbol}{Math.round(finalTotal).toLocaleString()} with Razorpay</span>
                    </>
                  )}
                </button>
              )}

              <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                By proceeding, you agree to our terms & authorize {selectedGateway === "polar" ? "Polar" : "Razorpay"} to process this payment securely.
              </p>
            </div>

            {/* Right: Order Summary */}
            <div className="p-6 sm:p-8 md:w-[42%] bg-slate-950/60 border-t md:border-t-0 md:border-l border-slate-800/80 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Order Summary</h4>

                {/* Plan header */}
                <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white font-bold text-sm">{plan.name}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5 capitalize">{plan.billingPeriod} billing</div>
                    </div>
                    <div className="text-white font-black text-lg">{currencySymbol}{plan.price.toLocaleString()}</div>
                  </div>
                </div>

                {/* Promo Code */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Promo Code
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. WELCOME50"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-[11px] font-mono text-white uppercase focus:outline-none focus:border-indigo-500 placeholder:normal-case placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Try: WELCOME50 or LAUNCH20</p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs border-t border-slate-800 pt-4">
                  <div className="flex justify-between text-slate-400">
                    <span>New Plan ({plan.name})</span>
                    <span>{currencySymbol}{subtotal.toLocaleString()}</span>
                  </div>

                  {prorationCredit > 0 && (
                    <div className="flex justify-between text-indigo-300 font-bold bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/25 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
                        <span>Active Plan Credit ({remainingDays}d left)</span>
                      </div>
                      <span className="text-amber-300 font-extrabold">-{currencySymbol}{prorationCredit.toLocaleString()}</span>
                    </div>
                  )}

                  {discountPercent && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Promo ({discountPercent}% off)</span>
                      <span>-{currencySymbol}{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>GST (18%)</span>
                    <span>{currencySymbol}{tax.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Total Due */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-300">Total Due Today</span>
                  <span className="text-2xl font-black text-white tracking-tight">
                    {currencySymbol}{Math.round(finalTotal).toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">Secured 256-bit SSL</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] text-slate-400">Zero contracts • Cancel anytime</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Confirming Step Item ────────────────────────────────────────────────────

function ConfirmStep({
  step,
  current,
  title,
  subtitle,
}: {
  step: number;
  current: number;
  title: string;
  subtitle: string;
}) {
  const isDone = current > step;
  const isCurrent = current === step;

  return (
    <div className="flex items-center gap-3.5">
      <div className="shrink-0">
        {isDone ? (
          <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        ) : isCurrent ? (
          <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-slate-800/80 text-slate-600 flex items-center justify-center text-[10px] font-bold">
            {step}
          </div>
        )}
      </div>
      <div>
        <div className={`text-xs font-bold ${isDone ? "text-emerald-400" : isCurrent ? "text-white" : "text-slate-500"}`}>
          {title}
        </div>
        <div className="text-[10px] text-slate-500 leading-normal">{subtitle}</div>
      </div>
    </div>
  );
}
