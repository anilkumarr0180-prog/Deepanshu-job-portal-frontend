interface StatisticItem {
  value: string;
  title: string;
  description: string;
}

const STATISTICS_DATA: StatisticItem[] = [
  {
    value: "25 K+",
    title: "Completed Cases",
    description: "We always provide people a complete solution upon focused of any business",
  },
  {
    value: "17 +",
    title: "Our Office",
    description: "We always provide people a complete solution upon focused of any business",
  },
  {
    value: "86 +",
    title: "Skilled People",
    description: "We always provide people a complete solution upon focused of any business",
  },
  {
    value: "28 +",
    title: "Happy Clients",
    description: "We always provide people a complete solution upon focused of any business",
  },
];

export default function Statistics() {
  return (
    <section className="bg-white dark:bg-[#0B132B] pt-[20px] pb-[25px] sm:pt-[25px] sm:pb-[30px] lg:pt-[30px] lg:pb-[35px]">
      <div className="mx-auto max-w-[1140px] px-[12px]">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STATISTICS_DATA.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center"
            >
              {/* Large Statistic Number */}
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[40px] sm:text-[46px] lg:text-[48px] font-extrabold leading-tight tracking-tight text-[#3C65F5]">
                {stat.value}
              </span>

              {/* Statistic Title */}
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] mt-2 text-[17px] sm:text-[18px] font-bold text-[#05264E] dark:text-[#F1F5F9]">
                {stat.title}
              </h3>

              {/* Statistic Description */}
              <p className="font-['Plus_Jakarta_Sans',sans-serif] mt-2 max-w-[220px] text-[13px] font-normal leading-[22px] text-[#66789C] dark:text-slate-400">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
