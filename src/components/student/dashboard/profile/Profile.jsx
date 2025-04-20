import { api } from '../../../../helper/createApi';
import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, School, Award, BookOpen, 
  GraduationCap, FileText, Activity, Home, 
  Settings, LogOut, ChevronRight, Bell 
} from 'lucide-react';

function App() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const studentId = "2024CS001";

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/${studentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student data');
        }
      
        setStudentData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-20 bg-white shadow-lg flex flex-col items-center py-8 space-y-8">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <nav className="flex flex-col items-center space-y-6">
          <button className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Home className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50">
            <User className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50">
            <BookOpen className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50">
            <Activity className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50">
            <Settings className="w-6 h-6" />
          </button>
        </nav>
        <div className="mt-auto">
          <button className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <img
                src={studentData.profileImageURL}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            </div>
          </header>

          {/* Profile Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-start gap-8">
              <img
                src={studentData.profileImageURL}
                alt={studentData.studentName}
                className="w-32 h-32 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{studentData.studentName}</h2>
                    <p className="text-gray-500 mt-1">{studentData.studentId} · {studentData.username}</p>
                  </div>
                  <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                    {studentData.studentType}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mt-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-900">{studentData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="text-gray-900">{studentData.contactNumber}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                        <School className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="text-gray-900">{studentData.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <Award className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">CGPA</p>
                        <p className="text-gray-900">{studentData.cgpa}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Academic Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Academic Year</span>
                  <span className="font-medium">{studentData.academicYear}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Expected Graduation</span>
                  <span className="font-medium">{studentData.graduationYear}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">10th Marks</span>
                  <span className="font-medium">{studentData.tenMarks}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">12th Marks</span>
                  <span className="font-medium">{studentData.higherSecondaryMarks}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Backlogs</span>
                  <span className="font-medium">{studentData.backlogs}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Skills & Documents</h3>
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {studentData.skills.map((skill, index) => (
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
                  href={studentData.resumeURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <FileText className="w-5 h-5" />
                  <span>View Resume</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;