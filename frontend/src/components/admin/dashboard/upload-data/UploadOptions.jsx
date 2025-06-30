import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { Link} from 'react-router-dom';
import { useState } from 'react';

export default function UploadOptions() {
    const [activeBtn, setActiveBtn] = useState('upload-students');
    const firstButtonStyles = `!rounded-tl-xl !rounded-bl-xl`;
    const lastButtonStyles = `!rounded-tr-xl !rounded-br-xl`;

    const baseStyles = `!shadow-md !inset-shadow-sm !inset-shadow-blue-500/50 !px-4 !py-3 text-sm font-medium transition-all duration-200 ease-in-out hover:bg-gray-200`;

    const activeStyles = `bg-gradient-to-b from-blue-300 to-blue-600 !text-white`;
    const inactiveStyles = `text-black`;

    const handleButtonClick = (button) => {
        setActiveBtn(button);
    };

    return (
        <div>
            <ButtonGroup variant="outlined" aria-label="Loading button group">
                <Button
                    component={Link}
                    to="/dashboard/upload/upload-students"
                    onClick={() => handleButtonClick('upload-students')}
                    className={`${baseStyles} ${firstButtonStyles}
                        ${activeBtn === 'upload-students' ? `${activeStyles}` : `${inactiveStyles}`}
                    `}
                >
                    Upload Bulk Data
                </Button>
                <Button
                    component={Link}
                    to="/dashboard/upload/upload-student"
                    onClick={() => handleButtonClick('upload-student')}
                    className={`${baseStyles} ${lastButtonStyles}
                        ${activeBtn === 'upload-student' ? `${activeStyles}` : `${inactiveStyles}`}
                    `}
                >
                    Upload Single Data
                </Button>
            </ButtonGroup>
        </div>
    );
}