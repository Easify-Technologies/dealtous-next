import { NextResponse } from "next/server";
import { transporter } from "@/lib/mailer";

export async function POST(request) {
    try {
        const { recipientName, email, subject, message } = await request.json();

        if(!subject) {
            return NextResponse.json({ error: "Subject is required" }, { status: 400 });
        }

        if(!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: `Message from Dealtous Admin: ${subject}`,
            html: `
                <p>Dear ${recipientName},</p>
                <p>${message}</p>
                <p>Best regards,<br/>Dealtous Team</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
