import UploadDataRoutes from "../../../../routes/admin/dashboard/upload-data/UploadDataRoutes";
import UploadOptions from "../../../../components/admin/dashboard/upload-data/UploadOptions";

export default function UploadDataPage() {
    return (
        <div className="mx-auto w-full flex flex-col items-center p-4">
            <UploadOptions />
            <div className="w-full">
                <UploadDataRoutes />
            </div>
        </div>
    );
};
