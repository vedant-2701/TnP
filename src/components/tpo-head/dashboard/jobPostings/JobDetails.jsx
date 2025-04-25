import { IconArrowLeft } from "@tabler/icons-react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, Link, useLocation, Routes, Route, useParams, Outlet } from "react-router-dom";
import { ClockIcon, CalendarDaysIcon, GlobeAltIcon, TagIcon, ArrowTopRightOnSquareIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import { LiaIndustrySolid } from "react-icons/lia";
import { CiLocationOn } from "react-icons/ci";
import { LinkPreview } from "../../../ui/LinkPreview";
import { formatDate } from "../../../../helper/formatDate";
import { useImageColor } from "../../../../hooks/useImageColor";
import { useState, useEffect } from "react";
import Overview from "./details/Overview";
import JobDescription from "./details/JobDescription";
import Skills from "./details/Skills";
import Criteria from "./details/Criteria";
import { getCompanyById } from "../../../../services/getCompanies";
import Loading from "../../../Loading";

export default function JobDetails() {
    
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeLink, setActiveLink] = useState();
    const [generalColor, setGeneralColor] = useState("#fff");
    const [job, setJob] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { color, imgRef } = useImageColor(job.src, 0.8, setGeneralColor);
    const basePath = `/dashboard/job-postings/${id}`;
    const links = [
        { label: "Overview", href: `${basePath}/overview` },
        { label: "Job Description", href: `${basePath}/jobDescription` },
        { label: "Criteria", href: `${basePath}/criteria` },
        { label: "Eligible Students", href: `${basePath}/eligibleStudents` },
    ];

    console.log(color);
    console.log(activeLink);
    console.log(id);
    console.log(links);

    const mapJobData = (company) => {
        return {
            companyId: company.recruiterId,
            companyName: company.companyName,
            src: company.companyLogoUrl,
            jobRole: company.jobRole,
            location: company.companyLocation,
            industryType: company.industryType,
            jobDescription: company.jobDescription,
            deadline: company.deadline,
            ctaText: "Details",
            createdAt: company.createdAt,
            criteria: company.criteria,
            webiste: company.companyWebsite,
        }
    }

    const fetchCompanyById = async (id) => {
        const response = await getCompanyById(id);

        if(response.success) {
            console.log(response.data);
            console.log(mapJobData(response.data));
            console.log(mapJobData(response.data).webiste);
            setJob(mapJobData(response.data));
            console.log(job);
        } else {
            console.log(response.error);
        }
    }

    useEffect(() => {
        const normalizedPath = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
        if (id && normalizedPath === basePath) {
            console.log("Redirecting to overview...");
            // navigate(`/dashboard/job-postings/${id}/overview`, { replace: true });
            navigate(`overview`);
            setActiveLink("Overview");
        }
        setIsLoading(true);
        fetchCompanyById(id);
        setIsLoading(false);
        
    }, [id, location.pathname, navigate]);
    console.log(job);

    // Sync activeLink with current route
    useEffect(() => {
        const currentLink = links.find(link => link.href === location.pathname);
        if (currentLink) setActiveLink(currentLink.label);
    }, [location.pathname, links]);


    // Enhanced glassmorphism effect
    const backgroundStyle = {
        backgroundColor: `${color}05`, // Very subtle base color
        backdropFilter: "blur(36px) saturate(180%)",
        WebkitBackdropFilter: "blur(36px) saturate(180%)",
        backgroundImage: `
      linear-gradient(
        135deg,
        ${color}55 0%,
        ${color}20 25%,
        ${color}15 50%,
        ${color}28 75%,
        ${color}44 100%
      )
    `,
    };

    const handleBack = () => {
        // setActiveJob(null);
        navigate("/dashboard/job-postings");
    };

    const handleLinkClick = (label) => {
        setActiveLink(label);
    }

    return (
        <>
            <AnimatePresence>
                {/* Main container */}
                <motion.div
                    className="w-full"
                    layoutId={`container-job-${job.companyId}`}
                >
                    {/* Navigation */}
                    <div className="w-full flex justify-between items-center px-6 py-4">
                        {/* Back */}
                        <motion.div>
                            <button
                                className="cursor-pointer"
                                onClick={handleBack}
                            >
                                <span
                                    className="flex items-center gap-2"
                                    style={{ color: generalColor }}
                                >
                                    <IconArrowLeft className="w-4 h-4" /> Back
                                    {/* <ArrowLongLeftIcon className="w-4 h-4"/> Back */}
                                </span>
                            </button>
                        </motion.div>

                        <motion.div className="cursor-pointer" role="button">
                            <motion.span
                                className="flex items-center gap-2 border px-4 py-2 rounded-lg"
                                whileHover={"hover"}
                                style={{
                                    borderColor: generalColor,
                                    color: generalColor,
                                }}
                                variants={{
                                    hover: { backgroundColor: generalColor, color: "#fff" },
                                }}
                            >
                                <HiOutlinePencilAlt className="w-4 h-4" /> Edit
                            </motion.span>
                        </motion.div>
                    </div>

                    <motion.div>
                        <motion.div
                            layoutId={`job-${job.companyId}`}
                            className="w-full flex flex-col md:flex-row justify-evenly items-center px-8 py-4 gap-8 rounded-tl-lg rounded-tr-lg h-[40%] shadow-md"
                            style={backgroundStyle}
                        >
                            {/* Logo container */}
                            <div className="flex flex-col md:flex-row justify-center items-center gap-8 p-4 w-[50%]">
                                {/* Logo and Location */}
                                <div className="flex flex-col items-center space-y-4">
                                    <motion.div
                                        layoutId={`company-img-${job.src}-${job.companyId}`}
                                    >
                                        <img
                                            ref={imgRef}
                                            src={job.src}
                                            alt="Company Logo"
                                            // className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                                            className="w-30 h-30 md:w-16 md:h-16 lg:w-30 lg:h-30 rounded-full shadow-md object-cover object-top"
                                        />
                                    </motion.div>

                                    {/* <div>
                                        <span className="flex items-center gap-2">
                                            <CiLocationOn className="w-6 h-6 text-blue-500"/> {job.location}
                                        </span>
                                    </div> */}
                                </div>

                                {/* Name, Role, Website */}
                                <motion.div
                                    className="flex flex-col space-y-4"
                                    layoutId={`company-details-${job.companyName}-${job.companyId}`}
                                >
                                    {/* Name */}
                                    <motion.div>
                                        <span className="flex items-center gap-2 text-4xl">
                                            {job.companyName}
                                            {/* <GlobeAltIcon className="w-8 h-8 text-blue-500"/> {job.companyName} */}
                                        </span>
                                    </motion.div>
                                    {/* Role */}
                                    <div className="flex gap-4">
                                        <span className="flex items-center gap-2 text-lg">
                                            {/* <TagIcon className="w-6 h-6 text-blue-500"/> {job.jobRole} */}
                                            <BriefcaseIcon
                                                className="w-6 h-6"
                                                style={{ color: generalColor }}
                                            />{" "}
                                            {job.jobRole}
                                            {/* Role: {job.jobRole} */}
                                        </span>
                                        <span className="flex items-center gap-2 text-lg">
                                            <CiLocationOn
                                                className="w-6 h-6"
                                                style={{ color: generalColor }}
                                            />{" "}
                                            {job.location}
                                        </span>
                                    </div>
                                    <div className="w-fit">
                                        <div className="w-fit">
                                            <LinkPreview
                                                url={job.website}
                                                className="font-bold cursor-pointer"
                                            >
                                                <span
                                                    className={`flex items-center gap-2 text-md border px-3 py-2 rounded-xl`}
                                                    style={{
                                                        color: generalColor,
                                                        borderColor:
                                                            generalColor,
                                                    }}
                                                >
                                                    Visit Website{" "}
                                                    <ArrowTopRightOnSquareIcon
                                                        className="w-4 h-4"
                                                        style={{
                                                            color: generalColor,
                                                        }}
                                                    />
                                                </span>
                                            </LinkPreview>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Industy type & deadline */}
                            <div className="flex space-x-8 w-[50%] justify-center items-center">
                                <motion.div
                                    className="border p-4 rounded-xl"
                                    style={{ borderColor: generalColor }}
                                    layoutId={`company-type-${job.industryType}-${job.companyId}`}
                                >
                                    <div>
                                        <span
                                            className=""
                                            style={{
                                                color: generalColor,
                                                opacity: 0.7,
                                            }}
                                        >
                                            Industry Type
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-lg">
                                            {job.industryType}
                                        </span>
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="border p-4 rounded-xl"
                                    style={{ borderColor: generalColor }}
                                    layoutId={`deadline-&-active-${job.deadline}-${job.companyId}`}
                                >
                                    <div>
                                        <span
                                            className="flex items-center gap-2"
                                            style={{
                                                color: generalColor,
                                                opacity: 0.7,
                                            }}
                                        >
                                            <CalendarDaysIcon className="h-5 w-5" />{" "}
                                            Application Deadline
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-lg">
                                            {formatDate(job.deadline)}
                                        </span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* at b-1 */}
                        </motion.div>

                        <motion.div className="w-full">
                            <div>
                                <ul className="w-full flex justify-center items-center gap-24 px-4 py-6 text-lg">
                                    {links.map((link, index) => (
                                        <li key={`job-${link.label}-${index}`} className="cursor-pointer">
                                            <Link to={link.href} >
                                                <motion.div
                                                    onClick={() => {
                                                        handleLinkClick(link.label);
                                                    }}
                                                    whileHover="hover"
                                                    className={`relative ${
                                                        activeLink === link.label ? '' : 'text-black'
                                                    }`}
                                                    style={{
                                                        color: activeLink === link.label ? generalColor : "#000",
                                                    }}
                                                    variants={{
                                                        hover: {
                                                            color: generalColor,
                                                        },
                                                    }}
                                                    initial="initial"
                                                >
                                                    {link.label}

                                                    {/* Animated underline */}
                                                    <motion.span
                                                        className="absolute bottom-0 left-0 w-full h-0.5"
                                                        style={{ backgroundColor: generalColor }}
                                                        initial={{ scaleX: activeLink === link.label ? 1 : 0 }}
                                                        animate={{ scaleX: activeLink === link.label ? 1 : 0 }}
                                                        variants={{
                                                            hover: { scaleX: activeLink === link.label ? 1 : 1 },
                                                        }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                    
                                                </motion.div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                {/* <Outlet /> */}
                                <Routes>
                                    <Route path="/overview" element={<Overview />} />
                                    <Route path="/jobDescription" element={<JobDescription />} />
                                    <Route path="/skills" element={<Skills skills={job.skills} />} />
                                    <Route path="/criteria" element={<Criteria />} />
                                </Routes>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </>
    );
}

// const job = {
//     companyId: company.recruiterId || "67ee248889969c512f092cd9",
//     companyName: company.companyName || "Google",
//     src: company.companyLogoUrl || "https://cdn.brandfetch.io/google.com/w/400/h/400?c=1idtU2qD3KfPBuO5uVJ",
//     jobRole: company.jobRole || "Data Scientist",
//     location: company.companyLocation || "Bangalore",
//     industryType: company.industryType || "Data Analytics",
//     jobDescription: company.jobDescription || "We are looking for a Data Scientist to join our team.",
//     deadline: company.deadline || "2025-08-11",
//     ctaText: "Details",
//     createdAt: company.createdAt || "2025-04-01",
//     criteria: company.criteria || ["Python", "TensorFlow", "SQL"]
// }