import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setPersonalDetails,
  setEducation,
  setExperience,
  setProjects,
  setSkills,
  setAchievements,
  setAddExtra,
} from "../../../../redux/resumeSlice.js";

const emptyPersonal = { name: "", phone: "", github: "", linkedin: "", email: "" };
const emptyEdu = { institute: "", course: "", grade: "", timeline: "" };
const emptyExp = { company: "", position: "", work: "", timeline: "" };
const emptyProject = { name: "", about: "", tech: "" };
const emptySkill = "";
const emptyAchievement = { title: "", about: "" };
const emptyExtra = { header: "", details: "", timeline: "" };

export default function ResumeDetails() {
  const dispatch = useDispatch();

  const [personal, setPersonal] = useState(emptyPersonal);
  const [education, setEdu] = useState(emptyEdu);
  const [experience, setExp] = useState(emptyExp);
  const [project, setProject] = useState(emptyProject);
  const [skills, setSkill] = useState(emptySkill);
  const [achievement, setAch] = useState(emptyAchievement);
  const [extra, setExtra] = useState(emptyExtra);

  const handlePersonalSave = () => {
    dispatch(setPersonalDetails(personal));
    setPersonal(emptyPersonal);
  };

  const handleEduAdd = () => {
    dispatch(setEducation(education));
    setEdu(emptyEdu);
  };

  const handleExpAdd = () => {
    dispatch(setExperience(experience));
    setExp(emptyExp);
  };

  const handleProjectAdd = () => {
    dispatch(setProjects(project));
    setProject(emptyProject);
  };

  const handleSkillAdd = () => {
    if (!skills) return;
    dispatch(setSkills(skills));
    setSkill("");
  };

  const handleAchAdd = () => {
    dispatch(setAchievements(achievement));
    setAch(emptyAchievement);
  };

  const handleExtraAdd = () => {
    dispatch(setAddExtra(extra));
    setExtra(emptyExtra);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Resume Builder</h1>

      {/* PERSONAL DETAILS */}
      <section className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">Personal Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={personal.name} onChange={e => setPersonal({ ...personal, name: e.target.value })} placeholder="Full Name" className="border p-2 rounded" />
          <input value={personal.phone} onChange={e => setPersonal({ ...personal, phone: e.target.value })} placeholder="Phone" className="border p-2 rounded" />
          <input value={personal.github} onChange={e => setPersonal({ ...personal, github: e.target.value })} placeholder="GitHub URL" className="border p-2 rounded" />
          <input value={personal.linkedin} onChange={e => setPersonal({ ...personal, linkedin: e.target.value })} placeholder="LinkedIn URL" className="border p-2 rounded" />
          <input value={personal.email} onChange={e => setPersonal({ ...personal, email: e.target.value })} placeholder="Email" className="border p-2 rounded md:col-span-2" />
        </div>
        <button onClick={handlePersonalSave} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Save Personal Details</button>
      </section>

      {/* EDUCATION */}
      <section className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={education.institute} onChange={e => setEdu({ ...education, institute: e.target.value })} placeholder="Institute Name" className="border p-2 rounded" />
          <input value={education.course} onChange={e => setEdu({ ...education, course: e.target.value })} placeholder="Course / Degree" className="border p-2 rounded" />
          <input value={education.grade} onChange={e => setEdu({ ...education, grade: e.target.value })} placeholder="Current Grade / CGPA" className="border p-2 rounded" />
          <input value={education.timeline} onChange={e => setEdu({ ...education, timeline: e.target.value })} placeholder="Timeline (e.g., 2022 - Present)" className="border p-2 rounded" />
        </div>
        <button onClick={handleEduAdd} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Add Education</button>
      </section>

      {/* EXPERIENCE */}
      <section className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">Experience</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={experience.company} onChange={e => setExp({ ...experience, company: e.target.value })} placeholder="Company Name" className="border p-2 rounded" />
          <input value={experience.position} onChange={e => setExp({ ...experience, position: e.target.value })} placeholder="Position" className="border p-2 rounded" />
          <textarea value={experience.work} onChange={e => setExp({ ...experience, work: e.target.value })} placeholder="Work Done / Responsibilities" className="border p-2 rounded md:col-span-2" />
          <input value={experience.timeline} onChange={e => setExp({ ...experience, timeline: e.target.value })} placeholder="Timeline" className="border p-2 rounded md:col-span-2" />
        </div>
        <button onClick={handleExpAdd} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Add Experience</button>
      </section>

      {/* PROJECTS */}
      <section className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={project.name} onChange={e => setProject({ ...project, name: e.target.value })} placeholder="Project Name" className="border p-2 rounded" />
          <input value={project.tech} onChange={e => setProject({ ...project, tech: e.target.value })} placeholder="Technical Stack" className="border p-2 rounded" />
          <textarea value={project.about} onChange={e => setProject({ ...project, about: e.target.value })} placeholder="About the Project" className="border p-2 rounded md:col-span-2" />
        </div>
        <button onClick={handleProjectAdd} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Add Project</button>
      </section>

      {/* TECHNICAL SKILLS */}
      <section className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">Technical Skills</h2>
        <div className="flex gap-3">
          <input value={skills} onChange={e => setSkill(e.target.value)} placeholder="Add Skill (e.g., React)" className="border p-2 rounded flex-1" />
          <button onClick={handleSkillAdd} className="px-4 py-2 bg-green-600 text-white rounded">Add</button>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={achievement.title} onChange={e => setAch({ ...achievement, title: e.target.value })} placeholder="Achievement Title" className="border p-2 rounded" />
          <textarea value={achievement.about} onChange={e => setAch({ ...achievement, about: e.target.value })} placeholder="About Achievement" className="border p-2 rounded md:col-span-2" />
        </div>
        <button onClick={handleAchAdd} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Add Achievement</button>
      </section>

      {/* EXTRA SECTION */}
      <section className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">Extra Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={extra.header} onChange={e => setExtra({ ...extra, header: e.target.value })} placeholder="Header" className="border p-2 rounded" />
          <input value={extra.timeline} onChange={e => setExtra({ ...extra, timeline: e.target.value })} placeholder="Timeline" className="border p-2 rounded" />
          <textarea value={extra.details} onChange={e => setExtra({ ...extra, details: e.target.value })} placeholder="Details" className="border p-2 rounded md:col-span-2" />
        </div>
        <button onClick={handleExtraAdd} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Add Extra</button>
      </section>
    </div>
  );
}
