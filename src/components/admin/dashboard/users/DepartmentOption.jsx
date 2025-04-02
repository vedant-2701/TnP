import React, { useState } from "react";
import { ButtonGroup, Button } from '@mui/material';

export default function DepartmentOpt() {
  const [activeBtn, setActiveBtn] = useState('cse'); // Default active button set to 'cse'

  const handleButtonClick = (btnName) => {
    setActiveBtn(btnName); // Update active button state without navigation
  };

  return (
    <ButtonGroup variant="outlined" aria-label="Department options button group" className="mb-6">
      <Button
        onClick={() => handleButtonClick('cse')}
        className={`!rounded-tl-xl !rounded-bl-xl !shadow-md !inset-shadow-sm !inset-shadow-blue-500/50
          !px-4 !py-3 text-sm font-medium transition-all duration-200 ease-in-out
          ${activeBtn === 'cse' ? 'bg-gradient-to-b from-blue-300 to-blue-600 !text-white' : 'bg-white text-black'}
          hover:bg-gray-200`}
      >
        CSE Department
      </Button>
      <Button
        onClick={() => handleButtonClick('it')}
        className={`!shadow-md !inset-shadow-sm !inset-shadow-blue-500/50
          !px-4 !py-3 text-sm font-medium transition-all duration-200 ease-in-out
          ${activeBtn === 'it' ? 'bg-gradient-to-b from-blue-300 to-blue-600 !text-white' : 'bg-white text-black'}
          hover:bg-gray-200`}
      >
        IT Department
      </Button>
      <Button
        onClick={() => handleButtonClick('ece')}
        className={`!shadow-md !inset-shadow-sm !inset-shadow-blue-500/50
          !px-4 !py-3 text-sm font-medium transition-all duration-200 ease-in-out
          ${activeBtn === 'ece' ? 'bg-gradient-to-b from-blue-300 to-blue-600 !text-white' : 'bg-white text-black'}
          hover:bg-gray-200`}
      >
        ECE Department
      </Button>
      <Button
        onClick={() => handleButtonClick('mech')}
        className={`!shadow-md !inset-shadow-sm !inset-shadow-blue-500/50
          !px-4 !py-3 text-sm font-medium transition-all duration-200 ease-in-out
          ${activeBtn === 'mech' ? 'bg-gradient-to-b from-blue-300 to-blue-600 !text-white' : 'bg-white text-black'}
          hover:bg-gray-200`}
      >
        MECH Department
      </Button>
      <Button
        onClick={() => handleButtonClick('civil')}
        className={`!rounded-tr-xl !rounded-br-xl !shadow-md !inset-shadow-sm !inset-shadow-blue-500/50
          !px-4 !py-3 text-sm font-medium transition-all duration-200 ease-in-out
          ${activeBtn === 'civil' ? 'bg-gradient-to-b from-blue-300 to-blue-600 !text-white' : 'bg-white text-black'}
          hover:bg-gray-200`}
      >
        CIVIL Department
      </Button>
    </ButtonGroup>
  );
}
