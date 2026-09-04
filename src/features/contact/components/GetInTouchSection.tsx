import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import contactImg from "@/assets/images/contact/img.png";
import { contactFormSchema, type ContactFormData } from "../types/contact.types";
import { submitContactMessage } from "../api/contact.api";

export default function GetInTouchSection() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      message: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setApiError(null);
    setSubmitSuccess(false);

    try {
      const result = await submitContactMessage(data);
      toast.success(result.message || "Thank you! Your message has been sent successfully.");
      setSubmitSuccess(true);
      reset({
        name: "",
        company: "",
        email: "",
        phone: "",
        message: "",
        agreeTerms: false,
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.message ||
        "Failed to send your message. Please try again later.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <section className="section-box mt-[50px] lg:mt-[70px] mb-[60px] lg:mb-[80px]">
      <div className="container mx-auto max-w-[1140px] px-[12px]">
        <div className="flex flex-wrap -mx-[12px] items-start">
          
          {/* Left Column: Form (8 cols / 66.666% width) */}
          <div className="w-full lg:w-8/12 px-[12px] mb-[40px]">
            {/* Tagline */}
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[16px] font-bold text-[#3C65F5] dark:text-[#5E81FF] inline-block mb-[6px]">
              Contact us
            </span>

            {/* Heading */}
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[36px] font-bold leading-[45px] text-[#05264E] dark:text-[#F1F5F9] mb-[10px]">
              Get in touch
            </h2>

            {/* Description */}
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[16px] font-normal leading-[26px] text-[#66789C] dark:text-slate-400 mb-[30px] max-w-[680px]">
              The right move at the right time saves your investment. live the dream of expanding your business.
            </p>

            {/* Status alerts */}
            {submitSuccess && (
              <div className="mb-6 rounded-[8px] border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[14px] font-medium">
                    Thank you! Your message has been sent successfully. We will get back to you shortly.
                  </span>
                </div>
              </div>
            )}

            {apiError && (
              <div className="mb-6 rounded-[8px] border border-rose-200 bg-rose-50 p-4 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[14px] font-medium">{apiError}</span>
                </div>
              </div>
            )}

            {/* Contact Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="contact-form-style space-y-[20px]"
              noValidate
            >
              {/* Row 1: Name & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                <div>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    disabled={isSubmitting}
                    {...register("name")}
                    className={`h-[50px] w-full rounded-[8px] border bg-white px-[20px] text-[14px] text-[#05264E] placeholder:text-[#A0ABB8] focus:border-[#3C65F5] focus:outline-none dark:bg-[#111A2B] dark:text-slate-200 transition-colors disabled:opacity-60 ${
                      errors.name
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#E0E6F7] dark:border-slate-800"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Comapy (optioanl)"
                    disabled={isSubmitting}
                    {...register("company")}
                    className="h-[50px] w-full rounded-[8px] border border-[#E0E6F7] bg-white px-[20px] text-[14px] text-[#05264E] placeholder:text-[#A0ABB8] focus:border-[#3C65F5] focus:outline-none dark:border-slate-800 dark:bg-[#111A2B] dark:text-slate-200 transition-colors disabled:opacity-60"
                  />
                  {errors.company && (
                    <p className="mt-1 text-xs text-red-500">{errors.company.message}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                <div>
                  <input
                    type="email"
                    placeholder="Your email"
                    disabled={isSubmitting}
                    {...register("email")}
                    className={`h-[50px] w-full rounded-[8px] border bg-white px-[20px] text-[14px] text-[#05264E] placeholder:text-[#A0ABB8] focus:border-[#3C65F5] focus:outline-none dark:bg-[#111A2B] dark:text-slate-200 transition-colors disabled:opacity-60 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#E0E6F7] dark:border-slate-800"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    disabled={isSubmitting}
                    {...register("phone")}
                    className="h-[50px] w-full rounded-[8px] border border-[#E0E6F7] bg-white px-[20px] text-[14px] text-[#05264E] placeholder:text-[#A0ABB8] focus:border-[#3C65F5] focus:outline-none dark:border-slate-800 dark:bg-[#111A2B] dark:text-slate-200 transition-colors disabled:opacity-60"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Message Textarea */}
              <div>
                <textarea
                  rows={8}
                  placeholder="Tell us about yourself"
                  disabled={isSubmitting}
                  {...register("message")}
                  className={`w-full h-[150px] resize-none rounded-[8px] border bg-white p-[20px] text-[14px] text-[#05264E] placeholder:text-[#A0ABB8] focus:border-[#3C65F5] focus:outline-none dark:bg-[#111A2B] dark:text-slate-200 transition-colors disabled:opacity-60 ${
                    errors.message
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#E0E6F7] dark:border-slate-800"
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
                )}
              </div>

              {/* Row 4: Submit Button & Policy Checkbox */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[8px] bg-[#3C65F5] px-[28px] text-[14px] font-bold text-white shadow-xs transition-all hover:bg-[#05264E] dark:hover:bg-[#2B4FC7] shrink-0 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting && (
                    <svg
                      className="h-4 w-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}
                  <span>{isSubmitting ? "Sending message..." : "Send message"}</span>
                </button>

                <div className="flex flex-col">
                  <label className="flex items-center gap-2.5 text-[13px] text-[#66789C] dark:text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      disabled={isSubmitting}
                      {...register("agreeTerms")}
                      className="h-4 w-4 rounded border-[#E0E6F7] text-[#3C65F5] focus:ring-0 cursor-pointer accent-[#3C65F5] disabled:opacity-60"
                    />
                    <span>By clicking contact us button, you agree our terms and policy.</span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="mt-1 text-xs text-red-500">{errors.agreeTerms.message}</p>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Overlapping Images (4 cols / 33.333% width) */}
          <div className="w-full lg:w-4/12 px-[12px] text-right hidden lg:block">
            <div className="relative inline-block w-full max-w-[374px]">
              <img
                src={contactImg}
                alt="JobBox Contact Team"
                className="w-full h-auto rounded-[16px]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
