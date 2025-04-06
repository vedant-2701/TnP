// import FileUpload from "../../../../components/admin/dashboard/upload-data/FileUpload";
// import { SingleUserUpload } from "../../../../components/admin/dashboard/upload-data/SingleUserUpload";
import NotFound from "../../../../components/shared/NotFound";
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loading from "../../../../components/Loading";

const FileUpload = lazy(() => import ('../../../../components/admin/dashboard/upload-data/FileUpload'));
const SingleUserUpload = lazy(() => import ('../../../../components/admin/dashboard/upload-data/SingleUserUpload'));

export default function UploadDataRoutes() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/" element={<FileUpload />} />
                <Route path="upload-students" element={<FileUpload />} />
                <Route path="upload-student" element={<SingleUserUpload />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};
