import HeroContent from "./HeroContent";
import HeroImages from "./HeroImages";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-[#F2F6FD]">
      <div className="mx-auto flex min-h-[540px] max-w-[1320px] items-center justify-between px-8 pt-[65px] pb-[15px]">
        {/* Left Content */}
        <HeroContent />

        {/* Right Images */}
        <HeroImages />
      </div>
    </section>
  );
}