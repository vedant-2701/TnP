import { Routes, Route } from 'react-router-dom';
import Dashboard from '../shared/Dashboard';
import UploadOptions from './dashboard/upload-data/UploadOptions';
import { Users } from "./dashboard/users/Users";
import AnalyticsDashboard from '../../pages/dashboard/analytics/AnalyticsDashboardPage';
// import SingleUser from './dashboard/single-user-upload/SingleUser';

export default function AdminDashboard() {
  return (
    <Routes>
      <Route path="/users" element={<Users />} />
      <Route path="/analytics" element={<AnalyticsDashboard />} />
      <Route path="/upload/*" element={<UploadOptions />} />
      <Route path="/*" element={<Dashboard />} />
    </Routes>
  );
};