import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

import useAuth from "@/features/auth/hooks/useAuth";

import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

export default function CandidateSettingsPage() {
  const { logout } = useAuth();

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useProfile();

  const updateProfileMutation = useUpdateProfile();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    profilePicture: "",
  });

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    updateProfileMutation.mutate(
      {
        name: form.name,
        phone: form.phone,
        profilePicture: form.profilePicture,
      },
      {
        onSuccess: () => {
          void refetch();
        },
      }
    );
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
        <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
        <div className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
        <div className="h-40 animate-pulse rounded-2xl border border-red-100 bg-red-50" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        Failed to load settings. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">
          Account Information
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Your account details retrieved from the server.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Name
            </label>
            <p className="text-sm text-slate-900">{profile.name}</p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Email
            </label>
            <p className="text-sm text-slate-900">{profile.email}</p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Phone
            </label>
            <p className="text-sm text-slate-900">
              {profile.phone || "Not provided"}
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Role
            </label>
            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
              {profile.role}
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">
          Profile Preferences
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Update your public profile information.
        </p>

        <form onSubmit={handleSave} className="mt-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Display Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm placeholder:text-slate-300 focus:border-[#3C65F5] focus:outline-none"
                placeholder="Enter your display name"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm placeholder:text-slate-300 focus:border-[#3C65F5] focus:outline-none"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Profile Picture URL
              </label>
              <input
                type="url"
                value={form.profilePicture}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    profilePicture: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm placeholder:text-slate-300 focus:border-[#3C65F5] focus:outline-none"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="rounded-lg bg-[#3C65F5] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Resume</h3>
        <p className="mt-1 text-sm text-slate-500">
          Manage your resume link.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {profile.resumeUrl ? (
            <>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Open Resume
              </a>
              <Link
                to="/candidate/resume"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Go To Resume Page
              </Link>
            </>
          ) : (
            <Link
              to="/candidate/resume"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3C65F5] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              Add Resume
            </Link>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
        <p className="mt-1 text-sm text-red-700">
          Once you log out, you will need to sign in again to access your
          account.
        </p>
        <div className="mt-5">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </section>
    </div>
  );
}
