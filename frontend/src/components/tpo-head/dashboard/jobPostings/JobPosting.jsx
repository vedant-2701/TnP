import { useEffect, useState, useRef } from "react";
import { useOutsideClick } from "../../../../hooks/useOutsideClick";
import { AnimatePresence, motion } from "motion/react";
import { getAllCompanies } from "../../../../services/getCompanies";
import { ClockIcon, CalendarDaysIcon, GlobeAltIcon, TagIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { LiaIndustrySolid } from "react-icons/lia";
import { CiLocationOn } from "react-icons/ci";
import { LinkPreview } from "../../../ui/LinkPreview";
import { FaMapPin } from "react-icons/fa";
import JobDetails from "./JobDetails";
import JobPostingRoutes from "../../../../routes/tnp-head/dashboard/jobPostings/JobPostingRoutes";
import { useNavigate } from "react-router-dom";
import JobCard from "./JobCard";
import Loading from "../../../Loading";

export default function JobPosting() {

    const [jobs, setJobs] = useState([]);
    const [active, setActive] = useState(null);
    const navigate = useNavigate();
    const ref = useRef(null);

    const activeStyle = `bg-radial-[at_25%_25%] from-white to-green-600 to-30%`;
    const inActiveStyle = `bg-radial-[at_25%_25%] from-white to-red-600 to-30%`;

    const mapCompanyData = (companies) => {
      console.log(companies);
        return companies.map(company => ({
            companyId: company.recruiterId, // Using recruiterId as a unique identifier
            companyName: company.companyName || "Unknown Company",
            webiste: company.companyWebsite,
            src: company.companyLogoUrl || "https://cdn.brandfetch.io/google.com/w/400/h/400?c=1idtU2qD3KfPBuO5uVJ", // Sample company-related image
            jobRole: company.jobRole || "N/A",
            jobDescription: company.jobDescription || "No description available",
            deadline: company.deadline || Date.now(),
            location: company.companyLocation || "Unknown Location",
            criteria: company.criteria || "N/A",
            industryType: company.industryType || "General",
            ctaText: "Details",
            createdAt: company.createdAt || Date.now(),
            updatedAt: company.updatedAt,
        }));
    };

    const fetchCompanies = async () => {
        const response = await getAllCompanies();
        if (response.success) {
          console.log(response);
            setJobs(mapCompanyData(response.data));
        } else {
            setJobs([]);
            throw new Error(response.message);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        if (active && typeof active === "object") {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "auto";
        }
    
        const onKeyDown = (event) => {
          if (event.key === "Escape") setActive(null);
        };
    
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => setActive(null));

    const handleClick = (job) => {
        setActive(job);
        navigate(`${job.companyId}`);
        console.log(job);
    }

    return (
        <>
        {/* <AnimatePresence>
          {active && typeof active === "object" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 h-full w-full z-10"
            />
          )}
        </AnimatePresence> */}
        
        {/* <ExpandedJobCard active={active} setActive={setActive} ref={ref} /> */}
        
        <div className="w-full">        
          <ul className="mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4 lg:p-8 items-stretch">
            {jobs.length > 0 ? jobs.map((job, index) => (
              <JobCard  
                key={job.companyId || `job-${index}`} 
                job={job} 
                onClick={handleClick} 
              />
            )) : (
              <Loading />
            )
          }
          </ul>
        </div>

        {/* <JobPostingRoutes /> */}
      </>
    );
}

function ExpandedJobCard ({ active, setActive, ref }) {
  return (
    <AnimatePresence>
      {active && typeof active === "object" ? (
        <div className="fixed inset-0 grid place-items-center z-[100] py-4">
          <motion.button
            key={`button-${active.companyId}-${active.companyId}`}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
            onClick={() => setActive(null)}
          >
            <CloseIcon />
          </motion.button>
    
            <motion.div
              layoutId={`job-${active.companyId}-${active.companyId}`}
              ref={ref}
              className="w-[70%] max-w-[1000px] h-full bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden">
              <motion.div 
                layoutId={`image-${active.companyName}-${active.companyId}`}
                className="w-full flex flex-col md:flex-row justify-center items-center p-4 gap-8 bg-blue-100 shadow-lg h-[40%]"
              >
                {/* Logo and Location */}
                <div className="flex flex-col items-center space-y-4">
                  <div>
                    <img
                      src={active.src}
                      alt="Company Logo"
                      // className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                      className="w-30 h-30 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full object-cover object-top" 
                    />
                  </div>

                  <div>
                    <span className="flex items-center gap-2">
                      <CiLocationOn className="w-6 h-6 text-blue-500"/> {active.location}
                    </span>
                  </div>
                </div>

                {/* Name, Role, Website */}
                <div className="flex flex-col space-y-4">
                  {/* Name */}
                  <div>
                    <span className="flex items-center gap-2 text-4xl">
                      <GlobeAltIcon className="w-8 h-8 text-blue-500"/> {active.companyName}
                    </span>
                  </div>
                  {/* Role */}
                  <div>
                    <span className="flex items-center gap-2 text-2xl">
                      {/* <TagIcon className="w-6 h-6 text-blue-500"/> {active.jobRole} */}
                      {/* <FaMapPin className="w-6 h-6 text-blue-500"/> Role: {active.jobRole} */}
                      Role: {active.jobRole}
                    </span>
                  </div>
                  <div>
                    <LinkPreview url="https://www.google.co.in/" className="font-bold">
                      <span className="flex items-center gap-2 text-lg">
                        Google <ArrowTopRightOnSquareIcon className="w-4 h-4 text-blue-500"/>
                      </span>
                    </LinkPreview>
                    <span className="flex items-center gap-2">
                    </span>
                  </div>
                </div>

               {/* at b-1 */}
              </motion.div>

              
            </motion.div>
            
        </div>
      ) : null}
    </AnimatePresence>
  );
} 

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};




{/* <div className="space-y-2">
<motion.h3
  layoutId={`name-${active.companyName}-${active.companyId}`}
  className="font-bold text-xl text-neutral-700 dark:text-neutral-200">
    <span className="flex items-center gap-2">
      <icons.UserCircleIcon className="w-6 h-6 text-blue-500"/> {active.companyName}
    </span>
</motion.h3>
<motion.p
  layoutId={`username-${active.username}-${active.companyId}`}
  className="text-neutral-600 dark:text-neutral-400">
    <span className="flex items-center gap-2">
      <icons.IdentificationIcon className="w-6 h-6 text-blue-500"/> {active.username}
    </span>
</motion.p>
<motion.p
  layoutId={`username-${active.department}-${active.companyId}`}
  className="text-neutral-600 dark:text-neutral-400">
    <span className="flex items-center gap-2">
      <icons.BuildingOffice2Icon className="w-6 h-6 text-blue-500" /> {active.department} - {active.academicYear}
    </span>
</motion.p>
<motion.p
  layoutId={`graduationYear-${active.graduationYear}-${active.companyId}`}
  initial={{ opacity: 0, x: -40 }}
  animate={{ opacity: 1, x: 0, animationDelay: 1 }}
  exit={{ opacity: 0 }}
  className="text-neutral-600 dark:text-neutral-400">
    <span className="flex items-center gap-2">
      <icons.AcademicCapIcon className="w-6 h-6 text-blue-500"/> 
      {
        active.studentType === 'DIPLOMA' ? `${parseInt(active.graduationYear) - 3}` : `${parseInt(active.graduationYear) - 4}`
      }
      {` - ${active.graduationYear}`}
    </span>
</motion.p>
</div> 

<div>
                <div className="flex justify-between items-center px-6 py-4">
                  <div className="space-y-2">
                    <motion.h3
                      layoutId={`email-${active.email}-${active.companyId}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200">
                      <span className="flex items-center gap-3">
                        <icons.EnvelopeIcon className="w-5 h-5 text-blue-500"/> {active.email}
                      </span>
                    </motion.h3>
                    <motion.h3
                      layoutId={`contactNumber-${active.contactNumber}-${active.companyId}`}
                      initial={{ opacity: 0, x: -40, y: 40 }}
                      animate={{ opacity: 1, x: 0, y: 0, animationDelay: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-bold text-neutral-700 dark:text-neutral-200">
                      <span className="flex items-center gap-2">
                        <icons.PhoneIcon className="w-5 h-5 text-blue-500"/> {active.contactNumber}
                      </span>
                    </motion.h3>
                  </div>

                  <motion.div
                    layoutId={`button-${active.username}-${active.companyId}`}
                    title="CGPA"
                    // href={active.ctaLink}
                    // href="#"
                    // target="_blank"
                    whileHover={{ scale: 1.15, transition: { duration: 0.6, type: "spring" } }}
                    className="px-4 py-3 text-sm rounded-full font-bold bg-gradient-to-b from-blue-300 to-blue-600 text-white shadow-md shadow-blue-500/50 inset-shadow-md inset-shadow-blue-500/50">
                      <motion.span
                        layoutId={`cgpa-${active.cgpa}-${active.companyId}`}
                        className="flex items-center gap-2"
                      >
                        <icons.FaAward className="w-6 h-6"/> {active.cgpa}
                    </motion.span>
                  </motion.div>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-60 pb-10 flex flex-col items-start gap-4 overflow-y-auto dark:text-neutral-400 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] scroll-smooth">

                      <div className="w-full flex flex-col px-4">
                        <h3 className="text-lg md:text-xl mb-4">Marks</h3>

                        <div className="space-y-3">
                          <motion.div
                            layoutId={`higherSecondaryMarks-${active.higherSecondaryMarks}-${active.companyId}`}
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0, animationDelay: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <span className="flex items-center gap-2">
                              <icons.FaRegIdBadge className="w-6 h-6 text-blue-500" /> 
                              {active.studentType?.charAt(0) + active.studentType?.slice(1).toLowerCase()} : {active.higherSecondaryMarks} &#37;
                            </span>
                          </motion.div>

                          <motion.div
                            layoutId={`tenMarks-${active.tenMarks}-${active.companyId}`}
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0, animationDelay: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <span className="flex items-center gap-2">
                              <icons.FaRegIdBadge className="w-6 h-6 text-blue-500" /> 
                              SSC : {active.tenMarks} &#37;
                            </span>
                          </motion.div>  
                        </div>                        
                      </div>

                    <div className="flex flex-col space-y-2 pt-4">
                      <h3 className="text-lg md:text-xl px-4">Skills</h3>
                      <div className="flex flex-wrap gap-4 p-4">
                        {active.skills && active.skills.length > 0 && active.skills.map((skill, index) => (
                          <motion.div
                            layoutId={`skills-${active.skills}-${index}-${active.companyId}`}
                            initial={{ opacity: 0, x: index * -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 400, damping: 5  }}
                            whileHover={{ scale: 1.15, transition: { duration: 0.6 } }}
                            key={index}
                            className="cursor-pointer text-center border border-blue-500 rounded-full px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 inset-shadow-sm inset-shadow-blue-500/50 shadow-sm shadow-blue-500/50">
                              <span>{skill}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="w-full flex justify-evenly items-center p-4">
                      <motion.div
                        whileHover={{ scale: 1.15, transition: { duration: 0.6, type: "spring" } }}
                        // className="px-4 py-3 border border-blue-500 rounded-full bg-gradient-to-br from-blue-200 via-blue-50 to-blue-200 shadow-md shadow-blue-300/50 inset-shadow-md inset-shadow-blue-300/50"
                        className="px-4 py-3 border border-blue-500 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 shadow-md shadow-blue-500/50 inset-shadow-md inset-shadow-blue-500/50"
                      >
                        <Link to="https://docs.spring.io/spring-framework/docs/6.0.0/reference/pdf/spring-framework.pdf" target="_blank">
                          <span className="flex items-center gap-2">
                            <icons.DocumentArrowDownIcon className="w-6 h-6 text-white"/> 
                            <span className="text-white hover:text-neutral-200">Resume</span>
                          </span>
                        </Link>
                      </motion.div>

                      <motion.div
                        title="backlog"
                        whileHover={{ scale: 1.15, transition: { duration: 0.6, type: "spring" } }}
                        className="px-4 py-3 border border-red-500 rounded-full bg-gradient-to-b from-red-300 to-red-500 shadow-md shadow-red-500/50 inset-shadow-md inset-shadow-red-500/50"
                      >
                          <span className="flex items-center gap-2 text-white">
                            <icons.ExclamationTriangleIcon className="w-6 h-6"/> {active.backlogs}
                          </span>
                      </motion.div>
                    </div>


                  </motion.div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4">
                <div>
                  <span className="flex items-center gap-2 text-sm pl-4 pr-6 space-x-2">
                    <icons.ClockIcon className="w-7 h-7 text-blue-500" /> 
                    <span className="text-neutral-500">{formatDateAndTime(active.createdAt)}</span>
                  </span>
                </div>

                <div>
                  <span className="flex items-center gap-2 text-sm pl-6 space-x-2">
                    <icons.ArrowPathIcon className="w-7 h-7 text-blue-500" /> 
                    <span className="text-neutral-500">{formatDateAndTime(active.updatedAt)}</span>
                  </span>
                </div>
              </div>
*/}