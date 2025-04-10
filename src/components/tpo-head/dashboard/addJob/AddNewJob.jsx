"use client";
import { useState } from "react";
import { Label } from "../../../ui/form/Label";
import { Input } from "../../../ui/form/Input"; // Existing Input component
import { Textarea } from "../../../ui/form/Textarea"; // Updated Textarea component
import { cn } from "../../../../lib/utils";
import axios from "axios";
import { getToken } from "../../../../services/api";
import { ToastContainer, toast } from "react-toastify";

export default function JobPostingForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    jobRole: "",
    jobDescription: "", // Store as string
    deadline: "", // Store as string (YYYY-MM-DD)
    companyLocation: "",
    criteria: {
      cgpa: "",
      tenth: "",
      twelfth: "",
      diploma: ""
    },
    industryType: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [deadlineError, setDeadlineError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCriteriaChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [key]: value,
      },
    }));
  };

  const handleDateChange = (e) => {
    const value = e.target.value; // Keep as string (YYYY-MM-DD)
    setFormData((prev) => ({
      ...prev,
      deadline: value,
    }));
    if (value) {
      setDeadlineError("");
    } else {
      setDeadlineError("Deadline is required!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.deadline || formData.deadline === "") {
      setDeadlineError("Deadline is required!");
      return;
    }

    setIsLoading(true);

    try {
      const deadlineDate = new Date(formData.deadline); // Convert string to Date at submission
      if (isNaN(deadlineDate.getTime())) {
        throw new Error("Invalid date format");
      }

      const response = await axios.post(
        "http://localhost:8080/api/job-postings",
        {
          ...formData,
          deadline: deadlineDate.toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Job posting created successfully!");
      setFormData({
        companyName: "",
        jobRole: "",
        jobDescription: "",
        deadline: "",
        companyLocation: "",
        criteria: {
          cgpa: "",
          tenth: "",
          twelfth: "",
          diploma: ""
        },
        industryType: "",
      });
      setDeadlineError("");
    } catch (error) {
      toast.error("Failed to create job posting: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="Enter company name"
            type="text"
            value={formData.companyName}
            onChange={handleInputChange}
            className="shadow-input h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black dark:bg-zinc-800 dark:text-white"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-8">
          <Label htmlFor="jobRole">Job Role</Label>
          <Input
            id="jobRole"
            name="jobRole"
            placeholder="Enter job role"
            type="text"
            value={formData.jobRole}
            onChange={handleInputChange}
            className="shadow-input h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black dark:bg-zinc-800 dark:text-white"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-8">
          <Label htmlFor="jobDescription">Job Description</Label>
          <Textarea
            id="jobDescription"
            name="jobDescription"
            placeholder="Enter job description"
            value={formData.jobDescription}
            onChange={handleInputChange}
            className="shadow-input w-full h-32 rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black dark:bg-zinc-800 dark:text-white resize-y"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-8">
          <Label htmlFor="deadline">
            Deadline <span className="text-red-500">*</span>
          </Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            value={formData.deadline || ""}
            onChange={handleDateChange}
            className="shadow-input h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black dark:bg-zinc-800 dark:text-white"
            required
          />
          {deadlineError && <span className="text-red-500 text-sm">{deadlineError}</span>}
        </LabelInputContainer>

        <LabelInputContainer className="mb-8">
          <Label htmlFor="companyLocation">Company Location</Label>
          <Input
            id="companyLocation"
            name="companyLocation"
            placeholder="Enter company location"
            type="text"
            value={formData.companyLocation}
            onChange={handleInputChange}
            className="shadow-input h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black dark:bg-zinc-800 dark:text-white"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-8">
          <Label>Criteria</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tenth">10th Percentage</Label>
              <Input
                id="tenth"
                placeholder="Enter 10th %"
                type="text"
                value={formData.criteria.tenth || ""}
                onChange={(e) => handleCriteriaChange("tenth", e.target.value)}
                className="shadow-input h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="twelfth">12th Percentage</Label>
              <Input
                id="twelfth"
                placeholder="Enter 12th %"
                type="text"
                value={formData.criteria.twelfth || ""}
                onChange={(e) => handleCriteriaChange("twelfth", e.target.value)}
                className="shadow-input h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="diploma">Diploma Percentage</Label>
              <Input
                id="diploma"
                placeholder="Enter Diploma %"
                type="text"
                value={formData.criteria.diploma || ""}
                onChange={(e) => handleCriteriaChange("diploma", e.target.value)}
                className="shadow-input h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="cgpa">CGPA</Label>
              <Input
                id="cgpa"
                placeholder="Enter CGPA"
                type="text"
                value={formData.criteria.cgpa || ""}
                onChange={(e) => handleCriteriaChange("cgpa", e.target.value)}
                className="shadow-input h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>
        </LabelInputContainer>

        <LabelInputContainer className="mb-8">
          <Label htmlFor="industryType">Industry Type</Label>
          <Input
            id="industryType"
            name="industryType"
            placeholder="Enter industry type"
            type="text"
            value={formData.industryType}
            onChange={handleInputChange}
            className="shadow-input h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black dark:bg-zinc-800 dark:text-white"
          />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-md disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Create Job Posting"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

const LabelInputContainer = ({ children, className }) => {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
};