import heroTop from "@/assets/images/hero/hero-top.png";
import heroBottom from "@/assets/images/hero/hero-bottom.png";

export default function HeroImages() {
  return (
    <div className="relative hidden h-[560px] w-[520px] lg:block">
      {/* Top Image */}
      <img
        src={heroTop}
        alt="Hero Top"
        className="absolute right-0 top-0 w-[380px] rounded-[40px]"
      />

      {/* Bottom Image */}
      <img
        src={heroBottom}
        alt="Hero Bottom"
        className="absolute bottom-0 left-0 w-[340px] rounded-[30px]"
      />
    </div>
  );
}