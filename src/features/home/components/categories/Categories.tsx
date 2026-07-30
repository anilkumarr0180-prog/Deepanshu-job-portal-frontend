import CategorySlider from "./CategorySlider";

const Categories = () => {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-5">

        <div className="mb-14 text-center">
          <h2 className="text-5xl font-bold text-[#05264E]">
            Browse by category
          </h2>

          <p className="mt-4 text-lg text-gray-500">
            Find the job that's perfect for you. About 800+
            new jobs every day.
          </p>
        </div>

        <CategorySlider />

      </div>
    </section>
  );
};

export default Categories;