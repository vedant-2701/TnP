import { Suspense, lazy } from "react";
import Header from "../shared/Header";
import Loading from "../Loading";
import Scrollable from "../shared/Scrollable";

const dashboardComponent = {
    'ADMIN' : lazy(() => import ("../admin/AdminDashboard")),
    // 'STUDENT' : lazy(() => import ("../student/StudentDashboard")),
}

export default function MainDashboard({ role }) {
    const DashboardComponent = dashboardComponent[role];

    if(!DashboardComponent) {
        throw new Error(`Dashboard component for role ${role} is not defined`);
    }

    return (
        <>
            <div className="flex flex-1 py-2 pr-2 bg-white">
                <div className="p-2 md:p-6 rounded-2xl bg-[#f8f9fd] dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                    <div className="sticky top-0">
                        <Header />
                    </div>
                    {/* Role based dashboard */}
                    <Suspense fallback={<Loading />}>
                        <Scrollable>
                            <DashboardComponent />
                        </Scrollable>
                    </Suspense>
                </div>
            </div>
        </>
    );
};
