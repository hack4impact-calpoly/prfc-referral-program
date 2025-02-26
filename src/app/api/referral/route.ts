import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/db";

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body from the request
    const body = await req.json();

    // Destructure required parameters from the request body
    const { member_name, member_email, prospects, referral_code } = body;

    // Validate required fields with specific error messages
    if (!member_name) {
      return NextResponse.json({ message: "Member name is required." }, { status: 400 });
    }
    if (!member_email) {
      return NextResponse.json({ message: "Member email is required." }, { status: 400 });
    }
    if (!referral_code) {
      return NextResponse.json({ message: "Referral code is required." }, { status: 400 });
    }

    // Check if prospects is an array before using .map()
    if (!Array.isArray(prospects) || prospects.length === 0) {
      return NextResponse.json({ message: "At least one prospect is required." }, { status: 400 });
    }

    // Loop through prospects to validate each entry
    for (let i = 0; i < prospects.length; i++) {
      const prospect = prospects[i];

      if (!prospect.prospect_name) {
        return NextResponse.json({ message: `Prospect name is required at index ${i}.` }, { status: 400 });
      }
      if (!prospect.prospect_email) {
        return NextResponse.json({ message: `Prospect email is required at index ${i}.` }, { status: 400 });
      }
    }

    // Create a new referral entry in the database
    const newReferrals = await prisma.$transaction(
      prospects.map((prospect) =>
        prisma.referral.create({
          data: {
            member_name,
            member_email,
            prospect_name: prospect.prospect_name,
            prospect_email: prospect.prospect_email,
            referral_code,
          },
        }),
      ),
    );

    // Return the created referral entry as JSON response
    return NextResponse.json({ message: "Referrals created successfully!", referrals: newReferrals }, { status: 201 });
  } catch (err) {
    console.error("Error creating referrals:", err);
    return NextResponse.json({ message: "Error creating referrals." }, { status: 500 });
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
