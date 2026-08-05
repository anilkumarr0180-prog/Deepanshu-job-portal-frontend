import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  leftIllustration?: string;
  rightIllustration?: string;
}

export default function AuthLayout({
  children,
  leftIllustration,
  rightIllustration,
}: AuthLayoutProps) {
  return (
    <section className="relative min-h-[calc(100vh-84px)] overflow-hidden bg-white">
      {/* Left Bottom Background Illustration */}
      {leftIllustration && (
        <div className="pointer-events-none absolute bottom-0 left-0 z-0 hidden w-[360px] select-none lg:block xl:w-[460px]">
          <img
            src={leftIllustration}
            alt="Decoration Left"
            className="h-auto w-full object-contain object-left-bottom opacity-90"
          />
        </div>
      )}

      {/* Right Floating Background Illustration */}
      {rightIllustration && (
        <div className="pointer-events-none absolute right-6 top-[28%] z-0 hidden w-[220px] select-none lg:block xl:right-16 xl:w-[260px]">
          <img
            src={rightIllustration}
            alt="Decoration Right"
            className="h-auto w-full object-contain"
          />
        </div>
      )}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-84px)] max-w-7xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </section>
  );
}