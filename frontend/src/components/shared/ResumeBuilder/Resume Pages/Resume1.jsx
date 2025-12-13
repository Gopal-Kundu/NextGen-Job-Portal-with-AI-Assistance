import React from "react";

export default function Resume1() {
  return (
    <div className="w-full flex justify-center bg-gradient-to-br from-blue-50 to-purple-100 py-10 print:bg-white font-inter">
      <div className="bg-white shadow-2xl p-10 rounded-2xl w-[800px] min-h-[1120px] border border-gray-200">
        {/* Header */}
        <header className="flex items-center gap-6 border-b pb-6 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl text-white shadow-md">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Gopal Kundu</h1>
            <p className="text-lg opacity-90">Full Stack Developer</p>
            <p className="text-sm mt-1 opacity-80">email@example.com | +91 00000 00000 | yourwebsite.com</p>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8 mt-10">
          {/* Left Sidebar */}
          <div className="col-span-1 space-y-8">
            {/* Skills */}
            <section className="bg-gradient-to-b from-purple-50 to-blue-50 p-4 rounded-xl shadow-sm border border-purple-100">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-1">Skills</h2>
              <ul className="mt-3 space-y-1 text-gray-700 text-sm">
                <li className="hover:text-purple-700">JavaScript (ES6+)</li>
                <li className="hover:text-purple-700">React.js</li>
                <li className="hover:text-purple-700">Node.js</li>
                <li className="hover:text-purple-700">Express.js</li>
                <li className="hover:text-purple-700">MongoDB</li>
                <li className="hover:text-purple-700">Tailwind CSS</li>
              </ul>
            </section>

            {/* Education */}
            <section className="bg-gradient-to-b from-blue-50 to-purple-50 p-4 rounded-xl shadow-sm border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-1">Education</h2>
              <div className="mt-3 text-sm text-gray-700">
                <p className="font-medium">B.Tech in Computer Science</p>
                <p>XYZ University</p>
                <p className="text-gray-500 text-xs">2022 - 2026</p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-b from-purple-50 to-indigo-50 p-4 rounded-xl shadow-sm border border-indigo-100">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-1">Contact</h2>
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>Email: email@example.com</p>
                <p>Phone: +91 00000 00000</p>
                <p>Location: Kolkata, India</p>
              </div>
            </section>
          </div>

          {/* Right Main Section */}
          <div className="col-span-2 space-y-8">
            {/* Summary */}
            <section className="p-6 rounded-xl bg-white shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-1">Professional Summary</h2>
              <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                Passionate MERN stack developer experienced in building scalable applications and solving problems with clean, maintainable code. Adept at full-stack development and integrating AI-based features.
              </p>
            </section>

            {/* Experience */}
            <section className="p-6 rounded-xl bg-white shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-1">Experience</h2>
              <div className="mt-3 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Full Stack Developer Intern</h3>
                  <p className="text-sm text-gray-500">ABC Company | Jan 2024 - Jun 2024</p>
                  <ul className="list-disc ml-5 mt-2 text-sm text-gray-700 space-y-1">
                    <li>Developed REST APIs using Express.js and MongoDB.</li>
                    <li>Integrated frontend with React.js and Tailwind CSS.</li>
                    <li>Worked on authentication, authorization, and role-based access systems.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">MERN Stack Developer</h3>
                  <p className="text-sm text-gray-500">Freelance | 2023 - Present</p>
                  <ul className="list-disc ml-5 mt-2 text-sm text-gray-700 space-y-1">
                    <li>Built dynamic web apps including job portals and e-commerce systems.</li>
                    <li>Integrated AI modules using machine learning APIs.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Projects */}
            <section className="p-6 rounded-xl bg-white shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-1">Projects</h2>
              <div className="mt-3 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">AI Job Portal</h3>
                  <ul className="list-disc ml-5 mt-2 text-sm text-gray-700 space-y-1">
                    <li>MERN stack project with full CRUD operations.</li>
                    <li>AI-based job recommendations and resume analysis.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">E-Commerce Platform</h3>
                  <ul className="list-disc ml-5 mt-2 text-sm text-gray-700 space-y-1">
                    <li>Developed product pages, cart handling, and user authentication.</li>
                    <li>Implemented payment gateway and admin dashboard.</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}