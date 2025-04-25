import { Routes, Route } from 'react-router-dom';
import Dashboard from "../../components/shared/Dashboard";
import { Suspense, lazy } from 'react';
import Loading from '../../components/Loading';
import DriveRoutes from './dashboard/jobPostings/DriveRoutes';
import ApplicationRoutes from './dashboard/jobPostings/ApplicationRoutes';
import StudentDashboard from '../../components/student/StudentDashboard';

export default function StudentRoutes() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="upcoming-drives/*" element={<DriveRoutes />} />
                <Route path="applications/*" element={<ApplicationRoutes />} />
                <Route path="profile" element={<StudentDashboard />} />
                <Route path="*" element={<Dashboard />} />
            </Routes>
        </Suspense>
    );
};