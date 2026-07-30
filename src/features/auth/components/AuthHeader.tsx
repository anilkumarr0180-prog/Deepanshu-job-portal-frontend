interface AuthHeaderProps {
  badge: string;
  title: string;
  subtitle: string;
}

export default function AuthHeader({
  badge,
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <div className="mb-10 text-center">
      <p className="mb-3 text-sm font-medium text-[#3C65F5]">
        {badge}
      </p>

      <h1 className="text-5xl font-extrabold tracking-[-1px] text-[#05264E]">
        {title}
      </h1>

      <p className="mt-4 text-lg text-[#66789C]">
        {subtitle}
      </p>
    </div>
  );
}