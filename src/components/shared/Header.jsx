"use client";
import { PlaceholdersAndVanishInput } from "../ui/PlaceholderAndVanishInput";
import NotificationIcon from "../ui/NotificationIcon";
import { getUser } from "../../utils/userStorage";
import { logout } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const [username, setUsername] = useState("Guest"); // Fallback if no user data
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from localStorage
    const user = getUser();
    if (user && user.username) {
      setUsername(user.username); // Set dynamic username
    }
  }, []);

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

  const handleLogout = () => {
    logout(); // Clear token and user data
    navigate("/", { replace: true }); // Redirect to login page
  };

  return (
    <div className="flex justify-evenly items-center px-4">
      <div className="w-1/2"
       
        />
      <div className="w-1/2 flex justify-end items-center gap-20 px-4">
        <span className="text-gray-500">Hi, {username}</span>
      </div>
    </div>
  );
}