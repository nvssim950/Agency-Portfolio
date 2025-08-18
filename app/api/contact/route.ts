import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, token } = await request.json();

    // 🔹 Verify Turnstile token
    if (!token) {
      return NextResponse.json({ error: 'Verification required' }, { status: 400 });
    }

    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
      }),
    });

    const outcome = await verifyRes.json();

    if (!outcome.success) {
      return NextResponse.json({ error: 'Failed human verification' }, { status: 400 });
    }

    // ✅ Existing validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    // Nodemailer setup (unchanged)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: "its.nvsagency@gmail.com",
      subject: `Contact Form: ${subject}`,
      html: `
        <div>
          <h2>New Contact Form Message</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email sending failed:', error);
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}
