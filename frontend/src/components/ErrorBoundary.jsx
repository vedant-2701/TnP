import React, { useState } from 'react';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = (error) => {
    setHasError(true);
  };

  const handleCatch = (error, errorInfo) => {
    console.error('Uncaught error:', error, errorInfo);
  };

  const resetError = () => {
    setHasError(false);
  };

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops, something went wrong!</h2>
          <p className="text-gray-600 mb-4">We're sorry, but there was an error loading this page.</p>
          <button
            onClick={resetError}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-black/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  try {
    return <>{children}</>;
  } catch (error) {
    handleError(error);
    handleCatch(error, { componentStack: '' });
    return null;
  }
};

export default ErrorBoundary;