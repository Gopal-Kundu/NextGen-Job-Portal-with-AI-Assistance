import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import DashBoardForm from '../ui/DashBoardForm';

const profiles = [
  {
    id: 'FD',
    title: 'Frontend Developer',
    skills: 'React.js, DOM manipulation, CSS Flexbox',
    experience: '2 Years',
    qaCount: '10 Q&A',
    lastUpdated: '30th Apr 2025',
    description: 'Preparing for product-based company interviews',
    bgColor: 'bg-teal-50',
  },
  {
    id: 'BD',
    title: 'Backend Developer',
    skills: 'Node.js, Express, REST APIs, MongoDB',
    experience: '3 Years',
    qaCount: '20 Q&A',
    lastUpdated: '1st May 2025',
    description: 'Want to master backend system design and performance',
    bgColor: 'bg-yellow-50',
  },
  {
    id: 'FS',
    title: 'Full Stack Developer',
    skills: 'MERN stack, deployment strategies, authentication',
    experience: '4 Years',
    qaCount: '10 Q&A',
    lastUpdated: '30th Apr 2025',
    description: 'Getting ready for startup tech rounds',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'DA',
    title: 'Data Analyst',
    skills: 'SQL, Excel, Data Visualization, Power BI',
    experience: '2 Years',
    qaCount: '10 Q&A',
    lastUpdated: '30th Apr 2025',
    description: 'Targeting analyst roles in finance domain',
    bgColor: 'bg-orange-50',
  },
  {
    id: 'DE',
    title: 'DevOps Engineer',
    skills: 'CI/CD, Docker, Kubernetes, AWS',
    experience: '5 Years',
    qaCount: '10 Q&A',
    lastUpdated: '30th Apr 2025',
    description: 'Switching to a cloud-native role with more automation',
    bgColor: 'bg-sky-50',
  },
  {
    id: 'UD',
    title: 'UI/UX Designer',
    skills: 'Figma, user journey, wireframing, accessibility',
    experience: '3 Years',
    qaCount: '10 Q&A',
    lastUpdated: '30th Apr 2025',
    description: 'Preparing for top product design interviews',
    bgColor: 'bg-gray-100',
  },
  {
    id: 'MA',
    title: 'Mobile App Developer',
    skills: 'React Native, Flutter, performance optimization',
    experience: '2 Years',
    qaCount: '10 Q&A',
    lastUpdated: '30th Apr 2025',
    description: 'Need cross-platform expertise for startup interviews',
    bgColor: 'bg-pink-50',
  },
  {
    id: 'AE',
    title: 'AI/ML Engineer',
    skills: 'Python, scikit-learn, model deployment, NLP',
    experience: '1 Year',
    qaCount: '10 Q&A',
    lastUpdated: '30th Apr 2025',
    description: 'Cracking ML internship and entry-level roles',
    bgColor: 'bg-green-50',
  },
  {
    id: 'PM',
    title: 'Product Manager',
    skills: 'Roadmapping, user stories, KPIs, stakeholder communication',
    experience: '4 Years',
    qaCount: '10 Q&A',
    lastUpdated: '30th Apr 2025',
    description: 'Pivoting into tech PM from business analyst background',
    bgColor: 'bg-purple-50',
  }
];

const Dashboard = () => {
    const [openForm, setOpenForm] = useState(false);
  return (
    <>
    <div className="h-full relative flex items-center">
                    <Sidebar highlightIndex={6} />
                    <Navbar />
                </div>
    <div className="relative min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      
      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {profiles.map((profile, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
          >
            {/* Top Colored Header Section */}
            <div className={`p-4 rounded-xl flex items-start gap-4 ${profile.bgColor}`}>
              {/* Initials Icon */}
              <div className="bg-white h-12 w-12 rounded-lg flex items-center justify-center font-bold text-gray-800 shadow-sm shrink-0">
                {profile.id}
              </div>
              
              {/* Title and Skills */}
              <div>
                <h3 className="font-semibold text-gray-900">{profile.title}</h3>
                <p className="text-xs text-gray-600 mt-1 leading-snug">{profile.skills}</p>
              </div>
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2 mt-5 mb-4">
              <span className="border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-600 whitespace-nowrap">
                Experience: {profile.experience}
              </span>
              <span className="border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-600 whitespace-nowrap">
                {profile.qaCount}
              </span>
              <span className="border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-600 whitespace-nowrap">
                Last Updated: {profile.lastUpdated}
              </span>
            </div>

            {/* Bottom Description */}
            <div className="mt-auto pt-2">
              <p className="text-sm text-gray-500">{profile.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button onClick = {()=>setOpenForm(true)} className="fixed bottom-10 right-10 bg-orange-400 hover:bg-orange-500 text-white flex items-center gap-2 px-6 py-3 rounded-full font-medium shadow-lg transition-colors duration-200 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add New
      </button>
      
    </div>

    {
        openForm ? <DashBoardForm onClose = {()=>setOpenForm(false)}/> : null
    }
    </>
  );
};

export default Dashboard;