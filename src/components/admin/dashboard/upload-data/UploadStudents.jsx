import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { Link, Routes, Route } from 'react-router-dom';
import FileUpload from './FileUpload';
import { SingleUserUpload } from './SingleUserUpload';
import { useState } from 'react';

export default function UploadStudents() {
    const [activeBtn, setActiveBtn] = useState('upload-students');

    const handleButtonClick = (button) => {
        setActiveBtn(button);
    };

    return (
        <div className="mx-auto w-full flex flex-col items-center p-4">
            <div>
                <ButtonGroup variant="outlined" aria-label="Loading button group">
                    <Button
                        component={Link}
                        to="/dashboard/upload/upload-students"
                        onClick={() => handleButtonClick('upload-students')}
                                className={`!rounded-tl-xl !rounded-bl-xl !shadow-md !inset-shadow-sm !inset-shadow-blue-500/50
                                    !px-4 !py-3 text-sm font-medium transition-all duration-200 ease-in-out
                                    ${activeBtn === 'upload-students' ? 'bg-gradient-to-b from-blue-300 to-blue-600 !text-white' : 'text-black'}
                                    hover:bg-gray-200
                                `}
                    >
                        Upload Bulk Data
                    </Button>
                    <Button
                        component={Link}
                        to="/dashboard/upload/upload-student"
                        onClick={() => handleButtonClick('upload-student')}
                        className={`!rounded-tr-xl !rounded-br-xl !shadow-md !inset-shadow-sm !inset-shadow-blue-500/50
                            !px-4 !py-3 text-sm font-medium transition-all duration-200 ease-in-out
                            ${activeBtn === 'upload-student' ? 'bg-gradient-to-b from-blue-300 to-blue-600 !text-white' : 'text-black'}
                            hover:bg-gray-200
                        `}
                    >
                        Upload Single Data
                    </Button>
                </ButtonGroup>
            </div>

            <div className="w-full">
                <Routes>
                    <Route path="/upload-students" element={<FileUpload />} />
                    <Route path="/upload-student" element={<SingleUserUpload />} />
                    <Route path="*" element={<FileUpload />} />
                </Routes>
            </div>
        </div>
    );
}