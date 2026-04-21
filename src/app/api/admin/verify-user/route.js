import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { transporter } from "@/lib/mailer";

export async function POST(request) {
    try {
        const { userId, name, email } = await request.json();

        const user = await prisma.user.update({
            where: { id: userId },
            data: { isVerified: true }
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
                        Congratulations! Your account on <strong>Dealtous</strong> has been 
                        <strong style="color: #28a745;">successfully verified</strong>.
                    </p>

                    <p>
                        Your profile will now display a verified badge, helping build trust and improve your visibility across the platform.
                    </p>

                    <p>
                        We encourage you to continue maintaining high-quality interactions and transactions to uphold this status.
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