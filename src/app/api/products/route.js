export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth";

import crypto from "crypto";

import { transporter } from "@/lib/mailer";

function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const vendorId = session.user.id;
    const otp = generateOTP();

    const formData = await request.formData();

    const name = formData.get("name");
    const summary = formData.get("summary");
    const price = formData.get("price");
    const currency = formData.get("currency");
    const category = formData.get("category");
    const subscribers = formData.get("subscribers");
    const engagementRate = formData.get("engagementRate");
    const language = formData.get("language");
    const postingFrequency = formData.get("postingFrequency");
    const monetizationMethods = formData.get("monetizationMethods");
    const averageViews = formData.get("averageViews");
    const files = formData.getAll("images");

    const user = await prisma.user.findUnique({
      where: {
        id: vendorId
      }
    });

    if (!name || !price || files.length === 0) {
      return NextResponse.json(
        { error: "Name, price, and images required" },
        { status: 400 }
      );
    }

    const imagePaths = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filePath = `./public/uploads/${Date.now()}-${file.name}`;

      await fs.promises.writeFile(filePath, buffer);

      imagePaths.push(filePath.replace("./public", ""));
    }

    const product = await prisma.product.create({
      data: {
        name,
        summary,
        currency,
        category,
        vendorId,
        subscribers,
        engagementRate,
        language,
        averageViews,
        monetizationMethods,
        postingFrequency,
        pincode: otp,
        price: Number(price),
        images: imagePaths,
      },
    });

    const html = `
      <div style="font-family: Arial, sans-serif; background:#f5f5f5; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:24px; border-radius:6px;">
          
          <h2 style="margin-top:0; color:#111;">New Product Pending Approval</h2>
          
          <p style="color:#555; font-size:14px;">
            A new product has been submitted and is currently <strong>Pending</strong>.
          </p>

          <p style="font-size:14px; color:#333;">
            <strong>Product:</strong> ${name} <br/>
            <strong>Vendor:</strong> ${user?.name} <br/>
            <strong>Price:</strong> ${currency} ${price} <br />
            <strong>Summary:</strong> ${summary} <br />
            <strong>Language:</strong> ${language} <br />
            <strong>Subscribers:</strong> ${subscribers} <br />
            <strong>Engagement Rate:</strong> ${engagementRate} <br />
            <strong>Posting Frequency:</strong> ${postingFrequency} <br />
            <strong>Average Views:</strong> ${averageViews} <br />
            <strong>Monetization Methods:</strong> ${monetizationMethods} <br />
          </p>

          <p style="font-size:14px; color:#333;">This Telegram channel is being verified for sale on dealtous.com.<br /> 
            <strong>Code: ${otp}</strong>
          </p>

          <div style="margin:20px 0;">
            <a href=${`${process.env.NEXTAUTH_URL}/admin/products`}
              style="background:#2563eb; color:#fff; padding:10px 18px; text-decoration:none; border-radius:4px; font-size:14px;">
              Review Product
            </a>
          </div>

          <p style="font-size:12px; color:#888;">
            Please review and take appropriate action from the admin dashboard.
          </p>

        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Dealtous" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Product Awaiting Approval",
      html,
    });

    return NextResponse.json(
      {
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
