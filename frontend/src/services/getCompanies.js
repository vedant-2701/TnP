import { api } from "../helper/createApi";

export const getAllCompanies = async () => {
    try {
        const response = await api.get('/get-companies');
        // console.log(response); // Uncomment for debugging
        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Companies fetched successfully!'
        };
    } catch (error) {
        // console.log(error); // Uncomment for debugging
        return {
            success: false,
            message: error.response?.data?.message || 'Error fetching companies'
        };
    }
};

export const getCompanyById = async (id) => {
    try {
        const response = await api.get(`/getCompany/${id}`);
        // console.log(response); // Uncomment for debugging
        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Company fetched successfully!'
        };
    } catch (error) {
        // console.log(error); // Uncomment for debugging
        return {
            success: false,
            message: error.response?.data?.message || 'Error fetching company'
        };
    }
}