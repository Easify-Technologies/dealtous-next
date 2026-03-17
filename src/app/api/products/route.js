export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth";
import { transporter } from "@/lib/mailer";

import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

function generateCode(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";
  const bytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }

  return result;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vendorId = session.user.id;
    const pincode = generateCode(16);

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
        id: vendorId,
      },
    });

    if (!name || !price || files.length === 0) {
      return NextResponse.json(
        { error: "Name, price, and images required" },
        { status: 400 },
      );
    }

    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());

        const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

        const uploadResponse = await cloudinary.uploader.upload(base64Data, {
          folder: "vendor_products",
        });

        return uploadResponse.secure_url;
      })
    );

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
        pincode,
        price: Number(price),
        images: imageUrls,
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
            <strong>Code: ${pincode}</strong>
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

    const userMessageHtml = `

      <div style="font-family: Arial, sans-serif; background:#f5f5f5; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:24px; border-radius:6px;">

          <h2 style = "margin-top:0; color:#111;" > Product Submitted Successfully</h2>

      <p style="color:#555; font-size:14px;">
        Hi ${user?.name || "there"}, your product has been successfully submitted to 
        <strong>Dealtous</strong> and is currently <strong>pending admin approval</strong>.
      </p>

      <p style="font-size:14px; color:#333;">
        <strong>Product:</strong> ${name} <br/>
        <strong>Price:</strong> ${currency} ${price} <br/>
        <strong>Summary:</strong> ${summary} <br/>
        <strong>Language:</strong> ${language} <br/>
        <strong>Subscribers:</strong> ${subscribers} <br/>
        <strong>Engagement Rate:</strong> ${engagementRate} <br/>
        <strong>Posting Frequency:</strong> ${postingFrequency} <br/>
        <strong>Average Views:</strong> ${averageViews} <br/>
        <strong>Monetization Methods:</strong> ${monetizationMethods} <br/>
      </p>

      <p style="font-size:14px; color:#333;">
        Your Telegram channel is being verified before it can be listed for sale on dealtous.com.
        Please keep this verification code safe:
        <br/>
        <strong>Code: ${pincode}</strong>
      </p>

      <div style="margin:20px 0;">
        <a href="${process.env.NEXTAUTH_URL}/user/products"
          style="background:#16a34a; color:#fff; padding:10px 18px; text-decoration:none; border-radius:4px; font-size:14px;">
          View Your Products
        </a>
      </div>

      <p style="font-size:12px; color:#888;">
        Once the product is reviewed and approved, it will become visible to buyers on the platform.
      </p>

        </div>
      </div>
      `;

    try {
      await transporter.sendMail({
        from: `"Dealtous" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "New Product Awaiting Approval",
        html,
      });

      await transporter.sendMail({
        from: `"Dealtous" <${process.env.SMTP_USER}>`,
        to: user?.email,
        subject: "Your Product Has Been Submitted and Is Pending Approval",
        html: userMessageHtml,
      });
    } catch (error) {
      console.error(error);
    }

    return NextResponse.json(
      {
        message: "Product created successfully",
        product,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
