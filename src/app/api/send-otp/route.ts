import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { setOTP } from '../otp-store';

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP
    setOTP(email, otp);

    console.log('Stored OTP for:', email); // Debug log

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Login',
      text: `Your OTP is: ${otp}. This OTP will expire in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your OTP for Login</h2>
          <p style="font-size: 16px; color: #666;">Your OTP is:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #999;">This OTP will expire in 5 minutes.</p>
        </div>
      `
    });

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
} 