// app/api/waitlist/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; type?: string };
    const { email, type } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (!type || !['homeowner', 'trader'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid type' },
        { status: 400 }
      );
    }

    // TODO: Replace with Resend API call when RESEND_API_KEY is set
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ ... });

    console.info(`Waitlist signup: ${email} (${type})`);

    return NextResponse.json({ success: true, message: 'Registered successfully' });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}