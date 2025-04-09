import axios from 'axios';
import { getToken } from './api';
import { api } from '../helper/createApi';


export const excelUpload = async (
  file,
  onProgress
) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log(getToken());
    const response = await api.post('/upload-students', formData, {
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