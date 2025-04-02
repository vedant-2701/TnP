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

export function SidebarDemo() {

  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  
  const [user, setUser] = useState(null);
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
      setUser(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Sync activeLink with current URL path
  useEffect(() => {
    const currentPath = location.pathname; // eg/ /dashboard/home

    // If the path is exactly "/dashboard", redirect to "/dashboard/home"
    if (currentPath === '/dashboard' || currentPath === '/dashboard/') {
      navigate('/dashboard/home', { replace: true }); // Replace to avoid adding to history
      return;
    }

    const links = getNavigationByRole(user?.role || 'USER'); // Default role if user is not yet loaded
    const matchingLink = links.find(link => link.href === currentPath);
    if (matchingLink) {
      setActiveLink(matchingLink.label); // Set the active link based on the current path
    } 
  }, [location.pathname, user]); // Run when path or user changes

  if (!user) {
    return <Loading />;
  }

  const links = getNavigationByRole(user.role);
  // const links = getNavigationByRole('ADMIN');

  const handleLogout = () => {
    logout();
  };
  
  // const links = [
  //   {
  //     label: "Home",
  //     href: "#",
  //     icon: (
  //       <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />
  //     ),
  //   },
  //   {
  //     label: "Upcoming Drives",
  //     href: "#",
  //     icon: (
  //       <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />
  //     ),
  //   },
  //   {
  //     label: "View Applications",
  //     href: "#",
  //     icon: (
  //       <IconSettings className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />
  //     ),
  //   },
  //   {
  //     label: "Profile",
  //     href: "#",
  //     icon: (
  //       <IconSettings className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />
  //     ),
  //   },
  //   {
  //     label: "Logout(other)",
  //     href: "#",
  //     icon: (
  //       <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />
  //     ),
  //   },
  // ];
  
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
                  icon: <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />,
                }} 
                onClick={handleLogout}
                />
            </div>
          </SidebarBody>
        </Sidebar>
        {/* <Header /> */}
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
      <div
        className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre">
        Acet Labs
      </motion.span>
    </Link>)
  );
};
export const LogoIcon = () => {
  return (
    (<Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div
        className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm shrink-0" />
    </Link>)
  );
};

