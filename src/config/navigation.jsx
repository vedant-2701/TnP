import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUsers,
    IconChartBar,
    IconFileText,
    IconCalendar,
    IconUserBolt,
  } from "@tabler/icons-react";

import { BriefcaseIcon, SquaresPlusIcon } from "@heroicons/react/24/outline";
import { HiOutlinePencilAlt } from "react-icons/hi";

export const studentNavigationLinks = [
  // {
  //   label: 'Home',
  //   href: '/dashboard/home',
  //   icon: (
  //     <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
  //   ),
  // },
  {
    label: 'Upcoming Drives',
    href: '/dashboard/drives', // Update with actual route when implemented
    icon: (
      <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
    ),
  },
  {
    label: 'View Applications',
    href: '/dashboard/applications', // Update with actual route when implemented
    icon: (
      <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
    ),
  },
  {
    label: 'Profile',
    href: '/dashboard/profile', // Update with actual route when implemented
    icon: (
      <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
    ),
  },
];

export const adminNavigationLinks = [
    {
      label: "Users",
      href: "/dashboard/users",
      icon: (
        <IconUsers className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />
      ),
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: (
        <IconChartBar className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />
      ),
    },
    {
      label: "Upload Students",
      href: "/dashboard/upload/upload-students",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />
      ),
    },
    {
      label: "Logs",
      href: "#",
      icon: (
        <IconFileText className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />
      ),
    },
];

export const tnpHeadNavigationLinks = [
    {
      label: "Job Postings",
      href: "/dashboard/job-postings",
      icon: (
        <BriefcaseIcon className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />
      ),
    },
    {
      label: "Add Job",
      href: "/dashboard/add-job",
      icon: (
        <SquaresPlusIcon className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />
      ),
    },
    {
      label: "Students",
      href: "/dashboard/students",
      icon: (
        <IconUsers className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />
      ),
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: (
        <IconChartBar className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />
      ),
    },
];


export function getNavigationByRole(role) {
    switch (role) {
        case 'ADMIN':            
            return adminNavigationLinks;
    
        case 'STUDENT':  
            return studentNavigationLinks;
    
        case 'HEAD':
            return tnpHeadNavigationLinks;
    
        case 'TNPDEPARTMENTHEAD': 
            return [];
    
        default:
            return [];
    }
};
