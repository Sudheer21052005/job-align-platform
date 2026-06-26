// hooks/useForm.js
import { useState } from 'react';

const useForm = (initialValues, validateForm = null) => {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});

  // Handle text inputs
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value === undefined ? '' : value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: files[0], // Assumes single file upload
    }));
  };

  // Safe setter to ensure no undefined values
  const safeSetValues = (newValues) => {
    const sanitizedValues = Object.entries(newValues).reduce((acc, [key, value]) => {
      acc[key] = value === undefined ? '' : value;
      return acc;
    }, {});
    setValues(sanitizedValues);
  };

  // Handles form submission and validation
  const handleSubmit = (callback) => (event) => {
    event.preventDefault();
    let isValid = true;

    // Only call the validateForm function if it is indeed a function.
    if (typeof validateForm === 'function') {
      const validationErrors = validateForm(values);
      setErrors(validationErrors);
      isValid = Object.keys(validationErrors).length === 0;
    }

    if (isValid) {
      callback();
    }
  };

  // Resets form values and errors
  const resetForm = () => {
    safeSetValues(initialValues || {});
    setErrors({});
  };

  return { 
    values, 
    errors, 
    handleChange, 
    handleFileChange, 
    handleSubmit, 
    resetForm,
    setValues: safeSetValues,
  };
};

export default useForm;
