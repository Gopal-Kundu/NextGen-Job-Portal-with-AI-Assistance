import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// --- MOCK DATA ---
const qaData = [
  {
    id: 1,
    question: "Explain the core principles of CI/CD and why they're important.",
    shortAnswer: "CI/CD stands for Continuous Integration and Continuous Delivery/Deployment. Continuous Integration involves frequently merging code changes into a central repository, followed by automated builds and tests. Continuous Delivery ensures that code changes are automatically prepared for release to production. Continuous Deployment automatically releases changes to production if they pass all tests.\n\nThese principles are important because they enable faster and more reliable software releases. Frequent integration reduces the risk of integration conflicts. Automated testing catches bugs early. Automated deployment minimizes manual errors and accelerates the release cycle. This leads to quicker feedback loops, improved software quality, and increased agility.",
    detailedAnswer: {
      title: "CI/CD Deep Dive: Principles & Practices",
      content: "Continuous Integration (CI) and Continuous Deployment (CD) form the backbone of modern DevOps methodologies.\n\nKey Principles:\n• Single Source of Truth: All code, configurations, and deployment scripts should live in a version control system.\n• Automated Builds: Every commit should automatically trigger a build process to compile code and run unit tests.\n• Shift-Left Testing: Integrating testing early in the development lifecycle to catch bugs before they reach production.\n• Immutable Infrastructure: Deployments should replace existing instances rather than modifying them in place, reducing configuration drift.\n\nWhy it matters:\nOrganizations implementing robust CI/CD pipelines report 400x faster lead times from commit to deploy, and significantly lower change failure rates."
    }
  },
  {
    id: 2,
    question: "Describe the benefits of using Docker for containerization.",
    shortAnswer: "Docker allows you to package applications and their dependencies into portable containers. The benefits include:\n\n• Portability: Containers run consistently across different environments (development, testing, production).\n• Isolation: Containers isolate applications from each other, preventing conflicts.\n• Efficiency: Containers share the host OS kernel, making them lightweight and resource-efficient compared to virtual machines.\n• Scalability: Docker makes it easy to scale applications by running multiple container instances.\n• Version Control: Docker images can be version-controlled, making it easy to roll back to previous versions.\n\nThis leads to faster deployments, reduced operational costs, and easier management of complex applications.",
    detailedAnswer: {
      title: "Docker Benefits: Containerization Advantages",
      content: "Okay, let's break down why Docker and containerization are so popular. Imagine you're building a house. Instead of building everything from scratch on-site (like deploying code directly on a server), you can prefabricate parts - walls, roof, etc. - in a factory (Docker image) and then quickly assemble them on the construction site (Docker container).\n\nDocker allows you to package your application and all its dependencies (libraries, runtime, configurations, etc.) into a self-contained unit called a container. This approach offers several significant benefits:\n\n• Consistency: Docker containers ensure that your application runs consistently across different environments. It works the same way on your laptop, a testing server, and in production. This eliminates the dreaded \"it works on my machine\" problem.\n\n• Portability: Docker containers are portable. You can easily move them between different operating systems and cloud providers.\n\n• Isolation: Each container is isolated from other containers and the host system. This prevents conflicts between applications and improves security.\n\n• Resource Efficiency: Containers are lightweight compared to virtual machines. They share the host operating system's kernel, which results in lower overhead and faster startup times."
    }
  },
  {
    id: 3,
    question: "Explain the difference between Continuous Delivery and Continuous Deployment.",
    shortAnswer: "While both involve automating the release process, Continuous Delivery requires manual intervention to push changes to production, whereas Continuous Deployment pushes passing changes to production automatically without human intervention.",
    detailedAnswer: { title: "Continuous Delivery vs Deployment", content: "Detailed explanation loading..." }
  },
  {
    id: 4,
    question: "What is Kubernetes, and what problems does it solve?",
    shortAnswer: "Kubernetes is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications.",
    detailedAnswer: { title: "Introduction to Kubernetes", content: "Detailed explanation loading..." }
  },
  {
    id: 5,
    question: "Describe the components of a Kubernetes deployment.",
    shortAnswer: "A Kubernetes deployment manages a set of identical Pods (the smallest deployable computing units). It ensures the desired number of Pods are running and handles updates and rollbacks safely.",
    detailedAnswer: { title: "Kubernetes Deployment Components", content: "Detailed explanation loading..." }
  },
  {
    id: 6,
    question: "How would you approach deploying an application to Kubernetes?",
    shortAnswer: "I would start by containerizing the application using Docker, writing a Dockerfile, pushing the image to a registry, and then creating Kubernetes manifests (Deployments, Services) to define the desired state.",
    detailedAnswer: { title: "Deploying to Kubernetes", content: "Detailed explanation loading..." }
  },
  {
    id: 7,
    question: "Explain the role of Services in Kubernetes.",
    shortAnswer: "Services provide a stable network endpoint (IP address and DNS name) to access a set of Pods, enabling load balancing and service discovery within the cluster.",
    detailedAnswer: { title: "Kubernetes Services", content: "Detailed explanation loading..." }
  },
  {
    id: 8,
    question: "Describe how you would monitor a Kubernetes cluster and its applications.",
    shortAnswer: "Monitoring Kubernetes involves tracking the health and performance of the cluster and applications. Common methods include:\n\n• Metrics Collection: Use tools like Prometheus to collect metrics (CPU usage, memory usage, network traffic) from Pods, nodes, and the Kubernetes control plane.\n• Logging: Centralize logs from containers using tools like the EFK stack (Elasticsearch, Fluentd, Kibana) or the ELK stack. Analyze logs for errors and performance issues.\n• Alerting: Set up alerts based on metric thresholds using tools like Prometheus Alertmanager. Get notified of critical issues.\n• Dashboarding: Visualize metrics and logs using dashboards like Grafana and Kibana to gain insights into the cluster's health.\n• Health Checks: Implement health checks (liveness and readiness probes) within your application containers to ensure they are functioning correctly. Kubernetes uses these probes to manage container lifecycles.\n\nRegular monitoring helps to identify and resolve issues proactively, ensuring high availability and performance.",
    detailedAnswer: { title: "Monitoring Kubernetes", content: "Detailed explanation loading..." }
  }
];

// --- ICONS ---
const Icons = {
  ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  ChevronUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>,
  Pin: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>,
  Sparkles: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>,
  Close: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  LoadMore: () =>
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>
    </svg>

};

// --- MAIN COMPONENT ---
const InterviewQAPage = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [learningMoreId, setLearningMoreId] = useState(null);
  const [isDrawerLoading, setIsDrawerLoading] = useState(false);

  // Toggle Accordion
  const toggleAccordion = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  // Open Learn More Side Panel
  const handleLearnMore = (e, id) => {
    e.stopPropagation(); // Prevent accordion from toggling when clicking this button
    setLearningMoreId(id);
    setIsDrawerLoading(true);
    
    // Simulate network loading state for the skeleton
    setTimeout(() => {
      setIsDrawerLoading(false);
    }, 1200);
  };

  const closeDrawer = () => {
    setLearningMoreId(null);
  };

  const activeDetailData = qaData.find(q => q.id === learningMoreId)?.detailedAnswer;

  return (
    <>
     <div className="h-full relative flex items-center">
                    <Sidebar highlightIndex={6} />
                    <Navbar />
                </div>
    <div className="min-h-screen bg-white text-gray-900 font-sans relative overflow-x-hidden p-6 md:p-12">
      
      {/* Background Gradient Blob (Top Right) */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-gradient-to-bl from-green-100/50 via-teal-50/50 to-purple-100/50 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Header Section */}
      <div className="max-w-[1400px] mx-auto mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">DevOps Engineer</h1>
        <p className="text-gray-600 mb-6 text-sm">CI/CD, Docker, Kubernetes, and AWS</p>
        
        <div className="flex flex-wrap gap-3">
          <span className="bg-black text-white px-3 py-1.5 rounded-full text-xs font-medium">Experience: 5 Years</span>
          <span className="bg-black text-white px-3 py-1.5 rounded-full text-xs font-medium">10 Q&A</span>
          <span className="bg-black text-white px-3 py-1.5 rounded-full text-xs font-medium">Last Updated: 3rd May 2025</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto flex gap-10 items-start transition-all duration-300">
        
        {/* Left Column: Questions List */}
        <div className={`flex-1 transition-all duration-300 ${learningMoreId ? 'w-1/2 max-w-3xl' : 'w-full max-w-4xl'}`}>
          <h2 className="text-xl font-semibold mb-6">Interview Q & A</h2>
          
          <div className="flex flex-col gap-3 pb-20">
            {qaData.map((item) => {
              const isExpanded = expandedId === item.id;
              
              return (
                <div 
                  key={item.id} 
                  className={`border border-gray-100 rounded-xl overflow-hidden transition-all duration-200 ${isExpanded ? 'shadow-sm bg-white' : 'bg-white hover:bg-gray-50'}`}
                >
                  {/* Accordion Header */}
                  <div 
                    onClick={() => toggleAccordion(item.id)}
                    className="flex items-center justify-between p-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-gray-400 font-medium w-4 text-center">Q</span>
                      <span className="font-medium text-[15px]">{item.question}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      {/* Action buttons (only show if expanded) */}
                      {isExpanded && (
                        <div className="flex items-center gap-2 mr-2">
                          <button 
                            className="p-1.5 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
                            onClick={(e) => { e.stopPropagation(); /* Add pin logic here */ }}
                          >
                            <Icons.Pin />
                          </button>
                          <button 
                            className="flex items-center gap-1.5 px-3 py-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md text-xs font-medium transition-colors"
                            onClick={(e) => handleLearnMore(e, item.id)}
                          >
                            <Icons.Sparkles />
                            Learn More
                          </button>
                        </div>
                      )}
                      
                      <span className="text-gray-400">
                        {isExpanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                      </span>
                    </div>
                  </div>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="p-5 px-6 bg-gray-50/80 border-t border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap rounded-b-xl">
                      {item.shortAnswer}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="flex justify-center pb-20">
            <button 
              className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center gap-2.5 font-medium hover:bg-gray-800 transition-colors shadow-sm"
              onClick={() => console.log('Load More clicked')}
            >
              <Icons.LoadMore />
              Load More
            </button>
          </div>
          </div>
        </div>

        {/* Right Column: Learn More Drawer/Panel */}
        {learningMoreId && (
          <div className="flex-1 w-1/2 max-w-2xl bg-white border border-gray-100 rounded-2xl shadow-[0_4px_24px_-10px_rgba(0,0,0,0.08)] p-8 sticky top-6 h-[calc(100vh-100px)] overflow-y-auto animate-in slide-in-from-right-4 duration-300">
            
            <button 
              onClick={closeDrawer}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icons.Close />
            </button>

            {isDrawerLoading ? (
              // Skeleton Loader State
              <div className="animate-pulse flex flex-col gap-6 mt-4">
                <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-[90%]"></div>
                  <div className="h-4 bg-gray-100 rounded w-[95%]"></div>
                </div>
                <div className="space-y-3 pt-4">
                  <div className="h-4 bg-gray-100 rounded w-[80%]"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-[85%]"></div>
                  <div className="h-4 bg-gray-100 rounded w-[92%]"></div>
                </div>
                <div className="space-y-3 pt-4">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-[90%]"></div>
                  <div className="h-4 bg-gray-100 rounded w-[75%]"></div>
                </div>
              </div>
            ) : (
              // Loaded Content State
              <div className="mt-2">
                <h2 className="text-xl font-semibold mb-6 pr-8 text-gray-900">
                  {activeDetailData?.title}
                </h2>
                <div className="text-sm text-gray-700 leading-relaxed space-y-4 whitespace-pre-wrap">
                  {activeDetailData?.content}
                </div>
              </div>
            )}
            
          </div>
        )}
        
      </div>
    </div>
    </>
  );
};

export default InterviewQAPage;