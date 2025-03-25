import React from 'react';

// Separate component for the dashboard content (skeleton loading UI)
const Dashboard = () => {
  return (
    (<div className="flex flex-1 py-2 pr-2 bg-white">
      <div
        className="p-2 md:p-10 rounded-2xl bg-[#f8f9fd] dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex gap-2">
          {[...new Array(4)].map((i) => (
            <div
              key={"first-array" + i}
              className="h-20 w-full rounded-lg  bg-gray-200 dark:bg-neutral-800 animate-pulse"></div>
          ))}
        </div>
        <div className="flex gap-2 flex-1">
          {[...new Array(2)].map((i) => (
            <div
              key={"second-array" + i}
              className="h-full w-full rounded-lg  bg-gray-200 dark:bg-neutral-800 animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>)
  );
};

export default Dashboard;