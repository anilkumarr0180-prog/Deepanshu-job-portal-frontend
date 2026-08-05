import HeroContent from "./HeroContent";
import HeroImages from "./HeroImages";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F2F6FD] py-12 lg:py-16">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Content */}
        <HeroContent />

        {/* Right Images */}
        <HeroImages />
      </div>
    </section>
  );
}