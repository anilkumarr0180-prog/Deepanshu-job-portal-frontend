import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Zap } from "lucide-react";
import type { AdminSubscriptionPlan } from "../api/admin-finance.api";

interface MembershipPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (planData: Partial<AdminSubscriptionPlan>) => Promise<void>;
  editingPlan?: AdminSubscriptionPlan | null;
}

export const MembershipPlanModal: React.FC<MembershipPlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPlan,
}) => {
  const [gateway, setGateway] = useState<"USD" | "INR">("USD");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"JOB_SEEKER" | "RECRUITER">("JOB_SEEKER");
  const [price, setPrice] = useState<number | "">(999);
  const [usdPrice, setUsdPrice] = useState<number | "">(12);
  const [razorpayPlanId, setRazorpayPlanId] = useState("");
  const [polarPriceId, setPolarPriceId] = useState("");
  const [durationInDays, setDurationInDays] = useState<number | "">(30);
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [features, setFeatures] = useState<string[]>(["Full platform access"]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingPlan) {
      const isINR =
        editingPlan.currency === "INR" ||
        (editingPlan.planId && editingPlan.planId.startsWith("plan_"));
      setGateway(isINR ? "INR" : "USD");
      setName(editingPlan.name || "");
      
      const parsedRole =
        editingPlan.role === "RECRUITER" || editingPlan.targetRole === "recruiter"
          ? "RECRUITER"
          : "JOB_SEEKER";
      setRole(parsedRole);
      setPrice(editingPlan.price ?? 0);
      setUsdPrice((editingPlan as any).usdPrice ?? (editingPlan.price ? Math.round(editingPlan.price / 80) : 0));
      
      const rId = editingPlan.providerMappings?.razorpay?.planId || editingPlan.providerPlanId || editingPlan.planId || "";
      const pId = editingPlan.providerMappings?.polar?.priceId || "";
      setRazorpayPlanId(rId);
      setPolarPriceId(pId);

      setDurationInDays(editingPlan.durationInDays || editingPlan.durationDays || 30);
      setDescription(editingPlan.description || "");
      setIsActive(editingPlan.isActive !== false);
      setIsPopular(Boolean(editingPlan.isPopular));
      setIsRecommended(Boolean(editingPlan.isRecommended));

      if (Array.isArray(editingPlan.features)) {
        const extracted = editingPlan.features.map((f: any) =>
          typeof f === "string" ? f : f.title || f.name || JSON.stringify(f)
        );
        setFeatures(extracted.length > 0 ? extracted : ["Full platform access"]);
      } else if (editingPlan.features && typeof editingPlan.features === "object") {
        const legacyList: string[] = [];
        if (editingPlan.features.jobLimit) legacyList.push(`Job limit: ${editingPlan.features.jobLimit}`);
        if (editingPlan.features.inmailCredits) legacyList.push(`InMail credits: ${editingPlan.features.inmailCredits}`);
        if (editingPlan.features.topApplicantBadge) legacyList.push("Top Applicant Badge");
        setFeatures(legacyList.length > 0 ? legacyList : ["Full platform access"]);
      } else {
        setFeatures(["Full platform access"]);
      }
    } else {
      // Reset defaults for Create Mode
      setGateway("USD");
      setName("");
      setRole("JOB_SEEKER");
      setPrice(999);
      setUsdPrice(12);
      setRazorpayPlanId("");
      setPolarPriceId("");
      setDurationInDays(30);
      setDescription("");
      setIsActive(true);
      setIsPopular(false);
      setIsRecommended(false);
      setFeatures(["Full platform access"]);
    }
    setError(null);
  }, [editingPlan, isOpen]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    setFeatures((prev) => [...prev, ""]);
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFeatures((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Plan Name is required.");
      return;
    }
    if (price === "" || price < 0) {
      setError("Please provide a valid INR price.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const formattedFeatures = features
      .filter((f) => f.trim().length > 0)
      .map((f) => ({
        title: f.trim(),
        enabled: true,
      }));

    const payload: Partial<AdminSubscriptionPlan> & { usdPrice?: number } = {
      name: name.trim(),
      role,
      targetRole: role === "JOB_SEEKER" ? "candidate" : "recruiter",
      price: Number(price),
      usdPrice: Number(usdPrice),
      currency: gateway,
      durationInDays: Number(durationInDays) || 30,
      durationDays: Number(durationInDays) || 30,
      description: description.trim(),
      features: formattedFeatures.length > 0 ? formattedFeatures : [{ title: "Full platform access", enabled: true }],
      isPopular,
      isRecommended,
      isActive,
      planId: razorpayPlanId.trim(),
      providerPlanId: razorpayPlanId.trim(),
      providerMappings: {
        razorpay: { planId: razorpayPlanId.trim() },
        polar: { priceId: polarPriceId.trim() },
      },
      provider: gateway === "USD" ? "polar" : "razorpay",
      code: editingPlan?.code || `${role.toLowerCase()}_${name.trim().toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to save plan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl transition-all my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Zap className="h-4 w-4" fill="currentColor" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {editingPlan ? "Edit Membership Plan" : "Create New Membership Plan"}
          </h2>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gateway Switcher */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <span>Payment Currency Gateway</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGateway("USD")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
                  gateway === "USD"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span>$ USD (Polar)</span>
              </button>
              <button
                type="button"
                onClick={() => setGateway("INR")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
                  gateway === "INR"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span>₹ INR (Razorpay)</span>
              </button>
            </div>
          </div>

          {/* Form Row 1: Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Plan Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pro, Premium, Enterprise"
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Target Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="JOB_SEEKER">Candidate (JOB_SEEKER)</option>
                <option value="RECRUITER">Recruiter (RECRUITER)</option>
              </select>
            </div>
          </div>

          {/* Form Row 2: INR Price & USD Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                INR Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="999"
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                USD Price ($) *
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={usdPrice}
                onChange={(e) => setUsdPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="12"
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Gateway Provider Mappings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
                Razorpay Plan ID (INR)
              </label>
              <input
                type="text"
                value={razorpayPlanId}
                onChange={(e) => setRazorpayPlanId(e.target.value)}
                placeholder="e.g. plan_TQJ9ISYw..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-sky-700 mb-1">
                Polar Price ID (USD)
              </label>
              <input
                type="text"
                value={polarPriceId}
                onChange={(e) => setPolarPriceId(e.target.value)}
                placeholder="e.g. 33b83405-e837..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Duration in Days */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Duration (Days) *
            </label>
            <input
              type="number"
              min="1"
              value={durationInDays}
              onChange={(e) => setDurationInDays(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="30"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of what this plan includes..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Toggles / Checkboxes */}
          <div className="flex flex-wrap items-center gap-5 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Active (Visible to users)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
              />
              <span>Mark as Popular</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isRecommended}
                onChange={(e) => setIsRecommended(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Mark as Recommended</span>
            </label>
          </div>

          {/* Features Builder */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Features Included
              </label>
              <button
                type="button"
                onClick={handleAddFeature}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Feature</span>
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    placeholder="e.g. Unlimited job applications"
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              {submitting ? "Saving..." : editingPlan ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
