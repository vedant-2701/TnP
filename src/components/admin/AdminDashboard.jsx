import { Routes, Route } from 'react-router-dom';
import Dashboard from '../shared/Dashboard';
import UploadStudents from './dashboard/upload-data/UploadStudents';
import { Users } from "./dashboard/users/Users";
// import SingleUser from './dashboard/single-user-upload/SingleUser';

export default function AdminDashboard() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/home" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/upload/*" element={<UploadStudents />} />
      <Route path="/*" element={<Dashboard />} />
    </Routes>
  );
};