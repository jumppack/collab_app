import { useState, useContext, useCallback } from 'react';
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

      // TODO: Practice Task - Add authorization header
      // If a JWT token exists in the context, inject it into the headers object
      // in the format: 'Authorization': `Bearer ${token}`
      
      // Partial code structure:
      if (token) {
        // Inject token header here...
      }

      const fetchOptions = {
        ...options,
        headers,
      };

      const response = await fetch(url, fetchOptions);
      
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = { message: await response.text() };
      }

      // TODO: Practice Task - Handle non-OK responses
      // 1. If response.ok is false, construct and throw an Error object.
      // 2. Extract the error message from responseData.error?.message or responseData.message, or default to a status message.
      // 3. Attach responseData.error?.details to errorObj.details so validation or schema errors can be displayed.
      
      // Partial code structure:
      if (!response.ok) {
        const errorMessage = 'Request failed'; // Replace this with dynamic extraction
        const errorObj = new Error(errorMessage);
        // Throw the errorObj here...
      }

      setData(responseData);
      return responseData;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { data, loading, error, request, setError };
};
