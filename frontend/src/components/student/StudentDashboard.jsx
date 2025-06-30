import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getStudentByUsername, updateProfile, uploadProfilePic, updateProfileComplete } from '../../services/getStudents';
import { getUser } from '../../utils/userStorage';
import { EnvelopeIcon, PhoneIcon, AcademicCapIcon, DocumentArrowDownIcon, IdentificationIcon, CakeIcon } from '@heroicons/react/24/outline';
import { FaAward } from 'react-icons/fa6';
import Loading from '../Loading';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { LuDot } from 'react-icons/lu';
import { formatDate } from '../../helper/formatDate';
import { Label } from '../ui/form/Label';
import { Input } from '../ui/form/Input';
import { DatePickerWithEffect } from '../ui/form/DatePickerEffect';

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    profileImageURL: '',
    email: '',
    contactNumber: '',
    backlogs: '',
    skills: [],
    resumeURL: '',
    tenthMarks: '',
    higherSecondaryMarks: '',
    cgpa: '',
    studentName: '', // Added for student name
    academicYear: '', // Added for academic year
    gender: '', // Added for gender
    dateOfBirth: '', // Added for DOB
    studentType: '', // Added for student type
  });
  const [newSkill, setNewSkill] = useState(''); // State for new skill input
  const [selectedDate, setSelectedDate] = useState(null); // State for date picker
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
          setStudentData(response.data);
          setEditData({
            profileImageURL: response.data.profileImageURL || '',
            email: response.data.email || '',
            contactNumber: response.data.contactNumber || '',
            backlogs: response.data.backlogs || '',
            skills: response.data.skills || [],
            resumeURL: response.data.resumeURL || '',
            tenthMarks: response.data.tenthMarks || '',
            higherSecondaryMarks: response.data.higherSecondaryMarks || '',
            cgpa: response.data.cgpa || '',
            studentName: response.data.studentName || '', // Initialized with student name
            academicYear: response.data.academicYear || '', // Initialized with academic year
            gender: response.data.gender || '', // Initialized with gender
            dateOfBirth: response.data.dateOfBirth || '', // Initialized with DOB
            studentType: response.data.studentType || '', // Initialized with student type
          });
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
  }, []);

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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData((prev) => ({ ...prev, profileImageURL: URL.createObjectURL(file) }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !editData.skills.includes(newSkill.trim())) {
      setEditData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill(''); // Clear the input after adding
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const studentDTO = {
        username: user.username,
        email: editData.email,
        contactNumber: editData.contactNumber,
        backlogs: editData.backlogs,
        skills: editData.skills,
        resumeURL: editData.resumeURL,
        tenthMarks: editData.tenthMarks,
        higherSecondaryMarks: editData.higherSecondaryMarks,
        cgpa: editData.cgpa,
        studentName: editData.studentName, // Added student name
        academicYear: editData.academicYear, // Added academic year
        gender: editData.gender, // Added gender
        dateOfBirth: editData.dateOfBirth, // Added DOB
        studentType: editData.studentType, // Added student type
      };
      console.log(studentDTO);

      let updatedStudentDTO = null;

      if (e.target.profileImage.files[0]) {
        // Use updateProfileComplete for both profile data and image
        const formData = new FormData();
        formData.append('studentDTO', JSON.stringify(studentDTO));
        formData.append('profileImage', e.target.profileImage.files[0]);
        const response = await updateProfileComplete(formData);
        if (response.success) {
          updatedStudentDTO = response.data;
        } else {
          throw new Error(response.message);
        }
      } else {
        // Use updateProfile for text fields only
        const response = await updateProfile(studentDTO);
        if (response.success) {
          updatedStudentDTO = response.data;
        } else {
          throw new Error(response.message);
        }
      }

      if (updatedStudentDTO) {
        toast.success('Profile updated successfully!');
        setStudentData(updatedStudentDTO);
        setIsEditing(false);
        navigate('/dashboard/profile'); // Navigate back to profile page
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      toast.error(err.message || 'Failed to update profile');
    }
  };

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
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 bg-gradient-to-b from-blue-300 to-blue-600 rounded-xl shadow-md text-white cursor-pointer"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </header>

        {!isEditing ? (
          <>
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
                      <p className="text-gray-500 mt-1 flex justify-center items-center gap-2">{studentData?.username} <LuDot className="inline" />{' '}
                        {studentData?.gender} <LuDot className="inline" />{' '}
                        <span className='inline-flex justify-center items-center gap-1'>
                          <CakeIcon className='w-5 h-5'/>{formatDate(studentData?.dateOfBirth)}
                        </span>
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
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Photo */}
              <div>
                <Label htmlFor="profileImage">Profile Photo</Label>
                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {editData.profileImageURL && (
                  <img
                    src={editData.profileImageURL}
                    alt="Preview"
                    className="mt-2 w-32 h-32 rounded-full object-cover"
                  />
                )}
              </div>

              {/* Student Name */}
              <div>
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  type="text"
                  name="studentName"
                  value={editData.studentName}
                  onChange={handleInputChange}
                  placeholder="Enter student name"
                />
              </div>

              {/* Academic Year */}
              <div>
                <Label htmlFor="academicYear">Academic Year</Label>
                <Input
                  id="academicYear"
                  type="text"
                  name="academicYear"
                  value={editData.academicYear}
                  onChange={handleInputChange}
                  placeholder="Enter academic year (e.g., 2023-2024)"
                />
              </div>

              {/* Gender */}
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  type="text"
                  name="gender"
                  value={editData.gender}
                  onChange={handleInputChange}
                  placeholder="Enter gender (e.g., Male/Female)"
                  className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                > <option value="" disabled>Select Type</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              </div>

             

              {/* Date of Birth */}
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  value={editData.dateOfBirth}
                  onChange={handleInputChange}
                  placeholder="Select date of birth"
                />

                {/* <DatePickerWithEffect
                  label="Date of Birth"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  isRequired
                  showMonthAndYearPickers
              /> */}
              </div>

              {/* Student Type */}
              <div>
                <Label htmlFor="studentType">Student Type</Label>
                <select
                  id="studentType"
                  name="studentType"
                  value={editData.studentType}
                  onChange={handleInputChange}
                  className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select Type</option>
                  <option value="DIPLOMA">DIPLOMA</option>
                  <option value="REGULAR">REGULAR</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                />
              </div>

              {/* Contact Number */}
              <div>
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  name="contactNumber"
                  value={editData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="Enter contact number"
                />
              </div>

              {/* Backlogs */}
              <div>
                <Label htmlFor="backlogs">Backlogs</Label>
                <Input
                  id="backlogs"
                  type="number"
                  name="backlogs"
                  value={editData.backlogs}
                  onChange={handleInputChange}
                  placeholder="Enter number of backlogs"
                />
              </div>

              {/* Skills */}
              <div>
                <Label>Skills</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {editData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input
                      id="newSkill"
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Enter a skill"
                      className="mt-0 w-64"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-gradient-to-b from-blue-300 to-blue-600 rounded-xl shadow-md text-white hover:from-blue-400 hover:to-blue-700 transition duration-300"
                    >
                      Add Skill
                    </button>
                  </div>
                </div>
              </div>

              {/* 10th Marks */}
              <div>
                <Label htmlFor="tenthMarks">10th Marks</Label>
                <Input
                  id="tenthMarks"
                  type="number"
                  name="tenthMarks"
                  value={editData.tenthMarks}
                  onChange={handleInputChange}
                  placeholder="Enter 10th marks (%)"
                  step="0.01"
                  min="0"
                  max="100"
                />
              </div>

              {/* 12th Marks */}
              <div>
                <Label htmlFor="higherSecondaryMarks">12th Marks/Diploma</Label>
                <Input
                  id="higherSecondaryMarks"
                  type="number"
                  name="higherSecondaryMarks"
                  value={editData.higherSecondaryMarks}
                  onChange={handleInputChange}
                  placeholder="Enter 12th marks (%)"
                  step="0.01"
                  min="0"
                  max="100"
                />
              </div>

              {/* CGPA */}
              <div>
                <Label htmlFor="cgpa">CGPA</Label>
                <Input
                  id="cgpa"
                  type="number"
                  name="cgpa"
                  value={editData.cgpa}
                  onChange={handleInputChange}
                  placeholder="Enter CGPA"
                  step="0.01"
                  min="0"
                  max="10"
                />
              </div>

              {/* Resume URL */}
              <div>
                <Label htmlFor="resumeURL">Resume URL</Label>
                <Input
                  id="resumeURL"
                  type="url"
                  name="resumeURL"
                  value={editData.resumeURL}
                  onChange={handleInputChange}
                  placeholder="Enter resume URL"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-b from-blue-300 to-blue-600 rounded-xl shadow-md text-white hover:from-blue-400 hover:to-blue-700 transition duration-300"
              >
                Save Changes
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}