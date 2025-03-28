"use client";
import { useState } from "react";
import { Label } from "../../../ui/form/Label";
import { Input } from "../../../ui/form/Input";
import { cn } from "../../../../lib/utils";
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { getToken } from '../../../../services/api';

export function SingleUserUpload() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [graduationYear, setGraduationYear] = useState("");
    const [department, setDepartment] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Construct data from state instead of FormData
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("graduationYear", graduationYear);
        formData.append("department", department);
        const data = formData.toString();

        console.log(data);
        console.log('Token:', getToken());

        const api = axios.create({
            baseURL: "http://localhost:8080",
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        try {
            const response = await api.post('/tnp/admin/upload-student', data);
            console.log('Success:', response.data);
            // Optionally reset form after success
            setUsername("");
            setPassword("");
            setGraduationYear("");
            setDepartment("");
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGraduationYearInput = (e) => {
        const value = e.target.value;
        if (/^\d{0,10}$/.test(value)) {
            setGraduationYear(value);
        }
    };

    return (
        <div className="mx-auto w-full max-w-md ">
            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-8">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                        id="username" 
                        name="username" // Ensure name attribute matches backend expectation
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
                    <Input 
                        id="graduationYear" 
                        name="graduationYear" 
                        placeholder="2000" 
                        type="text" 
                        value={graduationYear} 
                        onChange={handleGraduationYearInput} 
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-8">
                    <Label htmlFor="department">Department</Label>
                    <Input 
                        id="department" 
                        name="department" 
                        placeholder="CSE" 
                        type="text" 
                        value={department} 
                        onChange={(e) => setDepartment(e.target.value)} 
                    />
                </LabelInputContainer>

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                    type="submit" 
                    disabled={isLoading}
                >
                    {isLoading ? 'Submitting...' : 'Submit'}
                    <BottomGradient />
                    <BottomGradient />
                    <BottomGradient />
                </button>
            </form>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="absolute inset-x-50 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({ children, className }) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};