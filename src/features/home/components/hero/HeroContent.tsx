import HeroSearch from "./HeroSearch";

export default function HeroContent() {
  return (
    <div className="max-w-[600px]">
      {/* Heading */}
      <h1 className="text-[60px] font-extrabold leading-[1.1] tracking-[-1px] text-[#05264E]">
        The{" "}
        <span className="text-[#3C65F5]">
          Easiest Way
        </span>
        <br />
        to Get Your New
        <br />
        Job
      </h1>

      {/* Description */}
      <p className="mt-8 max-w-[560px] text-[20px] leading-[40px] text-[#66789C]">
        Each month, more than 3 million job seekers turn to website in their
        search for work, making over 140,000 applications every single day.
      </p>

      {/* Search */}
      <HeroSearch />
    </div>
  );
}