import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Zap,
  RefreshCw,
} from "lucide-react";
import {
  fetchAdminPlans,
  createAdminPlan,
  updateAdminPlan,
  deleteAdminPlan,
  syncPolarPlansApi,
} from "../api/admin-finance.api";
import type { AdminSubscriptionPlan } from "../api/admin-finance.api";
import { MembershipPlanModal } from "../components/MembershipPlanModal";

export default function AdminMembershipsPage() {
  const [plans, setPlans] = useState<AdminSubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync Polar State
  const [syncingPolar, setSyncingPolar] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "Candidate" | "Recruiter">("ALL");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AdminSubscriptionPlan | null>(null);

  // Soft Delete Confirmation State
  const [deletingPlan, setDeletingPlan] = useState<AdminSubscriptionPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminPlans();
      // Exclude soft-deleted plans
      setPlans(Array.isArray(data) ? data.filter((p) => !p.isDeleted) : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load subscription plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleSyncPolarCatalog = async () => {
    try {
      setSyncingPolar(true);
      setSyncMessage(null);
      const res = await syncPolarPlansApi();
      setSyncMessage(
        `Polar catalog synced! Created ${res.createdProducts} products / ${res.createdPrices} prices. Existing: ${res.existingMappings}. Errors: ${res.errors}.`
      );
      await loadPlans();
    } catch (err: any) {
      setSyncMessage(`Sync failed: ${err?.response?.data?.message || err?.message}`);
    } finally {
      setSyncingPolar(false);
    }
  };

  const handleSavePlan = async (payload: Partial<AdminSubscriptionPlan>) => {
    if (editingPlan) {
      await updateAdminPlan(editingPlan._id, payload);
    } else {
      await createAdminPlan(payload);
    }
    await loadPlans();
  };

  const handleConfirmDelete = async () => {
    if (!deletingPlan) return;
    try {
      setIsDeleting(true);
      await deleteAdminPlan(deletingPlan._id);
      setDeletingPlan(null);
      await loadPlans();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Failed to delete plan.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered plans memoized
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      // Role filter
      if (roleFilter === "Candidate") {
        const isCandidate =
          plan.role === "JOB_SEEKER" ||
          plan.targetRole === "candidate" ||
          plan.code?.toLowerCase().includes("candidate");
        if (!isCandidate) return false;
      }
      if (roleFilter === "Recruiter") {
        const isRecruiter =
          plan.role === "RECRUITER" ||
          plan.targetRole === "recruiter" ||
          plan.code?.toLowerCase().includes("recruiter");
        if (!isRecruiter) return false;
      }

      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchName = plan.name?.toLowerCase().includes(query);
        const matchId = (plan.planId || plan.providerPlanId || plan._id || "").toLowerCase().includes(query);
        const matchDesc = plan.description?.toLowerCase().includes(query);
        if (!matchName && !matchId && !matchDesc) return false;
      }

      return true;
    });
  }, [plans, search, roleFilter]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Admin Control Center</h1>
            <p className="text-xs font-medium text-slate-500">
              Create, update, toggle and soft-delete membership pricing tiers dynamically.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={syncingPolar}
            onClick={handleSyncPolarCatalog}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-500/20 hover:bg-sky-700 disabled:opacity-50 transition-all hover:scale-[1.02] shrink-0"
            title="Automatically synchronize all paid plans to Polar USD Catalog"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncingPolar ? "animate-spin" : ""}`} />
            <span>{syncingPolar ? "Syncing..." : "Sync Polar Catalog (USD)"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingPlan(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all hover:scale-[1.02] shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Plan</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="rounded-xl bg-sky-50 border border-sky-200 p-3 text-xs font-semibold text-sky-800 animate-fadeIn flex items-center justify-between">
          <span>{syncMessage}</span>
          <button
            type="button"
            onClick={() => setSyncMessage(null)}
            className="text-sky-500 hover:text-sky-700 text-xs font-bold ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Controls Bar: Search & Role Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by plan name or planid..."
            className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Role Filter Pills */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-semibold text-slate-500">Filter Role:</span>
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setRoleFilter("ALL")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                roleFilter === "ALL"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("Candidate")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                roleFilter === "Candidate"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("Recruiter")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                roleFilter === "Recruiter"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Recruiter
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
            <p className="text-xs font-semibold">Loading membership plans...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 text-sm font-medium">{error}</div>
        ) : filteredPlans.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-sm font-semibold">No membership plans found.</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">PLAN NAME</th>
                  <th className="py-3.5 px-4 text-center">TARGET ROLE</th>
                  <th className="py-3.5 px-4">DOMESTIC (INR ₹)</th>
                  <th className="py-3.5 px-4">INTERNATIONAL (USD $)</th>
                  <th className="py-3.5 px-4">GATEWAY INTEGRATIONS & MAPPINGS</th>
                  <th className="py-3.5 px-4 text-center">STATUS</th>
                  <th className="py-3.5 px-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPlans.map((plan) => {
                  const isRecruiter =
                    plan.role === "RECRUITER" ||
                    plan.targetRole === "recruiter" ||
                    plan.code?.toLowerCase().includes("recruiter");

                  const rzpId =
                    plan.providerMappings?.razorpay?.planId ||
                    plan.providerPlanId ||
                    (plan.planId && plan.planId.startsWith("plan_") ? plan.planId : undefined);

                  const plrId =
                    plan.providerMappings?.polar?.priceId ||
                    (plan.planId && !plan.planId.startsWith("plan_") ? plan.planId : undefined);

                  const isFree = plan.price === 0 || plan.code?.includes("free");
                  const billingUnit = plan.billingPeriod === "yearly" ? "/yr" : "/mo";
                  const usdDisplay = plan.usdPrice !== undefined ? `$${plan.usdPrice}${billingUnit}` : `$10${billingUnit}`;

                  return (
                    <tr key={plan._id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Plan Name & Badges & Description */}
                      <td className="py-4 px-6 max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{plan.name}</span>
                          {plan.isPopular && (
                            <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-black uppercase text-amber-700">
                              POPULAR
                            </span>
                          )}
                          {plan.isRecommended && (
                            <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-black uppercase text-indigo-700">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        {plan.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {plan.description}
                          </p>
                        )}
                        <p className="text-[10px] font-mono text-slate-400 mt-1">Code: {plan.code}</p>
                      </td>

                      {/* Target Role */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                            isRecruiter
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : "bg-teal-100 text-teal-800 border border-teal-200"
                          }`}
                        >
                          {isRecruiter ? "RECRUITER" : "JOB_SEEKER"}
                        </span>
                      </td>

                      {/* Domestic Price (INR) */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-900 text-sm">
                            ₹{plan.price}{billingUnit}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 mt-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            Razorpay (INR)
                          </span>
                        </div>
                      </td>

                      {/* International Price (USD) */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {isFree ? "$0" : usdDisplay}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 mt-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-sky-500"></span>
                            Polar (USD)
                          </span>
                        </div>
                      </td>

                      {/* Gateway Mappings */}
                      <td className="py-4 px-4 font-mono text-[10px]">
                        {isFree ? (
                          <span className="inline-flex rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
                            Internal Free Plan (No gateway required)
                          </span>
                        ) : (
                          <div className="flex flex-col gap-1.5">
                            {/* Razorpay Mapping */}
                            <div className="flex items-center gap-1.5">
                              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-black text-emerald-800">
                                RZP
                              </span>
                              {rzpId ? (
                                <span
                                  className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 border border-slate-200 truncate max-w-[150px]"
                                  title={`Razorpay Plan ID: ${rzpId}`}
                                >
                                  {rzpId}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic text-[10px]">Pending setup</span>
                              )}
                            </div>
                            {/* Polar Mapping */}
                            <div className="flex items-center gap-1.5">
                              <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[9px] font-black text-sky-800">
                                POLAR
                              </span>
                              {plrId ? (
                                <span
                                  className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 border border-slate-200 truncate max-w-[150px]"
                                  title={`Polar Price ID: ${plrId}`}
                                >
                                  {plrId}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic text-[10px]">Not provisioned</span>
                              )}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600 border border-emerald-100">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Active</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPlan(plan);
                              setIsModalOpen(true);
                            }}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                            title="Edit Plan"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingPlan(plan)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Soft Delete Plan"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      <MembershipPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlan}
        editingPlan={editingPlan}
      />

      {/* Confirmation Modal for Soft Delete */}
      {deletingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Confirm Soft Delete</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Are you sure you want to soft delete the plan{" "}
              <strong className="text-slate-900">"{deletingPlan.name}"</strong>? It will be marked as
              deleted and deactivated immediately, preserving past subscription histories.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingPlan(null)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-red-700 disabled:opacity-50 transition-all"
              >
                {isDeleting ? "Deleting..." : "Soft Delete Plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
