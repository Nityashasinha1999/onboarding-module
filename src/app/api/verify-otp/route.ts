import { NextResponse } from 'next/server';
import { getOTP, deleteOTP } from '../otp-store';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    console.log('Verifying OTP for email:', email); // Debug log

    // Get stored OTP data
    const storedData = getOTP(email);
    console.log('Stored OTP data:', storedData); // Debug log
    console.log('Received OTP:', otp); // Debug log

    // Check if OTP exists and is not expired (5 minutes)
    if (!storedData || Date.now() - storedData.timestamp > 5 * 60 * 1000) {
      console.log('OTP expired or invalid. Time difference:', storedData ? Date.now() - storedData.timestamp : 'No stored data'); // Debug log
      return NextResponse.json(
        { error: 'OTP has expired or is invalid' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      console.log('OTP mismatch. Expected:', storedData.otp, 'Received:', otp); // Debug log
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Clear OTP after successful verification
    deleteOTP(email);

    return NextResponse.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
} 