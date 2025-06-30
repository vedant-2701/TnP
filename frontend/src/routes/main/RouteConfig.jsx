import Login from "../../components/auth/Login";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
// import NotFound from "../../components/shared/NotFound";
import { SidebarDemo } from "../../SidebarDemo";
import { Routes, Route, Navigate } from 'react-router-dom';


export default function RouteConfig() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route
                path="/dashboard/*"
                element={
                    <ProtectedRoute>
                        <SidebarDemo />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
            {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
    );
};
