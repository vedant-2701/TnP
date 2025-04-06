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

export const studentNavigationLinks = [
    {
        label: "Home",
        href: "#",
        icon: (
            <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
        ),
    },
    {
        label: "Upcoming Drives",
        href: "#",
        icon: (
            <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
        ),
    },
    {
        label: "View Applications",
        href: "#",
        icon: (
            <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
        ),
    },
    {
        label: "Profile",
        href: "#",
        icon: (
            <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
        ),
    },
    // {
    //     label: "Logout",
    //     href: "#",
    //     icon: (
    //         <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
    //     ),
    // },
];

export const adminNavigationLinks = [
    {
      label: "Users",
      href: "/dashboard/users",
      icon: (
        <IconUsers className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />
      ),
    },
    // {
    //   label: "Home",
    //   href: "/dashboard/home",
    //   icon: (
    //     <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-6 w-6 shrink-0" />
    //   ),
    // },
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


export function getNavigationByRole(role) {
    switch (role) {
        case 'ADMIN':            
            return adminNavigationLinks;
    
        case 'STUDENT':  
            return studentNavigationLinks;
    
        case 'TNPHEAD':
            return [];
    
        case 'TNPDEPARTMENTHEAD': 
            return [];
    
        default:
            return [];
    }
};
