import { api } from "../helper/createApi";

export const getDepartment = async () => {
    try {
        const response = await api.get('/tnp/admin/getDepartment');
        console.log(response);
        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Departments fetched successfully!'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error fetching departments'
        };
    }
}

export const getAllStudents = async () => {
    try {
        const response = await api.get('/tnp/admin/getAllStudents');
        // console.log(response);
        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Students fetched successfully!'
        };
    } catch (error) {
        // console.log(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error fetching students'
        };
    }
}

export const getStudentById = async (studentId) => {
    try {
        const response = await api.get(`/tnp/admin/getStudent/${studentId}`);
        console.log(response);
        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Student fetched successfully!'
        };
    } catch (error) {
        // console.log(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error fetching student'
        };
    }
}

export const getStudentsByDepartment = async (deptCode) => {
    try {
        // const response = await api.get(`/tnp/admin/getStudents?department=${deptCode}`);
        const response = await api.get(`tnp/admin/getStudentsByDepartment/${deptCode}`);
        console.log(response);
        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Students fetched successfully!'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error fetching students by department'
        };
    }
}

export const getStudentByDepartmentAndId = async (deptCode, studentId) => {
    try {
        // const response = await api.get(`/tnp/admin/getStudents?department=${deptCode}`);
        const response = await api.get(`tnp/admin/getStudentByDepartmentAndId/${deptCode}/${studentId}`);
        console.log(response);
        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Students fetched successfully!'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error fetching students by department'
        };
    }
}