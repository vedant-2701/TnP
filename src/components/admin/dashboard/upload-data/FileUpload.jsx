import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileSpreadsheet, UploadCloud, X, Check, AlertCircle, Loader2, Download } from 'lucide-react';
import { excelUpload } from '../../../../services/fileUpload';
import { Link } from 'react-router-dom';

export default function FileUpload() {
  const [uploadState, setUploadState] = useState({
    status: 'idle',
    progress: 0,
    message: ''
  });
  const [file, setFile] = useState(null);

  const uploadFile = async (file) => {
    setUploadState({
      status: 'uploading',
      progress: 0,
      message: 'Uploading file...'
    });

    const result = await excelUpload(file, (progress) => {
      setUploadState(prev => ({
        ...prev,
        progress
      }));
    });

    setUploadState({
      status: result.success ? 'success' : 'error',
      progress: result.success ? 100 : 0,
      message: result.message
    });
  };

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    multiple: false
  });

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setUploadState({
      status: 'idle',
      progress: 0,
      message: ''
    });
  };

  const getStatusIcon = () => {
    switch (uploadState.status) {
      case 'uploading':
        return <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />;
      case 'success':
        return <Check className="w-8 h-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      default:
        return isDragActive ? 
          <UploadCloud className="w-8 h-8 text-blue-500 animate-bounce" /> : 
          <FileSpreadsheet className="w-8 h-8 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (uploadState.status) {
      case 'uploading':
        return 'border-blue-500/50 bg-blue-50';
      case 'success':
        return 'border-green-500/50 bg-green-50';
      case 'error':
        return 'border-red-500/50 bg-red-50';
      default:
        return isDragActive ? 'border-blue-500 bg-blue-100/50' : 'border-gray-300 bg-white';
    }
  };

  return (
    <div className="w-full bg-gray-50 flex items-center justify-center p-4 mt-20">
      <div className="w-1/3">
        <div 
          {...getRootProps()} 
          className={`
            relative rounded-2xl border-2 border-dashed p-8 transition-all duration-300 ease-in-out
            ${getStatusColor()}
          `}
        >
          <input {...getInputProps()} name='file'/>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-opacity-20 mb-4"
                 style={{ backgroundColor: uploadState.status === 'idle' ? 'rgb(237 233 254)' : 'currentColor' }}>
              {getStatusIcon()}
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
              {uploadState.status === 'idle' ? (
                isDragActive ? "Drop your Excel file here!" : "Upload Student Data"
              ) : (
                uploadState.message
              )}
            </h3>

            {uploadState.status === 'idle' && !file && (
              <>
                <p className="mt-2 text-gray-600">
                  Drop your <span className="text-blue-500">.xlsx</span> or{' '}
                  <span class="text-blue-500">.xls</span> file here
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  or{' '}
                  <span className="text-blue-500 hover:text-blue-600 cursor-pointer">
                    browse files
                  </span>
                </p>
              </>
            )}

            {uploadState.status === 'uploading' && (
              <div className="mt-4 w-full bg-blue-100 rounded-full h-2.5">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {file && uploadState.status === 'idle' && (
          <div className="mt-4 bg-gray-50 rounded-lg p-4 flex items-center justify-between animate-[slideUp_0.3s_ease-in-out]">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Buttons Container */}
        {uploadState.status === 'idle' && (
          <div className="mt-4 flex space-x-4">
            {file && (
              <button
                onClick={() => uploadFile(file)}
                className="flex-1 bg-gradient-to-b from-blue-300 to-blue-600 !text-white !rounded-xl !shadow-md !inset-shadow-sm !inset-shadow-blue-500/50 !px-4 !py-3 text-sm font-medium transition-all duration-200 ease-in-out hover:bg-blue-500 hover:cursor-pointer flex items-center justify-center space-x-2"
              >
                <UploadCloud className="w-5 h-5" />
                <span>Upload Student Data</span>
              </button>
            )}
            <Link to="/Format.xlsx" target="_blank" download
              className="flex-1 bg-gradient-to-b from-blue-300 to-blue-600 !text-white !rounded-xl !shadow-md !inset-shadow-sm !inset-shadow-blue-500/50 !px-4 !py-3 text-sm font-medium transition-all duration-200 ease-in-out hover:bg-blue-500 hover:cursor-pointer flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Format</span>
            </Link>
            
          </div>
        )}

        {uploadState.status === 'error' && (
          <button
            onClick={() => setUploadState({ status: 'idle', progress: 0, message: '' })}
            className="mt-4 w-full bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-300 animate-[fadeIn_0.3s_ease-in-out]"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}