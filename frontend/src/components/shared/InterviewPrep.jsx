import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const InterviewPrep = () => {
    return (
        <>
            <div className="h-full relative flex items-center">
                <Sidebar highlightIndex={6} />
                <Navbar />
            </div>

            <div className="min-h-screen bg-white font-sans text-gray-900">
                <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-[#a286e3] leading-tight mb-8">
                        Are you tired of the stress and <br className="hidden md:block" />
                        anxiety that comes with <br className="hidden md:block" />
                        preparing for a live job interview?
                    </h1>

                    <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Look no further than{" "}
                        <span className="font-bold text-gray-700">Interview Prep AI</span>!
                        Which uses cutting-edge artificial intelligence technology to
                        simulate real job interviews, giving you the opportunity to
                        practice and perfect your skills before the big day.
                    </p>

                    <div className="max-w-3xl mx-auto flex flex-col gap-4">
                        <div className="w-full max-w-3xl mx-auto">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white border border-gray-200 rounded-2xl p-3 shadow-sm overflow-hidden">
                                <input
                                    type="text"
                                    placeholder="Enter Skill, Role or Job Description"
                                    className="w-full min-w-0 px-4 py-3 text-sm sm:text-base text-gray-700 rounded-xl outline-none placeholder:text-gray-400"
                                />
                                <button className="cursor-pointer w-full sm:w-auto shrink-0 px-6 py-3 bg-[#a286e3] text-white rounded-xl font-semibold hover:bg-purple-500 transition">
                                    Search
                                </button>
                            </div>
                        </div>


                    </div>
                </section>

                <section className="bg-gray-50 py-20">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center mb-16">
                            How it works
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {[
                                {
                                    title: "Fill out initial information",
                                    desc: "Fill out information such as job description, interview type, language.",
                                },
                                {
                                    title: "Practice interviews",
                                    desc: "Practice multiple live iterations of your interview by talking with our AI and get feedback.",
                                },
                                {
                                    title: "Data stays private",
                                    desc: "The information you provide will remain private. We do not store any of this data.",
                                },
                            ].map((step, idx) => (
                                <div key={idx} className="flex flex-col gap-3">
                                    <h3 className="text-xl font-bold text-gray-800 italic">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
};

export default InterviewPrep;