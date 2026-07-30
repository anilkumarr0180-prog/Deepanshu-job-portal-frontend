import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <section className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </section>
  );
}