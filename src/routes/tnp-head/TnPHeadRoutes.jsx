import { Routes, Route } from 'react-router-dom';
import Dashboard from "../../components/shared/Dashboard";
import { Suspense, lazy } from 'react';
import Loading from '../../components/Loading';

const UsersPage = lazy(() => import ('../../pages/tnp-head/dashboard/students/StudentsPage'));
const AnalyticsDashboardPage = lazy(() => import ('../../pages/tnp-head/dashboard/analytics/AnalyticsDashboardPage'));
// const UploadDataPage = lazy(() => import ('../../pages/admin/dashboard/upload-data/UploadDataPage'));

export default function TnPHeadRoutes() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="students" element={<UsersPage />} />
                <Route path="analytics" element={<AnalyticsDashboardPage />} />
                {/* <Route path="upload/*" element={<UploadDataPage />} /> */}
                <Route path="*" element={<Dashboard />} />
            </Routes>
        </Suspense>
    );
};