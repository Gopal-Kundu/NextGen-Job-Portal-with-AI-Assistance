import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const InterviewPrep = () => {
    const navigate = useNavigate();
    const user = useSelector((store) => store.auth.user);
    return (
        <>
            <div className="h-full relative flex items-center">
                <Sidebar highlightIndex={6} />
                <Navbar />
            </div>

            <div className="min-h-screen bg-white font-sans text-gray-900">
                <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-[#8400db] leading-tight mb-8">
                        Are you tired of the stress and <br className="hidden md:block" />
                        anxiety that comes with <br className="hidden md:block" />
                        preparing for a live job interview ?
                    </h1>

                    <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Look no further than
                        <span className="font-bold text-gray-700">Interview Prep AI</span>!
                        Which uses cutting-edge artificial intelligence technology to
                        simulate real job interviews, giving you the opportunity to
                        practice and perfect your skills before the big day.
                    </p>    

                    <div className="max-w-3xl mx-auto flex flex-col gap-4">
                                <button onClick={user ? ()=>navigate("/interviewPrep/dashboard") : ()=>navigate("/login")} className="cursor-pointer w-full sm:w-auto shrink-0 px-6 py-3 bg-[#a286e3] text-white rounded-xl font-semibold hover:bg-purple-500 transition">
                                    Start Prepration
                                </button>
                            </div>
                </section>
            </div>
                            <Footer />
        </>
    );
};

export default InterviewPrep;