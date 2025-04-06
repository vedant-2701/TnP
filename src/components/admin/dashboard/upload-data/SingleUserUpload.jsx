"use client";
import { useState, useEffect } from "react";
import { Label } from "../../../ui/form/Label";
import { Input } from "../../../ui/form/Input";
import { cn } from "../../../../lib/utils";
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { getToken } from '../../../../services/api';
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { useMotionTemplate, useMotionValue, motion } from "motion/react";

export default function SingleUserUpload() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [graduationYear, setGraduationYear] = useState("");
    const [department, setDepartment] = useState("");
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch departments from backend
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get("http://localhost:8080/tnp/admin/getDepartment", {
                    headers: { 'Authorization': `Bearer ${getToken()}` }
                });
                console.log(response);
                setDepartments(response.data);
            } catch (error) {
                console.error("Error fetching departments:", error);
                toast.error("Failed to load departments");
            }
        };
        fetchDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("graduationYear", graduationYear);
        formData.append("department", department);

        try {
            const response = await axios.post("http://localhost:8080/tnp/admin/upload-student", formData, {
                headers: { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            toast.success("Student uploaded successfully!");
            setUsername("");
            setPassword("");
            setGraduationYear("");
            setDepartment("");
        } catch (error) {
            toast.error("Failed to upload student: " + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    // Motion effect for select elements (same as Input component)
    const SelectWithMotion = ({ children, className }) => {
        const radius = 100; // Same radius as Input component
        const [visible, setVisible] = useState(false);
        const mouseX = useMotionValue(0);
        const mouseY = useMotionValue(0);

        const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
            const { left, top } = currentTarget.getBoundingClientRect();
            mouseX.set(clientX - left);
            mouseY.set(clientY - top);
        };

        return (
            <motion.div
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
                            #3b82f6,
                            transparent 80%
                        )
                    `,
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                className={cn("group/select rounded-lg p-[2px] transition duration-300", className)}
            >
                {children}
            </motion.div>
        );
    };

    return (
        <div className="mx-auto w-full max-w-md">
            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-8">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                        id="username" 
                        name="username" 
                        placeholder="Username" 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </LabelInputContainer>

                <LabelInputContainer className="mb-8">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input 
                            id="password" 
                            name="password" 
                            placeholder="••••••••" 
                            type={showPassword ? "text" : "password"} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </LabelInputContainer>

                <LabelInputContainer className="mb-8">
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <SelectWithMotion>
                        <div className="relative">
                            <select 
                                id="graduationYear" 
                                name="graduationYear" 
                                className={cn(
                                    "shadow-input dark:placeholder-text-neutral-600 flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/select:shadow-none placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600 appearance-none",
                                    "[&>option:first-child]:text-neutral-400 [&>option:first-child]:dark:text-neutral-600",
                                    // Conditionally apply placeholder color when the first option is selected
                                    graduationYear === "" && "text-neutral-400 dark:text-neutral-600"
                                )} 
                                value={graduationYear} 
                                onChange={(e) => setGraduationYear(e.target.value)}
                            >
                                <option value="">Select Year</option>
                                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </SelectWithMotion>
                </LabelInputContainer>

                <LabelInputContainer className="mb-8">
                    <Label htmlFor="department">Department</Label>
                    <SelectWithMotion>
                        <div className="relative">
                            <select 
                                id="department" 
                                name="department" 
                                className={cn(
                                    "shadow-input dark:placeholder-text-neutral-600 flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/select:shadow-none placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600 appearance-none",
                                    "[&>option:first-child]:text-neutral-400 [&>option:first-child]:dark:text-neutral-600",
                                    // Conditionally apply placeholder color when the first option is selected
                                    department === "" && "text-neutral-400 dark:text-neutral-600"
                                )} 
                                value={department} 
                                onChange={(e) => setDepartment(e.target.value)}
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept, index) => (
                                    <option key={index} value={dept}>{dept}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </SelectWithMotion>
                </LabelInputContainer>

                <button 
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-md" 
                    type="submit" 
                    disabled={isLoading}
                >
                    {isLoading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}

const LabelInputContainer = ({ children, className }) => {
    return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
};