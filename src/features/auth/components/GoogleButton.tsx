interface GoogleButtonProps {
  text: string;
}

export default function GoogleButton({
  text,
}: GoogleButtonProps) {
  return (
    <button
      type="button"
      className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-base font-medium text-[#05264E] transition hover:border-[#3C65F5] hover:bg-slate-50"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="h-6 w-6"
      />

      <span>{text}</span>
    </button>
  );
}