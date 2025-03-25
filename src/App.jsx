import { SidebarDemo } from "./SidebarDemo";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
import { ToastContainer, Bounce } from 'react-toastify';
// import { Bounce } from 'react-toastify/dist/ReactToastify.css';
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
// import FileUpload from "./components/admin/dashboard/upload-data/FileUpload";

export default function App() {
  return (
    <Router>
      {/* <Toaster position="top-right" /> */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
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
      </Routes>
    </Router>

    // <Router>
    //   {/* <Toaster position="top-right" /> */}
    //   {/* <SidebarDemo /> */}
    //   <FileUpload />
    // </Router>
  );
};
