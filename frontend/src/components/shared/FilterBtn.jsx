import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function FilterBtn() {
  const items = ["Salary", "Vacancy", "Full-Time", "Part-Time", "Internship", "Role"];
  
  // State: Array of booleans, one per item
  const [activeFlags, setActiveFlags] = useState(Array(items.length).fill(false));

  const toggleItem = (index) => {
    const newFlags = [...activeFlags];
    newFlags[index] = !newFlags[index]; // Toggle true/false
    setActiveFlags(newFlags);
  };

  return (
    <div
      className="z-2 px-4 py-1 absolute hover:underline hover:scale-105 active:scale-90 transition-transform duration-100 bg-gray-50 border rounded-2xl cursor-pointer text-black-100 italic"
    >
      <Popover>
        <PopoverTrigger>
          <div className="cursor-pointer">Filter</div>
        </PopoverTrigger>
        <PopoverContent className="bg-white rounded-lg shadow-lg w-80">
          <div className="grid grid-cols-3 gap-4 text-center">
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => toggleItem(index)}
                className={`p-1 rounded border cursor-pointer text-gray-800 ${
                  activeFlags[index] ? "bg-gray-400" : "bg-gray-100"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
