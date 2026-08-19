
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: string;
  billingPeriod: string;
}

export default function PaymentSuccessModal({
  isOpen,
  onClose,
  planName,
  amount,
  billingPeriod,
}: PaymentSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 transition-all duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-800/80 p-8 shadow-2xl shadow-emerald-500/10 text-center transition-all duration-300">
        
        {/* Glow effect */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
        
        {/* Animated Check */}
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <CheckCircle2 className="h-10 w-10 animate-bounce" />
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
        </div>

        {/* Text Details */}
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">
          ✓ Payment Confirmed
        </span>

        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
          Subscription Active! 🎉
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Congratulations! Your account has been successfully upgraded. Your premium benefits are active immediately.
        </p>

        {/* Plan Specs Card */}
        <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-5 mb-6 text-left space-y-3.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Activated Tier</span>
            <span className="font-bold text-white text-right">{planName}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Billing Period</span>
            <span className="font-bold text-white capitalize text-right">{billingPeriod === "yearly" ? "Annual" : "Monthly"}</span>
          </div>
          <div className="flex justify-between text-xs border-t border-slate-800/80 pt-3">
            <span className="text-slate-500 font-medium">Amount Paid</span>
            <span className="font-extrabold text-emerald-400 text-right">{amount}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
