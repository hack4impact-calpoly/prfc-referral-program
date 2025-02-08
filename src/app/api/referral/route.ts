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

// To use whenever you fetch something from the db and want to return it
// Resolves the error "TypeError: Do not know how to serialize a BigInt"
function bigIntReplacer(key: string, value: any) {
  return typeof value === "bigint" ? value.toString() : value;
}

export async function GET(req: NextRequest) {
  try {
    // Fetch all referrals from the referral table
    const referrals = await prisma.referral.findMany();

    return NextResponse.json(JSON.parse(JSON.stringify(referrals, bigIntReplacer)), { status: 200 });
  } catch (err) {
    console.error("Error fetching referrals:", err);
    return NextResponse.json({ message: "Error fetching referrals." }, { status: 500 });
  }
}
