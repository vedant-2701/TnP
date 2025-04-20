import { api } from "../helper/createApi";

export const getDepartment = async () => {
  try {
    const response = await api.get('/getDepartment');
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Departments fetched successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error fetching departments',
    };
  }
};

export const getAllStudents = async () => {
  try {
    const response = await api.get('/getAllStudents');
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Students fetched successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error fetching students',
    };
  }
};

export const getStudentById = async (studentId) => {
  try {
    const response = await api.get(`/getStudent/${studentId}`);
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Student fetched successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error fetching student',
    };
  }
};

export const getStudentsByDepartment = async (deptCode) => {
  try {
    const response = await api.get(`/getStudentsByDepartment/${deptCode}`);
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Students fetched successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error fetching students by department',
    };
  }
};

export const getStudentByDepartmentAndId = async (deptCode, studentId) => {
  try {
    const response = await api.get(`/getStudentByDepartmentAndId/${deptCode}/${studentId}`);
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Student fetched successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error fetching student by department and ID',
    };
  }
};

export const getStudentByUsername = async (username) => {
  try {
    const response = await api.get(`/getStudent/${username}`);
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Student fetched successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error fetching student by username',
    };
  }
};