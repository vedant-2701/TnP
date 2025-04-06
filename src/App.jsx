import { BrowserRouter as Router } from 'react-router-dom';
import RouteConfig from './routes/main/RouteConfig';
import { ToastContainer, Bounce } from 'react-toastify';


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
      <RouteConfig />
    </Router>

    // <Router>
    //   {/* <Toaster position="top-right" /> */}
    //   {/* <SidebarDemo /> */}
    //   <FileUpload />
    // </Router>
  );
};
