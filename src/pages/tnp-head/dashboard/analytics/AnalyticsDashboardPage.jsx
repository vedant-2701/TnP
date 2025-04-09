import React, { useState, useEffect } from 'react';
import { applicationStatus, studentsByDepartment, placementSuccessRate, topRecruiters, recruiterApplications } from '../../../../services/getAnalytics';
import ApplicationStatusChart from '../../../../components/tpo-head/dashboard/analytics/charts/ApplicationStatusChart';
import TopRecruitersChart from '../../../../components/tpo-head/dashboard/analytics/charts/TopRecruitersChart';
import StudentsByDepartmentChart from '../../../../components/tpo-head/dashboard/analytics/charts/StudentsByDepartmentChart';
import PlacementSuccessRateChart from '../../../../components/tpo-head/dashboard/analytics/charts/PlacementSuccessRateChart';
import RecruiterApplicationsChart from '../../../../components/tpo-head/dashboard/analytics/charts/RecruiterApplicationsChart';

const AnalyticsDashboardPage = () => {
  const [appStatus, setAppStatus] = useState({});
  const [studeByDep, setStudByDepart] = useState({});
  const [placementSuccess, setPlacementSuccess] = useState({});
  const [recruiters, setRecruiters] = useState([]);
  const [recruiterApp, setRecruiterApp] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appStatusRes = await applicationStatus();
        console.log(appStatusRes);
        setAppStatus(appStatusRes.data);

        const studentsByDeptRes = await studentsByDepartment();
        console.log(studentsByDeptRes);
        setStudByDepart(studentsByDeptRes.data);

        const placementSuccessRes = await placementSuccessRate();
        console.log(placementSuccessRes);
        setPlacementSuccess(placementSuccessRes.data);

        const topRecruitersRes = await topRecruiters();
        console.log(topRecruitersRes);
        setRecruiters(topRecruitersRes.data);

        const recruiterAppsRes = await recruiterApplications();
        console.log(recruiterAppsRes);
        setRecruiterApp(recruiterAppsRes.data);

      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Analytics Dashboard</h1>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* cols-span-2 - 1st Row*/}
        <PlacementSuccessRateChart data={placementSuccess} />

        {/* 2nd Row */}
        <ApplicationStatusChart data={appStatus} />
        <StudentsByDepartmentChart data={studeByDep} />

        {/* 3rd Row */}
        <TopRecruitersChart data={recruiters} />
        <TopRecruitersChart data={[
              {
                  "hiredCount": 1,
                  "companyName": "AI Dynamics"
              },
          {
                  "hiredCount": 10,
                  "companyName": "Atlas Copco"
              }
          ]} />
        <RecruiterApplicationsChart data={recruiterApp} />
        <RecruiterApplicationsChart data={{
          "AutoMation": {
              "INTERVIEWED": 4,
              "HIRED": 2,
              "APPLIED": 5
          },
          "AI Dynamics": {
              "INTERVIEWED": 4,
              "HIRED": 4,
              "APPLIED": 4
          },
          "MechWorks": {
              "INTERVIEWED": 3,
              "HIRED": 2,
              "APPLIED": 3
          },
        }} />
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;