import prisma from "../../../../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {

  const { email, password } = await req.json();

  const admin = await prisma.admin.findUnique({
    where: { email }
  });

  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  const valid = await bcrypt.compare(password, admin.password);

  if (!valid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = jwt.sign(
    {
      adminId: admin.id,
      role: "ADMIN"
    },
    process.env.NEXTAUTH_SECRET,
    { expiresIn: "7d" }
  );

  return NextResponse.json({
    token,
    admin: {
      id: admin.id,
      email: admin.email
    }
  });
}
