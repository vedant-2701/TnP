"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import { EnvelopeIcon, PhoneIcon, ClockIcon, CheckIcon } from "@heroicons/react/24/outline";
import { api } from "../../../../../helper/createApi";
import { FileQuestion } from "lucide-react";
export function EligibleStudents() {
    const { id } = useParams();
  const [cards, setCards] = useState([]);

  const mapStudentData = (students) => {
    return students.map(student => ({
      studentId: student.studentId,
      studentName: student.studentName || "XYZ",
      username: student.username,
      contactNumber: student.contactNumber,
      email: student.email || "abc@xyz.com",
      src: student.profileImageURL || "https://images.unsplash.com/photo-1616701318247-e87eb43e79e3?q=80&w=1948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      status: student.status,
    }));
  };

  const fetchEligibleStudents = async () => {
    const response = await api.get(`/getEligibleStudents/${id}`);

    console.log(response);

    if(response.status === 200) {
        setCards(mapStudentData(response.data));
    } else {
        console.log(response.error);
    }
  }

  useEffect(() => {
    fetchEligibleStudents();
  }, []);

  return (
    <>
      <div className="w-full">
        <ul className="mx-auto w-full gap-4 px-12">
          {cards.length > 0 ? cards.map((card, index) => (
            <motion.div
              layoutId={`card-${card.studentId}-${card.studentId}`}
              key={card.studentId}
              whileHover={{ scale: 1.01 }}
              className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer hover:shadow-md">
              <div className="flex gap-4 flex-col md:flex-row ">
                <motion.div layoutId={`image-${card.studentName}-${card.studentId}`}>
                  <img
                    width={100}
                    height={100}
                    src={card.src}
                    alt={card.studentName}
                    className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top" />
                </motion.div>
                <div className="">
                  <motion.h3
                    layoutId={`name-${card.studentName}-${card.studentId}`}
                    className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left">
                    {card.studentName}
                  </motion.h3>

                  <div className="space-x-6 flex">
                    <motion.span
                      layoutId={`username-${card.username}-${card.studentId}`}
                      className="text-neutral-600 dark:text-neutral-400 text-center md:text-left">
                      {card.username}
                    </motion.span>
                    <motion.span
                      layoutId={`email-${card.email}-${card.studentId}`}
                      className="text-neutral-600 dark:text-neutral-400 text-center md:text-left flex items-center gap-2">
                        <EnvelopeIcon className="w-5 h-5 text-blue-500"/> {card.email}
                    </motion.span>
                    <motion.span
                      layoutId={`contactNumber-${card.contactNumber}-${card.studentId}`}
                      className="text-neutral-600 dark:text-neutral-400 text-center md:text-left flex items-center gap-2">
                        <PhoneIcon className="w-5 h-5 text-blue-500"/> {card.contactNumber || "+123456789"}
                    </motion.span>
                    {/* <motion.span
                      layoutId={`cgpa-${card.cgpa}-${card.studentId}`}
                      className="text-neutral-600 dark:text-neutral-400 text-center md:text-left">
                      CGPA: {card.cgpa}
                    </motion.span> */}
                  </div>
                </div>
              </div>
              <motion.button
                layoutId={`button-${card.username}-${card.studentId}`}
                className={`px-4 py-3 rounded-full font-bold text-white hover:cursor-pointer mt-4 md:mt-0
                ${card.status === "Applied" ? "bg-green-400" : "bg-yellow-400"}`}>
                <span className="flex justify-center items-center gap-2">
                    {card.status === "APPLIED" ? <CheckIcon className="text-white w-5 h-5"/> : <ClockIcon className="text-white w-5 h-5"/>} {card.status}
                </span>
              </motion.button>
            </motion.div>
          )) : (
            <EmptyEligibleStudents />
          )}
        </ul>
      </div>
    </>
  );
}


const EmptyEligibleStudents = () => {
    return (
        <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center justify-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <FileQuestion className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Eligible Students</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    There are currently no eligible Students for this opportunity.
                </p>
            </div>
        </div>
    );
}