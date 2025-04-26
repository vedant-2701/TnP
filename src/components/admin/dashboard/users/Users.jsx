"use client";
import React, { useEffect, useRef, useState, Suspense } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "../../../../hooks/useOutsideClick";
import { useLazyLoadedIcons } from "../../../../hooks/useLazyLoadedIcons";
import { getStudentByDepartmentAndId, getStudentsByDepartment } from "../../../../services/getStudents";
import { formatDateAndTime } from "../../../../helper/formatDate";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import Loading from "../../../Loading";
import Department from "./Department";

export function Users() {
  const [active, setActive] = useState(null);
  const [cards, setCards] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [error, setError] = useState(null); // Added for error handling
  const { icons } = useLazyLoadedIcons(!!active);
  const ref = useRef(null);

  const mapStudentData = (students) => {
    return students.map(student => ({
      studentId: student.studentId,
      studentName: student.studentName || "XYZ",
      username: student.username,
      contactNumber: student.contactNumber,
      email: student.email || "abc@xyz.com",
      src: student.profileImageURL || "https://images.unsplash.com/photo-1616701318247-e87eb43e79e3?q=80&w=1948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ctaText: "View Profile",
    }));
  };

  const handleDepartmentSelect = async (deptCode) => {
    setSelectedDept(deptCode);
    setError(null); // Clear any previous errors
    if (deptCode) {
      try {
        const response = await getStudentsByDepartment(deptCode);
        if (response.success) {
          setCards(mapStudentData(response.data));
        } else {
          setError(response.message);
          setCards([]);
        }
      } catch (err) {
        setError("Failed to fetch students. Please try again.");
        setCards([]);
      }
    } else {
      setCards([]); // Clear cards if no department is selected
    }
  };

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

  const handleClick = async (card) => {
    setActive(card);
    setError(null); // Clear any previous errors
    if (!selectedDept) {
      setError("Please select a department to view student details.");
      return;
    }

    try {
      const response = await getStudentByDepartmentAndId(selectedDept, card.studentId);
      if (response.success) {
        setActive(prev => ({
          ...prev,
          cgpa: response.data.cgpa,
          department: response.data.department,
          skills: response.data.skills || [],
          resumeURL: response.data.resumeURL,
          academicYear: response.data.academicYear,
          backlogs: response.data.backlogs || 0,
          graduationYear: response.data.graduationYear,
          tenMarks: response.data.tenthMarks,
          higherSecondaryMarks: response.data.higherSecondaryMarks,
          studentType: response.data.studentType,
          createdAt: response.data.createdAt || Date.now(),
          updatedAt: response.data.updatedAt,
        }));
      } else {
        setError(response.message);
        setActive(null);
      }
    } catch (error) {
      setError("Failed to fetch student details. Please try again.");
      setActive(null);
    }
  };

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.studentId}-${active.studentId}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <Suspense fallback={<Loading />}>
              {icons ? (
                <motion.div
                  layoutId={`card-${active.studentId}-${active.studentId}`}
                  ref={ref}
                  className="w-full max-w-[500px] h-fit flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden p-4"
                >
                  <motion.div
                    layoutId={`image-${active.studentName}-${active.studentId}`}
                    className="w-full flex flex-col md:flex-row items-center p-4 gap-8"
                  >
                    <img
                      width={200}
                      height={200}
                      src={active.src}
                      alt="Student Img"
                      className="w-40 h-40 rounded-full object-cover object-top"
                    />

                    <div className="space-y-2">
                      <motion.h3
                        layoutId={`name-${active.studentName}-${active.studentId}`}
                        className="font-bold text-xl text-neutral-700 dark:text-neutral-200"
                      >
                        <span className="flex items-center gap-2">
                          {icons.UserCircleIcon ? (
                            <icons.UserCircleIcon className="w-6 h-6 text-blue-500" />
                          ) : (
                            <span className="w-6 h-6 text-blue-500">👤</span>
                          )}{" "}
                          {active.studentName}
                        </span>
                      </motion.h3>
                      <motion.p
                        layoutId={`username-${active.username}-${active.studentId}`}
                        className="text-neutral-600 dark:text-neutral-400"
                      >
                        <span className="flex items-center gap-2">
                          {icons.IdentificationIcon ? (
                            <icons.IdentificationIcon className="w-6 h-6 text-blue-500" />
                          ) : (
                            <span className="w-6 h-6 text-blue-500">🆔</span>
                          )}{" "}
                          {active.username}
                        </span>
                      </motion.p>
                      <motion.p
                        layoutId={`username-${active.department}-${active.studentId}`}
                        className="text-neutral-600 dark:text-neutral-400"
                      >
                        <span className="flex items-center gap-2">
                          {icons.BuildingOffice2Icon ? (
                            <icons.BuildingOffice2Icon className="w-6 h-6 text-blue-500" />
                          ) : (
                            <span className="w-6 h-6 text-blue-500">🏢</span>
                          )}{" "}
                          {active.department} - {active.academicYear}
                        </span>
                      </motion.p>
                      <motion.p
                        layoutId={`graduationYear-${active.graduationYear}-${active.studentId}`}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0, animationDelay: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-neutral-600 dark:text-neutral-400"
                      >
                        <span className="flex items-center gap-2">
                          {icons.AcademicCapIcon ? (
                            <icons.AcademicCapIcon className="w-6 h-6 text-blue-500" />
                          ) : (
                            <span className="w-6 h-6 text-blue-500">🎓</span>
                          )}{" "}
                          {active.studentType === "DIPLOMA"
                            ? `${parseInt(active.graduationYear) - 3}`
                            : `${parseInt(active.graduationYear) - 4}`}{" "}
                          - {active.graduationYear}
                        </span>
                      </motion.p>
                    </div>
                  </motion.div>

                  <div>
                    <div className="flex justify-between items-center px-6 py-4">
                      <div className="space-y-2">
                        <motion.h3
                          layoutId={`email-${active.email}-${active.studentId}`}
                          className="font-bold text-neutral-700 dark:text-neutral-200"
                        >
                          <span className="flex items-center gap-3">
                            <icons.EnvelopeIcon className="w-5 h-5 text-blue-500" />{" "}
                            {active.email}
                          </span>
                        </motion.h3>
                        <motion.h3
                          layoutId={`contactNumber-${active.contactNumber}-${active.studentId}`}
                          initial={{ opacity: 0, x: -40, y: 40 }}
                          animate={{ opacity: 1, x: 0, y: 0, animationDelay: 1 }}
                          exit={{ opacity: 0 }}
                          className="font-bold text-neutral-700 dark:text-neutral-200"
                        >
                          <span className="flex items-center gap-2">
                            <icons.PhoneIcon className="w-5 h-5 text-blue-500" />{" "}
                            {active.contactNumber}
                          </span>
                        </motion.h3>
                      </div>

                      {active.backlogs === 0 && (
                        <motion.div
                        layoutId={`button-${active.username}-${active.studentId}`}
                        title="CGPA"
                        whileHover={{ scale: 1.15, transition: { duration: 0.6, type: "spring" } }}
                        className="px-4 py-3 text-sm rounded-full font-bold bg-gradient-to-b from-blue-300 to-blue-600 text-white shadow-md shadow-blue-500/50 inset-shadow-md inset-shadow-blue-500/50"
                      >
                        <motion.span
                          layoutId={`cgpa-${active.cgpa}-${active.studentId}`}
                          className="flex items-center gap-2"
                        >
                            {icons.FaAward ? (
                              <icons.FaAward className="w-6 h-6" />
                            ) : (
                              <span className="w-6 h-6">🏆</span>
                            )}{" "}
                            {active.cgpa}
                        </motion.span>
                      </motion.div>
                      )}
                    </div>
                    <div className="pt-4 relative px-4">
                      <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-60 pb-10 flex flex-col items-start gap-4 overflow-y-auto dark:text-neutral-400 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] scroll-smooth"
                      >
                        <div className="w-full flex flex-col px-4">
                          <h3 className="text-lg md:text-xl mb-4">Marks</h3>

                          <div className="space-y-3">
                            <motion.div
                              layoutId={`higherSecondaryMarks-${active.higherSecondaryMarks}-${active.studentId}`}
                              initial={{ opacity: 0, x: -40 }}
                              animate={{ opacity: 1, x: 0, animationDelay: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <span className="flex items-center gap-2">
                                {icons.FaRegIdBadge ? (
                                  <icons.FaRegIdBadge className="w-6 h-6 text-blue-500" />
                                ) : (
                                  <span className="w-6 h-6 text-blue-500">📜</span>
                                )}{" "}
                                {active.studentType?.charAt(0) +
                                  active.studentType?.slice(1).toLowerCase()}{" "}
                                : {active.higherSecondaryMarks} %
                              </span>
                            </motion.div>

                            <motion.div
                              layoutId={`tenMarks-${active.tenMarks}-${active.studentId}`}
                              initial={{ opacity: 0, x: -40 }}
                              animate={{ opacity: 1, x: 0, animationDelay: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <span className="flex items-center gap-2">
                                {icons.FaRegIdBadge ? (
                                  <icons.FaRegIdBadge className="w-6 h-6 text-blue-500" />
                                ) : (
                                  <span className="w-6 h-6 text-blue-500">📜</span>
                                )}{" "}
                                SSC : {active.tenMarks} %
                              </span>
                            </motion.div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 pt-4">
                          <h3 className="text-lg md:text-xl px-4">Skills</h3>
                          <div className="flex flex-wrap gap-4 p-4">
                            {active.skills && active.skills.length > 0 ? (
                              active.skills.map((skill, index) => (
                                <motion.div
                                  layoutId={`skills-${active.skills}-${index}-${active.studentId}`}
                                  initial={{ opacity: 0, x: index * -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0 }}
                                  transition={{
                                    duration: 0.6,
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 5,
                                  }}
                                  whileHover={{ scale: 1.15, transition: { duration: 0.6 } }}
                                  key={index}
                                  className="cursor-pointer text-center border border-blue-500 rounded-full px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 inset-shadow-sm inset-shadow-blue-500/50 shadow-sm shadow-blue-500/50"
                                >
                                  <span>{skill}</span>
                                </motion.div>
                              ))
                            ) : (
                              <p className="text-neutral-500 px-4">No skills listed.</p>
                            )}
                          </div>
                        </div>

                        <div className="w-full flex justify-evenly items-center p-4">
                          <motion.div
                            whileHover={{ scale: 1.15, transition: { duration: 0.6, type: "spring" } }}
                            className="px-4 py-3 border border-blue-500 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 shadow-md shadow-blue-500/50 inset-shadow-md inset-shadow-blue-500/50"
                          >
                            <Link to={active.resumeURL || "#"} target="_blank">
                              <span className="flex items-center gap-2 text-white">
                                {icons.DocumentArrowDownIcon ? (
                                  <icons.DocumentArrowDownIcon className="w-6 h-6" />
                                ) : (
                                  <span className="w-6 h-6">📄</span>
                                )}{" "}
                                <span className="hover:text-neutral-200">Resume</span>
                              </span>
                            </Link>
                          </motion.div>

                          {active.backlogs > 0 && (
                            <motion.div
                              title="backlog"
                              whileHover={{ scale: 1.15, transition: { duration: 0.6, type: "spring" } }}
                              className="px-4 py-3 border border-red-500 rounded-full bg-gradient-to-b from-red-300 to-red-500 shadow-md shadow-red-500/50 inset-shadow-md inset-shadow-red-500/50"
                            >
                              <span className="flex items-center gap-2 text-white">
                                {icons.ExclamationTriangleIcon ? (
                                  <icons.ExclamationTriangleIcon className="w-6 h-6" />
                                ) : (
                                  <span className="w-6 h-6">⚠️</span>
                                )}{" "}
                                {active.backlogs}
                              </span>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    {/* Time Stamp */}
                    <div className="flex justify-between items-center p-4">
                      <div>
                        <span className="flex items-center gap-2 text-sm pl-4 pr-6 space-x-2">
                          {icons.ClockIcon ? (
                            <icons.ClockIcon className="w-7 h-7 text-blue-500" />
                          ) : (
                            <span className="w-7 h-7 text-blue-500">⏰</span>
                          )}{" "}
                          <span className="text-neutral-500">
                            {formatDateAndTime(active.createdAt)}
                          </span>
                        </span>
                      </div>

                      <div>
                        <span className="flex items-center gap-2 text-sm pl-6 space-x-2">
                          {icons.ArrowPathIcon ? (
                            <icons.ArrowPathIcon className="w-7 h-7 text-blue-500" />
                          ) : (
                            <span className="w-7 h-7 text-blue-500">🔄</span>
                          )}{" "}
                          <span className="text-neutral-500">
                            {formatDateAndTime(active.updatedAt)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <Loading />
              )}
            </Suspense>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="w-full">
        {error && (
          <div className="p-4 text-center text-red-500">
            {error}
          </div>
        )}
        <div className="flex justify-center items-center p-4">
          <Department onDepartmentSelect={handleDepartmentSelect} />
        </div>

        {cards.length > 0 ? (
          <ul className="mx-auto w-full gap-4 px-12">
            {cards.map((card, index) => (
              <motion.div
                layoutId={`card-${card.studentId}-${card.studentId}`}
                key={card.studentId}
                onClick={() => handleClick(card)}
                whileHover={{ scale: 1.01 }}
                className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer hover:shadow-md"
              >
                <div className="flex gap-4 flex-col md:flex-row">
                  <motion.div layoutId={`image-${card.studentName}-${card.studentId}`}>
                    <img
                      width={100}
                      height={100}
                      src={card.src}
                      alt={card.studentName}
                      className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                    />
                  </motion.div>
                  <div className="">
                    <motion.h3
                      layoutId={`name-${card.studentName}-${card.studentId}`}
                      className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                    >
                      {card.studentName}
                    </motion.h3>

                    <div className="space-x-6 flex">
                      <motion.span
                        layoutId={`username-${card.username}-${card.studentId}`}
                        className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                      >
                        {card.username}
                      </motion.span>
                      <motion.span
                        layoutId={`email-${card.email}-${card.studentId}`}
                        className="text-neutral-600 dark:text-neutral-400 text-center md:text-left flex items-center gap-2"
                      >
                        <EnvelopeIcon className="w-5 h-5 text-blue-500" /> {card.email}
                      </motion.span>
                      <motion.span
                        layoutId={`contactNumber-${card.contactNumber}-${card.studentId}`}
                        className="text-neutral-600 dark:text-neutral-400 text-center md:text-left flex items-center gap-2"
                      >
                        <PhoneIcon className="w-5 h-5 text-blue-500" />{" "}
                        {card.contactNumber || "+123456789"}
                      </motion.span>
                    </div>
                  </div>
                </div>
                <motion.button
                  layoutId={`button-${card.username}-${card.studentId}`}
                  className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-blue-500 hover:text-white hover:cursor-pointer text-black mt-4 md:mt-0"
                >
                  {card.ctaText}
                </motion.button>
              </motion.div>
            ))}
          </ul>
        ) : (
          <p className="text-center text-neutral-500 p-4">
            No students found. Please select a department.
          </p>
        )}
      </div>
    </>
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