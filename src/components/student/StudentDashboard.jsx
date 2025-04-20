import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getStudentByUsername } from '../../services/getStudents';
import { getUser } from '../../utils/userStorage';
import { EnvelopeIcon, PhoneIcon, AcademicCapIcon, DocumentArrowDownIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { FaAward } from 'react-icons/fa6';
import Loading from '../Loading';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { LuDot } from "react-icons/lu";

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user || user.role !== 'STUDENT') {
      toast.error('Unauthorized access');
      navigate('/');
      return;
    }

    const fetchStudentData = async () => {
      try {
        const response = await getStudentByUsername(user.username);
        if (response.success) {
            console.log(response.data);
          setStudentData(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        setError(err.message || 'Failed to load student data');
        toast.error(err.message || 'Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user, navigate]);

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full p-8 bg-gray-50 min-h-screen"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
          <div className="flex items-center space-x-4">
            <img
              src={studentData?.profileImageURL || 'https://via.placeholder.com/40'}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />

          </div>
        </header>

        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-start gap-8">
            <img
              src={studentData?.profileImageURL || 'https://via.placeholder.com/128'}
              alt={studentData?.studentName}
              className="w-32 h-32 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">{studentData?.studentName}</h2>
                  <p className="text-gray-500 mt-1">
                  {studentData?.gender} <LuDot /> {studentData?.username} 
                  </p>
                </div>
                <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  {studentData?.studentType}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800">{studentData?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <PhoneIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="text-gray-800">{studentData?.contactNumber}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="text-gray-800">{studentData?.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <FaAward className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">CGPA</p>
                      <p className="text-gray-800">{studentData?.cgpa}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Academic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Academic Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Academic Year</span>
                <span className="font-medium">{studentData?.academicYear}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Expected Graduation</span>
                <span className="font-medium">{studentData?.graduationYear}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">10th Marks</span>
                <span className="font-medium">{studentData?.tenthMarks}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">12th Marks</span>
                <span className="font-medium">{studentData?.higherSecondaryMarks}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Backlogs</span>
                <span className="font-medium">{studentData?.backlogs}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Skills & Documents</h3>
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {studentData?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t">
              <a
                href={studentData?.resumeURL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                <span>View Resume</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}