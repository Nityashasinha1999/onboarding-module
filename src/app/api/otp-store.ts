// In-memory storage for OTPs (this will be cleared on server restart)
const otpStore: { [key: string]: { otp: string; timestamp: number } } = {};

// Get OTP for email
export const getOTP = (email: string) => {
  return otpStore[email];
};

// Set OTP for email
export const setOTP = (email: string, otp: string) => {
  otpStore[email] = {
    otp,
    timestamp: Date.now()
  };
};

// Delete OTP for email
export const deleteOTP = (email: string) => {
  delete otpStore[email];
}; 