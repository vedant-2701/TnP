import React, { useState, useEffect } from "react";
import { ButtonGroup, Button } from '@mui/material';
import { getDepartment } from "../../../../services/getStudents";
import Loading from "../../../Loading";

export default function Department({ onDepartmentSelect }) {
  const [departments, setDepartments] = useState([]);
  const [activeBtn, setActiveBtn] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseStyles = "w-1/4 !shadow-md !inset-shadow-sm !inset-shadow-blue-500/50 !px-4 !py-3 text-sm font-medium transition-all duration-200 ease-in-out hover:bg-gray-200";
  const activeStyles = "bg-gradient-to-b from-blue-300 to-blue-600 !text-white";
  const inactiveStyles = "bg-white text-black";

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const response = await getDepartment();
        console.log(response);
        if (response.success) {
          setDepartments(response.data);
          setActiveBtn(response.data[0] || null);
          if (response.data[0] && onDepartmentSelect) {
            onDepartmentSelect(response.data[0]);
          }
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to fetch departments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleButtonClick = (deptCode) => {
    setActiveBtn(deptCode);
    if (onDepartmentSelect) {
      onDepartmentSelect(deptCode);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <ButtonGroup 
      variant="outlined" 
      aria-label="Department options button group" 
    //   className="mb-6"
      className="w-1/2"
    >
      {departments.map((dept, index) => {
        const isFirst = index === 0;
        const isLast = index === departments.length - 1;
        const isActive = activeBtn === dept;

        return (
          <Button
            key={dept}
            onClick={() => handleButtonClick(dept)}
            className={`
              ${baseStyles}
              ${isFirst ? '!rounded-tl-xl !rounded-bl-xl' : ''}
              ${isLast ? '!rounded-tr-xl !rounded-br-xl' : ''}
              ${isActive ? activeStyles : inactiveStyles}
            `}
          >
            {dept}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}