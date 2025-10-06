// Email validation utility - accepts any valid email domain
export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const validateEmail = (email) => {
  if (!email) return { isValid: false, message: 'Email is required' };
  
  if (!EMAIL_REGEX.test(email)) {
    return { 
      isValid: false, 
      message: 'Please enter a valid email address' 
    };
  }
  
  return { isValid: true, message: '' };
};

// Keep the old function name for backward compatibility
export const validateGLBITMEmail = validateEmail;

export const isGLBITMEmail = (email) => {
  return EMAIL_REGEX.test(email);
};
