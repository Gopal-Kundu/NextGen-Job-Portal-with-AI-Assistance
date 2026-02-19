import { Linkedin } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="flex items-center bg-black text-white p-2 italic">
      <div className="max-w-screen-xl mx-auto px-4 text-end">
        <p className="text-sm">
          Thank you for visiting... Made by
          <span className="font-semibold">Gopal Kundu </span>
        </p>
      </div>
      <div>
        <Link
          className="inline:block"
          to="https://www.linkedin.com/in/gopalcodes/"
        >
          <Linkedin />
        </Link>
      </div>
    </footer>
  );
}
