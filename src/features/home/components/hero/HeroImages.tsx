import heroTop from "@/assets/images/hero/hero-top.png";
import heroBottom from "@/assets/images/hero/hero-bottom.png";
import iconTopBanner from "@/assets/images/hero/icon-top-banner.png";
import iconBottomBanner from "@/assets/images/hero/icon-bottom-banner.png";

export default function HeroImages() {
  return (
    <div className="banner-imgs relative w-[480px] h-[600px]">
      {/* Block 1: Top Image (shape-1) */}
      <div className="block-1 shape-1 absolute left-0 top-0 z-10 w-[365px]">
        <img
          src={heroTop}
          alt="JobBox"
          className="img-responsive w-full h-auto object-contain select-none"
        />
      </div>

      {/* Block 3: Top Banner Icon Overlay (shape-3) */}
      <div className="block-3 shape-3 absolute left-[210px] top-[25px] z-20 w-[95px] pointer-events-none select-none">
        <img
          src={iconTopBanner}
          alt="JobBox"
          className="img-responsive w-full h-auto select-none"
        />
      </div>

      {/* Block 4: Bottom Banner Icon (shape-3) */}
      <div className="block-4 shape-3 absolute left-[0px] top-[420px] z-10 w-[95px] pointer-events-none select-none opacity-80 dark:opacity-40">
        <img
          src={iconBottomBanner}
          alt="JobBox"
          className="img-responsive w-full h-auto select-none"
        />
      </div>

      {/* Block 2: Bottom Image (shape-2) */}
      <div className="block-2 shape-2 absolute left-[110px] top-[360px] z-20 w-[345px]">
        <img
          src={heroBottom}
          alt="JobBox"
          className="img-responsive w-full h-auto object-contain select-none"
        />
      </div>
    </div>
  );
}