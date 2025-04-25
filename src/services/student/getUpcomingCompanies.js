import { api } from "../../helper/createApi";

export const getUpcomingCompanies = async () => {
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
