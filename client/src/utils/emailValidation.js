// Email validation utility for GLBITM domain restriction
export const GLBITM_EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@glbitm\.ac\.in$/i;

export const validateGLBITMEmail = (email) => {
  if (!email) return { isValid: false, message: 'Email is required' };
  
  if (!GLBITM_EMAIL_REGEX.test(email)) {
    return { 
      isValid: false, 
      message: 'Please use your college email ending with @glbitm.ac.in' 
    };
  }
  
  return { isValid: true, message: '' };
};

export const isGLBITMEmail = (email) => {
  return GLBITM_EMAIL_REGEX.test(email);
};
