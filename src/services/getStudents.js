import { api } from "../helper/createApi";

export const getDepartment = async () => {
    try {
        const response = await api.get('/getDepartment');
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
        const response = await api.get('/getAllStudents');
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
        const response = await api.get(`/getStudent/${studentId}`);
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
        // const response = await api.get(`/getStudents?department=${deptCode}`);
        const response = await api.get(`/getStudentsByDepartment/${deptCode}`);
        console.log(response);
        console.log(deptCode);
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
        // const response = await api.get(`/getStudents?department=${deptCode}`);
        console.log(deptCode);
        const response = await api.get(`/getStudentByDepartmentAndId/${deptCode}/${studentId}`);
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