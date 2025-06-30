"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./components/shared/Sidebar";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
// import Image from "next/image";
import { cn } from "./lib/utils";
import { logout } from "./services/api";
import Loading from './components/Loading';
import { getNavigationByRole } from './config/navigation';
// import AdminDashboard from "./components/admin/AdminDashboard";
import MainDashboard from "./components/main-dashboard/MainDashboard";
// import Header from "./components/shared/Header";
import { CiLogout } from "react-icons/ci";

export function SidebarDemo() {

  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current URL

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/', { replace: true });
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      // console.log(userData);
      setUser(userData);
      setLinks(getNavigationByRole(userData.role));
      // console.log(getNavigationByRole(userData.role));
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Sync activeLink with current URL path
  useEffect(() => {
    if(!user || !links) {
      <Loading />
    } else {
      const currentPath = location.pathname; // eg/ /dashboard/home
      
      // const links = getNavigationByRole(user?.role || 'USER'); // Default role if user is not yet loaded
      // console.log(links);
      
      // If the path is exactly "/dashboard", redirect to "/dashboard/home"
      if (currentPath === '/dashboard' || currentPath === '/dashboard/') {
        navigate(`${links[0].href}`, { replace: true }); // Replace to avoid adding to history
        return;
      }
      
      const matchingLink = links.find(link => currentPath.startsWith(link.href));
      if (matchingLink) {
        setActiveLink(matchingLink.label); // Set the active link based on the current path
      } 
    }
  }, [location.pathname, user]); // Run when path or user changes

  if (!user) {
    return <Loading />;
  }

  const handleLogout = () => {
    logout();
  };
  
  return (
    (<div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        // for your use case, use `h-screen` instead of `h-[60vh]`
        "h-screen"
      )}>
      <Suspense fallback={<Loading />}>

        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} activeLink={activeLink} setActiveLink={setActiveLink} />
                ))}
              </div>
            </div>
            <div>
              <SidebarLink
                link={{
                  label: "Logout",
                  href: "#",
                  icon: <CiLogout className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />,
                }} 
                onClick={handleLogout}
                />
            </div>
          </SidebarBody>
        </Sidebar>
        
        <MainDashboard role={user.role} />
        
      </Suspense>
    </div>)
  );
}
export const Logo = () => {
  return (
    (<Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="flex space-x-2 items-center">
        <img src="/logo.png" alt="logo" className="h-14 w-14" />
        <motion.span
          initial={{ opacity: 0, x: -20, display: "none" }}
          animate={{ opacity: 1, x: 0, display: "block" }}
          transition={{ delay: 0.2 }}
          className="text-lg text-black dark:text-white">
          Walchand Institute of Technology
        </motion.span>
      </div>
    </Link>)
  );
};
export const LogoIcon = () => {
  return (
    (<Link
      to="#"
      className="font-normal flex justify-center items-center text-sm text-black py-1 relative z-20">
        <img src="/logo.png" alt="logo" className="h-12 w-12" />
    </Link>)
  );
};

