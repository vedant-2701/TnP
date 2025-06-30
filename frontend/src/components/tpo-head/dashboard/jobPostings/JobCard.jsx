import { useImageColor } from "../../../../hooks/useImageColor";
import { motion } from "motion/react";
import { ClockIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { LiaIndustrySolid } from "react-icons/lia";
import { CiLocationOn } from "react-icons/ci";
import { formatDate } from "../../../../helper/formatDate";
import { useState, useEffect } from "react";

export default function JobCard({ job, onClick }) {
    // const [generalColor, setGeneralColor] = useState();
    const [active, setActive] = useState(true);
    const { color, imgRef } = useImageColor(job.src, 0.8, null);

    const activeStyle = `bg-radial-[at_25%_25%] from-white to-green-600 to-30%`;
    const inActiveStyle = `bg-radial-[at_25%_25%] from-white to-red-600 to-30%`;

    // Enhanced glassmorphism effect
    const backgroundStyle = {
        backgroundColor: `${color}05`, // Very subtle base color
        backdropFilter: "blur(36px) saturate(180%)",
        WebkitBackdropFilter: "blur(36px) saturate(180%)",
        backgroundImage: `
      linear-gradient(
        135deg,
        ${color}55 0%,
        ${color}40 25%,
        ${color}03 50%,
        ${color}48 75%,
        ${color}54 100%
      )
    `,
        boxShadow: `
      0 4px 30px rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1)
    `,
        borderTop: "1px solid rgba(255, 255, 255, 0.2)",
        borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
        borderRight: "1px solid rgba(255, 255, 255, 0.05)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    };

    useEffect(() => {
        if (job?.deadline) {
          const today = new Date();
          const deadlineDate = new Date(job.deadline);
          
          // Ensure deadline is valid
          if (!isNaN(deadlineDate.getTime())) {
            // Compare dates (ignoring time for simplicity)
            today.setHours(0, 0, 0, 0);
            deadlineDate.setHours(0, 0, 0, 0);
            
            // Set active to true if deadline is today or in the future
            setActive(today <= deadlineDate);
          } else {
            console.warn("Invalid deadline date:", job.deadline);
            setActive(false); // Default to inactive if deadline is invalid
          }
        } else {
          setActive(false); // Default to inactive if no deadline
        }
    }, [job]);

    return (
        <motion.div
            layoutId={`container-job-${job.companyId}`}
            key={job.companyId}
            onClick={() => onClick(job)}
            className="border border-neutral-300 cursor-pointer bg-transparent rounded-3xl p-2 flex flex-col justify-between"
        >
            <motion.div
                layoutId={`job-${job.companyId}`}
                whileHover={{ scale: 1.01 }}
                className="p-4 rounded-2xl hover:shadow-md hover:rounded-3xl transition-shadow h-full"
                style={backgroundStyle}
            >
                <motion.div className="flex gap-4 flex-col justify-between space-y-2 h-full">
                    <motion.div
                        layoutId={`deadline-&-active-${job.deadline}-${job.companyId}`}
                        className="w-full flex justify-between items-center"
                    >
                        <motion.div className="rounded-full bg-transparent border border-neutral-400 text-blue-500 px-4 py-2">
                            <span className="flex items-center gap-2 text-sm">
                                <ClockIcon className="w-5 h-5 text-blue-500" />{" "}
                                {formatDate(job.deadline)}
                            </span>
                        </motion.div>

                        <motion.div
                            className={`w-4 h-4 rounded-full ${
                                active ? activeStyle : inActiveStyle
                            }`}
                        ></motion.div>
                    </motion.div>

                    <motion.div
                        layoutId={`company-details-${job.companyName}-${job.companyId}`}
                        className="w-full flex justify-between items-center"
                    >
                        <motion.div className="flex flex-col space-y-2">
                            <motion.h4 className="text-lg">
                                {job.companyName}
                            </motion.h4>
                            <motion.h3 className="text-3xl font-semibold line-clamp-2">
                                {job.jobRole}
                            </motion.h3>
                        </motion.div>
                        <motion.div
                            layoutId={`company-img-${job.src}-${job.companyId}`}
                        >
                            <img
                                ref={imgRef}
                                src={job.src}
                                alt={job.companyName}
                                className="h-30 w-30 md:h-14 md:w-14 rounded-full object-cover"
                            />
                        </motion.div>
                    </motion.div>

                    <motion.div>
                        <motion.div layoutId={`company-type-${job.industryType}-${job.companyId}`}>
                            <span className="flex items-center gap-2 px-4 py-2 rounded-full w-fit text-sm text-neutral-800 border border-neutral-500">
                                <LiaIndustrySolid className="w-6 h-6 text-neutral-800" />{" "}
                                {job.industryType}
                            </span> 
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>

            <motion.div className="flex justify-between items-center py-4 px-2">
                <div className="flex flex-col space-y-3">
                    <motion.div>
                        <span className="flex items-center gap-2">
                            <CiLocationOn className="w-6 h-6 text-blue-500" />{" "}
                            {job.location}
                        </span>
                    </motion.div>
                    <motion.div>
                        <span className="flex items-center gap-2">
                            <CalendarDaysIcon className="w-6 h-6 text-blue-500" />{" "}
                            {formatDate(job.createdAt)}
                        </span>
                    </motion.div>
                </div>
                <motion.button
                    layoutId={`button-${job.username}-${job.companyId}`}
                    className="px-4 py-2 rounded-full bg-gray-100 hover:bg-blue-500 hover:text-white hover:cursor-pointer text-black"
                >
                    {job.ctaText}
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
