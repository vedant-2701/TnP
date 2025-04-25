"use client";
import { PlaceholdersAndVanishInput } from "../ui/PlaceholderAndVanishInput";
// import { Bell } from "lucide-react";
import NotificationIcon from "../ui/NotificationIcon";



export default function Header() {

  const placeholders = [
      "Search Jobs",
      "Find alerts",
  ];

  const handleChange = (e) => {
    console.log(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="flex justify-evenly items-center px-4">
      <div className="w-1/2">
        <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />
      </div>
      <div className="w-1/2 flex  justify-end items-center gap-20 px-4">
        {/* <Bell className="w-7 h-7"/> */}
        <NotificationIcon />

        {/* <span className="text-gray-500">Hi, Atharva Gaikwad</span> */}
      </div>
    </div>
  );
};
