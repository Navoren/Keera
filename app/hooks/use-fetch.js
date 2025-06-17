import { useState, useCallback } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset function to clear state
  const reset = useCallback(() => {
    setData(undefined);
    setError(null);
    setLoading(false);
  }, []);

  // Stable fetch function
  const fn = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    setData(undefined); // Reset data on new call
    
    try {
      const response = await cb(...args);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      toast.error(err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cb]);

  return { 
    data, 
    loading, 
    error, 
    fn, 
    reset, // Expose reset function
    setData 
  };
};

export default useFetch;