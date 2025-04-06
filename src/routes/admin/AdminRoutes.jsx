import { Routes, Route } from 'react-router-dom';
import Dashboard from "../../components/shared/Dashboard";
import { Suspense, lazy } from 'react';
import Loading from '../../components/Loading';

const UsersPage = lazy(() => import ('../../pages/admin/dashboard/users/UsersPage'));
const AnalyticsDashboardPage = lazy(() => import ('../../pages/admin/dashboard/analytics/AnalyticsDashboardPage'));
const UploadDataPage = lazy(() => import ('../../pages/admin/dashboard/upload-data/UploadDataPage'));

export default function AdminRoutes() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="users" element={<UsersPage />} />
                <Route path="analytics" element={<AnalyticsDashboardPage />} />
                <Route path="upload/*" element={<UploadDataPage />} />
                <Route path="*" element={<Dashboard />} />
            </Routes>
        </Suspense>
    );
};