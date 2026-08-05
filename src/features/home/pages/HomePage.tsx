import { Hero } from "../components/hero";
import { Categories } from "../components/categories";
import { JobsOfDay } from "../components/jobs-of-day";
import { MillionsOfJobs } from "../components/millions-of-jobs";

const HomePage = () => {
  return (
    <>
      <Hero />
      <Categories />
      <JobsOfDay />
      <MillionsOfJobs />
    </>
  );
};

export default HomePage;