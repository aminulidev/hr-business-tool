import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { CONTACT_EMAIL } from '@/lib/calculator-meta';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send the email
    // NOTE: Using 'onboarding@resend.dev' as the 'from' address works for testing.
    // To use your own domain, you must verify it in the Resend dashboard.
    const { data, error } = await resend.emails.send({
      from: 'QuickBizCalc <onboarding@resend.dev>',
      to: CONTACT_EMAIL, // Updated to verified Resend email
      subject: `[Contact Form] ${subject}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
          <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">New Contact Submission</h2>
          <div style="margin-top: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 4px; border-left: 4px solid #cbd5e1;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; pt-10;">
            Submitted via QuickBizCalc Contact Form
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Contact API Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
