import { api } from "../helper/createApi";

export const applicationStatus = async () => {
    try {
        const response = await api.get('/tnp/admin/analytics/application-status');
        console.log(response);

        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Application-Status analytics fetched successfully!'
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error fetching Application-Status analytics'
        };
    }
}

export const studentsByDepartment = async () => {
    try {
        const response = await api.get('/tnp/admin/analytics/students-by-department');

        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Students-by-department analytics fetched successfully!'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error fetching Students-by-department analytics'
        };
    }
}

export const placementSuccessRate = async ()  => {
    try {
        const response = await api.get('/tnp/admin/analytics/placement-success-rate');

        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Placement-succes-rate analytics fetched successfully!'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error fetching Placement-succes-rates analytics'
        };
    }
}

export const topRecruiters = async ()  => {
    try {
        const response = await api.get('/tnp/admin/analytics/top-recruiters');

        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Top-recruiter analytics fetched successfully!'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error fetching Top-recruiter analytics'
        };
    }
}

export const recruiterApplications = async ()  => {
    try {
        const response = await api.get('/tnp/admin/analytics/recruiter-applications');

        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Recruiter-applications analytics fetched successfully!'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error fetching Recruiter-applications analytics'
        };
    }
}