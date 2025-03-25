import { Routes, Route } from 'react-router-dom';
import FileUpload from './dashboard/upload-data/FileUpload';
import Dashboard from '../shared/Dashboard';

export default function AdminDashboard() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/home" element={<Dashboard />} />
      <Route path="/upload-students" element={<FileUpload />} />
      <Route path="/*" element={<Dashboard />} />
    </Routes>
  );
};