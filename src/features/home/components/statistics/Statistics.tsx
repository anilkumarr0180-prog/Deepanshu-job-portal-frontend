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
    <section className="bg-white dark:bg-[#0B1220] pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STATISTICS_DATA.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center"
            >
              {/* Large Statistic Number */}
              <span className="text-4xl font-extrabold leading-tight tracking-tight text-[#3C65F5] sm:text-5xl lg:text-[54px]">
                {stat.value}
              </span>

              {/* Statistic Title */}
              <h3 className="mt-3 text-lg font-bold text-[#05264E] dark:text-[#F1F5F9] sm:text-xl">
                {stat.title}
              </h3>

              {/* Statistic Description */}
              <p className="mt-2.5 max-w-[230px] text-xs font-normal leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
