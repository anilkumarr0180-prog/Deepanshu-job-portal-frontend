import heroTop from "@/assets/images/hero/hero-top.png";
import heroBottom from "@/assets/images/hero/hero-bottom.png";

export default function HeroImages() {
  return (
    <div className="relative w-[480px] h-[450px]">
      {/* Top Right Dot Matrix Pattern */}
      <div className="absolute right-[20px] -top-[12px] z-0 grid grid-cols-6 gap-[8px] opacity-75 dark:opacity-40 pointer-events-none">
        {Array.from({ length: 48 }).map((_, i) => (
          <span key={i} className="h-[3.5px] w-[3.5px] rounded-full bg-[#8CA0BF] dark:bg-[#5E81FF]" />
        ))}
      </div>

      {/* Top Image (Floating animation) */}
      <div className="animate-hero-float-1 absolute left-0 top-0 z-10 w-[390px]">
        <img
          src={heroTop}
          alt="Job seekers finding career opportunities"
          className="w-full h-auto object-contain select-none"
        />
      </div>

      {/* Bottom Left Dot Matrix Pattern */}
      <div className="absolute left-[15px] top-[215px] z-0 grid grid-cols-11 gap-[7px] opacity-75 dark:opacity-40 pointer-events-none">
        {Array.from({ length: 44 }).map((_, i) => (
          <span key={i} className="h-[3.5px] w-[3.5px] rounded-full bg-[#8CA0BF] dark:bg-[#5E81FF]" />
        ))}
      </div>

      {/* Bottom Image (Overlaps lower-right of top image) */}
      <div className="animate-hero-float-2 absolute left-[105px] top-[210px] z-20 w-[355px]">
        <img
          src={heroBottom}
          alt="Professionals shaking hands after successful job placement"
          className="w-full h-auto object-contain select-none"
        />
      </div>
    </div>
  );
}