import axios from 'axios';
import { getToken } from './api';

const API_BASE_URL = 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${getToken()}`
  },
//   withCredentials: true,
});

export const excelUpload = async (
  file,
  onProgress
) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log(getToken());
    const response = await api.post('/tnp/admin/upload-students', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total ?? 0)
        );
        onProgress?.(progress);
      }
    });

    return {
      success: true,
      data: response.data,
      message: response.data.message || 'File uploaded successfully!'
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: axios.isAxiosError(error)
        ? error.response?.data?.message || 'Error uploading file'
        : 'An unexpected error occurred'
    };
  }
};