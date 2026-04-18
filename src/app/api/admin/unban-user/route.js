import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { transporter } from "@/lib/mailer";

export async function POST(request) {
    try {
        const { userId, name, email } = await request.json();

        const user = await prisma.user.update({
            where: { id: userId },
            data: { isBanned: false }
        });

        if (user) {
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: `Message from Dealtous Admin: Your Account Access Has Been Restored`,
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    
                    <p>Dear ${name},</p>

                    <p>
                        We’re pleased to inform you that your account on <strong>Dealtous</strong> has been 
                        <strong style="color: #28a745;">restored</strong> and is now fully accessible.
                    </p>

                    <p>
                        After reviewing your account status, the restriction has been lifted, and you may now resume using all platform features, including browsing, buying, selling, and managing your listings.
                    </p>

                    <p>
                        We encourage you to review our platform guidelines to ensure a smooth and uninterrupted experience going forward.
                    </p>

                    <p>
                        If you have any questions or need further assistance, feel free to contact our support team at 
                        <a href="mailto:support@dealtous.com">support@dealtous.com</a>.
                    </p>

                    <br/>

                    <p>
                        Welcome back, and thank you for your cooperation.
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

            return NextResponse.json({ message: "User access restored and notification sent." });
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