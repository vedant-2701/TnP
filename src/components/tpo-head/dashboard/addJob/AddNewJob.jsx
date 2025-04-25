"use client";
import { useState, useCallback, useEffect } from "react";
import { Label } from "../../../ui/form/Label";
import { Input } from "../../../ui/form/Input"; // Existing Input component
import { Textarea } from "../../../ui/form/Textarea"; // Updated Textarea component
import { cn } from "../../../../lib/utils";
import axios from "axios";
import { getToken } from "../../../../services/api";
import { toast } from "react-toastify";
import { DatePickerWithEffect } from "../../../ui/form/DatePickerEffect";
import { Plus, X } from "lucide-react";
import { getCompanyOverview } from "../../../../utils/companyOverview";
import { api } from "../../../../helper/createApi";
import { some } from "d3";
import { useNavigate } from "react-router-dom";

const criteriaOptions = [
    { value: "gender", label: "Gender" },
    { value: "10th", label: "10th Percentage" },
    { value: "12th_diploma", label: "12th/Diploma Percentage" },
    { value: "12th", label: "12th Percentage" },
    { value: "diploma", label: "Diploma Percentage" },
    { value: "academic_year", label: "Academic Year" },
    { value: "cgpa", label: "CGPA" },
];

export default function JobPostingForm() {
    const [formData, setFormData] = useState({
        companyName: "",
        companyWebsite: "",
        jobRole: "",
        jobDescription: "",
        deadline: "",
        companyLocation: "",
        industryType: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [deadlineError, setDeadlineError] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [criteriaFields, setCriteriaFields] = useState([
        { id: crypto.randomUUID(), type: "", value: "" },
    ]);
    const [domainURL, setDomainURL] = useState(null);
    const [logoUrl, setLogoUrl] = useState("");
    const [isLogoLoading, setIsLogoLoading] = useState(false);
    const [isLogoUploading, setIsLogoUploading] = useState(false);
    const [logoUploadStatus, setLogoUploadStatus] = useState(null);
    const [companyDescription, setCompanyDescription] = useState("");

    const navigate = useNavigate();


    // Handle criteria fields
  const handleAddCriteria = () => {
    setCriteriaFields([
      ...criteriaFields,
      { id: crypto.randomUUID(), type: "", value: "" }
    ]);
  };

    const handleRemoveCriteria = (id) => {
        setCriteriaFields(criteriaFields.filter((field) => field.id !== id));
    };

    const handleCriteriaChange = (id, field, value) => {
        if (field === "value") {
            if (
                ["10th", "12th", "diploma", "12th_diploma"].includes(
                    criteriaFields.find((f) => f.id === id).type
                )
            ) {
                if (value && (isNaN(value) || value < 0 || value > 100)) {
                    toast.error(
                        "Percentage must be a number between 0 and 100"
                    );
                    return;
                }
            }
        }
        setCriteriaFields((fields) =>
            fields.map((f) => (f.id === id ? { ...f, [field]: value } : f))
        );
    };

    const getPlaceholder = (type) => {
        switch (type) {
            case "gender":
                return "Enter gender requirement";
            case "10th":
            case "12th":
            case "diploma":
                return "Enter minimum percentage";
            case "12th_diploma":
                return "Enter minimum percentage for 12th/Diploma";
            case "academic_year":
                return "Enter academic year";
            case "cgpa":
                return "Enter minimum CGPA";
            default:
                return "Select a criteria type";
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Fetch company logo and upload to backend
  const fetchAndUploadLogo = useCallback(async (url) => {
    if (!url) return;
    
    setIsLogoLoading(true);
    setLogoUploadStatus(null);
    
    try {
      // Extract domain from URL
      const domain = new URL(url).hostname.replace(/^www\./, "");
      
      // Construct Brandfetch API URL
      const brandfetchUrl = `https://cdn.brandfetch.io/${domain}/w/400/h/400?c=1idtU2qD3KfPBuO5uVJ`;
      
      // Set the URL for displaying in UI
      setLogoUrl(brandfetchUrl);
      
      // Automatically upload logo to backend
      await uploadLogoToBackend(brandfetchUrl, url);
      
    } catch (error) {
      console.error("Invalid URL or failed to fetch logo:", error);
      setLogoUrl("");
      setLogoUploadStatus("error");
    } finally {
      setIsLogoLoading(false);
    }
  }, []);

  // Upload logo to backend
  const uploadLogoToBackend = async (logoUrl, domain) => {
    if (!logoUrl) return;
    
    setIsLogoUploading(true);
    
    try {
      // Fetch the image as blob
      const response = await fetch(logoUrl);
      const blob = await response.blob();
      
      // Create form data
      const formData = new FormData();
      formData.append('logo', blob, `${domain}-logo.png`);
      formData.append('companyWebsite', domain);
      
      // Send to your backend
      const uploadResponse = await api.post('/add-logo', formData);
      
      if (uploadResponse.ok) {
        setLogoUploadStatus("success");
        // You might want to save the returned logo URL or ID from the backend
        // setFormData(prev => ({ ...prev, logoId: uploadResponse.data.logoId }));
      } else {
        setLogoUploadStatus("error");
      }
    } catch (error) {
      console.error("Failed to upload logo:", error);
      setLogoUploadStatus("error");
    } finally {
      setIsLogoUploading(false);
    }
  };

  // Debounce effect for URL changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.companyWebsite && isValidUrl(formData.companyWebsite)) {
        fetchAndUploadLogo(formData.companyWebsite);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData.companyWebsite, fetchAndUploadLogo]);

  // Validate URL format
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDate) {
            setDeadlineError("Deadline is required!");
            return;
        }

        // Validate required fields
        const requiredFields = [
            "companyWebsite",
            "companyName",
            "jobRole",
            "jobDescription",
            "companyLocation",
            "industryType",
        ];
        const missingFields = requiredFields.filter(
            (field) => !formData[field]
        );

        if (missingFields.length > 0) {
            toast.error(
                `Please fill in all required fields: ${missingFields.join(
                    ", "
                )}`
            );
            return;
        }

        // Validate criteria
        const invalidCriteria = criteriaFields.some(
            (field) => !field.type || !field.value
        );
        // if (invalidCriteria) {
        //   toast.error('Please fill in all criteria fields or remove empty ones');
        //   return;
        // }

        setIsLoading(true);

        try {
            // Transform criteria fields into the required format
            const transformedCriteria = criteriaFields.reduce((acc, field) => {
                acc[field.type] = field.value;
                return acc;
            }, {});

            // const companyOverview = await getCompanyOverview(
            //     formData.companyWebsite
            // );

            // console.log(companyOverview);
            // setCompanyDescription(companyOverview);
            // console.log(companyDescription);

            // Fetch company overview
      let companyDesc = formData.companyDescription;
      if (!companyDesc && formData.companyWebsite) {
        try {
          companyDesc = await getCompanyOverview(formData.companyWebsite);
        } catch (error) {
          console.error('Failed to fetch company overview:', error);
        }
      }

      // Prepare final form data with all required fields
      const finalFormData = {
        ...formData,
        companyDescription: companyDesc,
        deadline: selectedDate,
        criteria: Object.keys(transformedCriteria).length > 0 ? transformedCriteria : {}
      };

            setFormData({
                ...formData,
                companyDescription: companyDesc,
                deadline: selectedDate,
                criteria: invalidCriteria ? { "": "" } : transformedCriteria,
                // createdAt: new Date().toISOString(),
                // updatedAt: new Date().toISOString(),
            });

            console.log({
                ...formData,
                companyDescription: companyDesc,
                deadline: selectedDate,
                criteria: invalidCriteria ? "" : transformedCriteria,
                // createdAt: new Date().toISOString(),
                // updatedAt: new Date().toISOString(),
            });

            console.log(formData);
            console.log(finalFormData);

            const response = await api.post("/job-posting", finalFormData);

            console.log(response);

            if (response.status === 200) {
                toast.success("Job posting created successfully!");

                // Reset form
                setFormData({
                    companyName: "",
                    companyWebsite: "",
                    jobRole: "",
                    jobDescription: "",
                    deadline: "",
                    companyLocation: "",
                    industryType: "",
                });
                setSelectedDate(null);
                setCriteriaFields([
                    { id: crypto.randomUUID(), type: "", value: "" },
                ]);
                setDeadlineError("");
                setLogoUrl("");
                setLogoUploadStatus(null);
                setCompanyDescription("");
                navigate("/dashboard/job-postings")
            } else {
                toast.error("Job posting not created!");
            }
        } catch (error) {
            if (error.response) {
                toast.error(
                    `Failed to create job posting: ${error.response.data.message}`
                );
            } else if (error.request) {
                toast.error(
                    "Failed to create job posting: No response from server"
                );
            } else {
                toast.error(`Failed to create job posting: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCompanyLogo = useCallback((url) => {
        // console.log("inside f", url);
        setIsLogoLoading(true);
        try {
            // Extract domain from URL (e.g., "apple.com" from "https://www.apple.com")
            const domain = new URL(url).hostname.replace(`/^https://www./`, "");
            // Construct Brandfetch API URL
            const logoUrl = `https://cdn.brandfetch.io/${domain}/w/400/h/400?c=1idtU2qD3KfPBuO5uVJ`;
            setDomainURL(logoUrl);
        } catch (error) {
            console.error("Invalid URL or failed to fetch logo:", error);
            setDomainURL(""); // Clear logo if URL is invalid
        } finally {
            setIsLogoLoading(false);
        }
    }, []);

    // Handle input change
    const handleUrlInputChange = (e) => {
        const url = e.target.value;
        setFormData((prev) => ({
            ...prev,
            companyWebsite: url,
        }));

        console.log(formData);

        setTimeout(() => {
            if (url) {
                fetchCompanyLogo(url);
            }
        }, 3000);

        // if(url) {
        //   setTimeout(() => fetchCompanyLogo(url), 5000);
        // }
        console.log(url);
    };

    return (
        <div className="mx-auto w-full p-8">
            <h1 className="text-xl">Create Job Posting</h1>

            <form
                className="mb-8 grid grid-cols-2 gap-4 place-items-center pb-10"
                onSubmit={handleSubmit}
            >
                <div className="flex items-center my-8 col-span-2 place-self-stretch">
                    <div className="w-1/2 flex justify-center items-center">
                        <img
                            src={
                                logoUrl ||
                                "https://cdn.brandfetch.io/apple.com/w/400/h/400?c=1idtU2qD3KfPBuO5uVJ"
                            }
                            alt="Company Logo"
                            className={`w-30 h-30 rounded-full ${
                                domainURL
                                    ? "border-none"
                                    : "border border-gray-300"
                            } ${isLogoLoading ? "opacity-50" : ""}`}
                            // onError={(e) => {
                            //   e.target.onerror = null; // Prevent infinite loop
                            //   e.target.src = "https://via.placeholder.com/150"; // Placeholder image
                            // }}
                        />
                    </div>
                    <LabelInputContainer className="mb-8">
                        <Label htmlFor="companyUrl">
                            Enter company website{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="companyUrl"
                            name="companyUrl"
                            placeholder="Enter website url"
                            type="url"
                            value={formData.companyWebsite}
                            onChange={handleUrlInputChange}
                            className="shadow-input h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black dark:bg-zinc-800 dark:text-white"
                        />
                    </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-8">
                    <Label htmlFor="companyName">
                        Company Name <span className="text-red-500">*</span>
                    </Label>
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
                    <Label htmlFor="jobRole">
                        Job Role <span className="text-red-500">*</span>
                    </Label>
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

                <LabelInputContainer className="mb-8 col-span-2">
                    <Label htmlFor="jobDescription">
                        Job Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="jobDescription"
                        name="jobDescription"
                        placeholder="Enter job description"
                        value={formData.jobDescription}
                        onChange={handleInputChange}
                        className="shadow-input w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black dark:bg-zinc-800 dark:text-white"
                    />
                </LabelInputContainer>

                <LabelInputContainer className="mb-8">
                    <Label htmlFor="companyLocation">
                        Deadline <span className="text-red-500">*</span>
                    </Label>
                    <DatePickerWithEffect
                        label="Deadline"
                        value={selectedDate}
                        onChange={setSelectedDate}
                        isRequired
                        showMonthAndYearPickers
                    />
                    {deadlineError && (
                        <span className="text-red-500 text-sm">
                            {deadlineError}
                        </span>
                    )}
                </LabelInputContainer>

                <LabelInputContainer className="mb-8">
                    <Label htmlFor="companyLocation">
                        Company Location <span className="text-red-500">*</span>
                    </Label>
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
                    <div className="flex items-center justify-between mb-4">
                        <Label>Criteria</Label>
                        <button
                            type="button"
                            onClick={handleAddCriteria}
                            className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                            <Plus size={16} />
                            Add Criteria
                        </button>
                    </div>

                    <div className="space-y-3">
                        {criteriaFields.map((field, index) => (
                            <div
                                key={field.id}
                                className="flex gap-3 items-start animate-in fade-in slide-in-from-top-4 duration-300"
                            >
                                <div className="flex-1">
                                    <select
                                        value={field.type}
                                        onChange={(e) =>
                                            handleCriteriaChange(
                                                field.id,
                                                "type",
                                                e.target.value
                                            )
                                        }
                                        className="w-full h-10 rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black shadow-input transition duration-200 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600"
                                    >
                                        <option value="">
                                            Select Criteria
                                        </option>
                                        {criteriaOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                                disabled={criteriaFields.some(
                                                    (f) =>
                                                        f.id !== field.id &&
                                                        f.type === option.value
                                                )}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex-1">
                                    <Input
                                        value={field.value}
                                        onChange={(e) =>
                                            handleCriteriaChange(
                                                field.id,
                                                "value",
                                                e.target.value
                                            )
                                        }
                                        placeholder={getPlaceholder(field.type)}
                                        disabled={!field.type}
                                        className="shadow-input h-10 w-full"
                                    />
                                </div>

                                {criteriaFields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveCriteria(field.id)
                                        }
                                        className="mt-2 p-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <X size={16} />
                                        <span className="sr-only">
                                            Remove criteria
                                        </span>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </LabelInputContainer>

                <LabelInputContainer className="mt-1 mb-8">
                    <Label htmlFor="industryType" className="mb-5">
                        Industry Type <span className="text-red-500">*</span>
                    </Label>
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
                    className="group/btn relative block h-10 w-fit px-12 cursor-pointer rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-md disabled:opacity-50 col-start-2 place-self-end"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Submitting..." : "Create Job Posting"}
                </button>
            </form>
        </div>
    );
}

const LabelInputContainer = ({ children, className }) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};
