import { NextResponse, NextRequest } from "next/server";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL || "https://dev.dealtous.com/backend/graphql/";

export async function POST(req = NextRequest) {
  const body = await req.text();

  const upstream = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const text = await upstream.text();

  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
  });
}
