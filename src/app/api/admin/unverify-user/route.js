import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { transporter } from "@/lib/mailer";

export async function POST(request) {
    try {
        const { userId, name, email } = await request.json();

        const user = await prisma.user.update({
            where: { id: userId },
            data: { isVerified: false }
        });

        if (user) {
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: "Dealtous: Your Verification Status Has Been Updated",
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            
                        <p>Dear ${name},</p>

                    <p>
                        We would like to inform you that your account verification status on 
                        <strong>Dealtous</strong> has been <strong style="color: #dc3545;">removed</strong>.
                    </p>

                    <p>
                        Your account remains active; however, you will no longer display the verified badge or associated trust indicators on the platform.
                    </p>

                    <p>
                        If you believe this change was made in error or would like to request verification again, please contact our support team.
                    </p>

                    <p>
                If you have any questions or need assistance, feel free to contact us at 
                <a href="mailto:support@dealtous.com">support@dealtous.com</a>.
            </p>

            <br/>

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
                `
            }

            await transporter.sendMail(mailOptions);

            return NextResponse.json({ message: "User unverified and notification sent." }, { status: 200 });
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