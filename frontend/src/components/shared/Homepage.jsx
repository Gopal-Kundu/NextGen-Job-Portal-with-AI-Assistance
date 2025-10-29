import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import Footer from "./Footer";
import Navbar from "./Navbar";
import JobsListing from "./JobsListing";
import Sidebar from "./Sidebar";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile App Developer",
  "UI/UX Designer",
  "Data Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "QA Engineer",
  "Product Manager",
  "Business Analyst",
  "Cybersecurity Specialist",
  "Blockchain Developer",
];

export default function Homepage() {

  return (
    <>
        <div className="h-full relative flex items-center">
        <Sidebar highlightIndex={1} className="bg-gray-500"/><Navbar/>
      </div>
        {/* Hero Section */}
        <div className="min-h-[800px] h-full bg-gray-50 p-4 select-none md:select-auto w-full">
          <main className="mt-8 text-center">
            <span className="inline-block bg-red-100 text-red-500 text-sm font-semibold px-4 py-1 rounded-full mb-4">
              No. 1 Job Hunt Website
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Search, Apply
              <br />
              Get Your <span className="text-purple-700">Dream Jobs</span>
            </h2>
            <div className="mt-10 max-w-2xl mx-auto">
              <div className="relative ">
                <input
                  id="job-search"
                  name="jobSearch"
                  className="w-full h-16 p-5 rounded-full text-xl md:text-3xl text-gray-700 focus:outline-none focus:border-indigo-500 border border-black"
                  placeholder="Find your dream jobs"
                  type="text"
                />

                <button className="active:scale-90 absolute right-2 top-1/2 -translate-y-1/2 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700">
                  <span className="inline-block material-icons scale-140 transition-transform duration-200 cursor-pointer">
                    search
                  </span>
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="mt-12 flex justify-center items-center">
              <Carousel
                className="w-3/4"
                plugins={[
                  Autoplay({
                    delay: 3000,
                  }),
                ]}
              >
                <CarouselContent className="-ml-0 gap-2">
                  {roles.map((role, idx) => (
                    <CarouselItem
                      key={idx}
                      className="basis-1/1 md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="active:scale-90 p-3 hover:bg-gray-100 rounded-2xl border border-black cursor-pointer transition-transform duration-300 select-none">
                        {role}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious className="hover:scale-140 transition-transform duration-200 scale-130 p-3 rounded-xl border border-gray-900 shadow-md" />
                <CarouselNext className="hover:scale-140 transition-transform duration-200 scale-125 p-3 rounded-xl border border-gray-900 shadow-md" />
              </Carousel>
            </div>
          </main>

          {/* Job Openings */}
          <h3 className="text-3xl font-bold text-gray-800 mt-10">
            <span className="text-purple-700">Latest and Top</span> Job Openings
          </h3>
          <JobsListing showJobs={3} smallDevice={"hidden md:block"} />
        </div>
          <Footer/>
    </>
  );
}
