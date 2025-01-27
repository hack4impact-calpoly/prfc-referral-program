import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resp } = body;
    const newReferral = await prisma.referralprogram.create({
      data: {},
    });
    return NextResponse.json(newReferral, { status: 201 });
  } catch (err) {
    console.error("Error creating referral:", err); // Log the error
    return NextResponse.json({ message: "Error creating referral." }, { status: 500 });
  }
}
