import heroTop from "@/assets/images/hero/hero-top.png";
import heroBottom from "@/assets/images/hero/hero-bottom.png";

export default function HeroImages() {
  return (
    <div className="relative hidden h-[500px] w-[520px] shrink-0 lg:block">
      {/* Top Image Card Frame */}
      <div className="absolute right-0 top-0 w-[380px] rounded-[36px] border-[3px] border-[#3C65F5] bg-white p-2 shadow-xl shadow-blue-500/10">
        <img
          src={heroTop}
          alt="Hero Top"
          className="h-[290px] w-full rounded-[28px] object-cover"
        />
      </div>

      {/* Bottom Image Card Frame */}
      <div className="absolute bottom-2 left-0 z-10 w-[340px] rounded-[32px] border-[3px] border-[#3C65F5] bg-white p-2 shadow-2xl shadow-blue-500/15">
        <img
          src={heroBottom}
          alt="Hero Bottom"
          className="h-[210px] w-full rounded-[24px] object-cover"
        />
      </div>
    </div>
  );
}