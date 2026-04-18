import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { transporter } from "@/lib/mailer";

export async function POST(request) {
    try {
        const { userId, name, email } = await request.json();

        const user = await prisma.user.update({
            where: { id: userId },
            data: { isBanned: true }
        });

        if (user) {
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: `Message from Dealtous Admin: Account Access Suspension Notice`,
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    
                    <p>Dear ${name},</p>

                    <p>
                        We regret to inform you that your account on <strong>Dealtous</strong> has been 
                        <strong style="color: #d9534f;">suspended</strong> by our administrative team due to a violation of our platform policies.
                    </p>

                    <p>
                        This decision was made after a careful review to ensure the safety, integrity, and trust of our marketplace.
                    </p>

                    <p>
                        As a result, you will no longer be able to access your account or perform any activities on the platform until further notice.
                    </p>

                    <p>
                        If you believe this action has been taken in error or would like to request a review, please contact our support team by replying to this email or reaching out at 
                        <a href="mailto:support@dealtous.com">support@dealtous.com</a>.
                    </p>

                    <p>
                        We are committed to maintaining a fair and transparent environment for all users and will carefully review any appeal submitted.
                    </p>

                    <br/>

                    <p>
                        Thank you for your understanding.
                    </p>

                    <p>
                        Best regards,<br/>
                        <strong>Dealtous Team</strong><br/>
                        <a href="https://dealtous.com" target="_blank">www.dealtous.com</a>
                    </p>

                    <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />

                    <p style="font-size: 12px; color: #777;">
                        This is an automated message from Dealtous. Please do not share your account credentials with anyone.
                    </p>

                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);

            return NextResponse.json({ message: "User has been banned and notified via email." }, { status: 200 });
        }
        else {
            return NextResponse.json({ error: "Message cannot be sent" }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}