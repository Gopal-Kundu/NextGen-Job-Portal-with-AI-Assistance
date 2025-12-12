import React from 'react';
import ResumeNavBar from '../Component/ResumeNavBar';
import Resume1 from '../Resume Pages/Resume1';

export const ChooseTemplatePage = () => {

    

    return (
        <div className="min-h-screen bg-white">
            {/* Header / Navigation Bar */}
            <ResumeNavBar flag1 = "true"/>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 text-center">
                {/* Heading */}
                <h1 className="text-6xl font-extrabold tracking-tight text-gray-800 mb-6 leading-tight">
                    Resume templates
                </h1>
                {/* choose template  */}
                <div>
                    <div className='scale-[0.3] origin-top-left'>
                        <Resume1/>
                    </div>
                </div>
            </main>
        </div>
    );
}
