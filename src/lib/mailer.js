import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // prevents TLS issues
  },
  connectionTimeout: 60000,
  greetingTimeout: 60000,
  socketTimeout: 60000,
});

// verify connection
transporter.verify()
  .then(() => console.log("✅ SMTP Server is ready"))
  .catch(err => console.log("❌ SMTP Error:", err));
