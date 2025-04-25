import JobPosting from "../../../../components/tpo-head/dashboard/jobPostings/JobPosting";
import JobDetails from "../../../../components/tpo-head/dashboard/jobPostings/JobDetails";
import { Routes, Route } from "react-router-dom";
import NotFound from "../../../../components/shared/NotFound";


export default function JobPostingRoutes() {
    return (
        <Routes>
            <Route path="/" element={<JobPosting />} />
            <Route path="/:id/*" element={ <JobDetails /> }/>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
