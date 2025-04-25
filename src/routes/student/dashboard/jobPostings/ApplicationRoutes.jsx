import JobPosting from "../../../../components/student/dashboard/jobPostings/application/JobPosting";
import JobDetails from "../../../../components/student/dashboard/jobPostings/application/JobDetails";
import { Routes, Route } from "react-router-dom";
import NotFound from "../../../../components/shared/NotFound";


export default function ApplicationRoutes() {
    return (
        <Routes>
            <Route path="/" element={<JobPosting />} />
            <Route path="/:id/*" element={ <JobDetails /> }/>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
