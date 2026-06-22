import { useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export const useApi = () => {
  const auth = useContext(AuthContext);
  const token = auth?.token;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Handle JSON-stringified body or object body to make it compatible with axios data
      let requestData = options.body;
      if (typeof options.body === 'string') {
        try {
          requestData = JSON.parse(options.body);
        } catch (e) {
          // Leave as is if parsing fails
        }
      }

      const response = await axios({
        url,
        method: options.method || 'GET',
        headers,
        data: requestData,
        ...options,
      });

      const responseData = response.data;
      setData(responseData);
      return responseData;
    } catch (err) {
      let errorMessage = 'Something went wrong';
      let errorDetails = null;

      if (err.response) {
        // Server responded with non-2xx status code
        const responseData = err.response.data;
        errorMessage = responseData?.error?.message || responseData?.message || `Request failed with status ${err.response.status}`;
        errorDetails = responseData?.error?.details || null;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response received from server';
      } else {
        errorMessage = err.message;
      }

      const errorObj = new Error(errorMessage);
      errorObj.details = errorDetails;
      setError(errorMessage);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { data, loading, error, request, setError };
};
