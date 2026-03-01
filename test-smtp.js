import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

transporter.verify((err, success) => {
  if (err) console.log("SMTP Connection Error:", err);
  else console.log("SMTP Connected!");
});
