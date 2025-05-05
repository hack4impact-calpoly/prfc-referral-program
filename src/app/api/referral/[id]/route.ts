import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/db";

export async function PUT(req: NextRequest, context: { params: Promise<{ id?: string }> }) {
  try {
    const resolvedParams = await context.params; // Await the params
    if (!resolvedParams?.id) {
      return NextResponse.json({ message: "Invalid referral ID." }, { status: 400 });
    }
    const referralId = parseInt(resolvedParams.id, 10);
    if (isNaN(referralId)) {
      return NextResponse.json({ message: "Invalid referral ID." }, { status: 400 });
    }

    // Fetch the referral to check current status
    const existingReferral = await prisma.referral.findUnique({
      where: { id: referralId },
    });

    // Return an error status if the referral wasnt found
    if (!existingReferral) {
      return NextResponse.json({ message: "Referral not found." }, { status: 404 });
    }

    // Toggle the redeemed status
    const updatedReferral = await prisma.referral.update({
      where: { id: referralId },
      data: { redeemed: !existingReferral.redeemed },
    });

    return NextResponse.json({ message: "Referral updated successfully!", referral: updatedReferral }, { status: 200 });
  } catch (error) {
    console.error("Error updating referral:", error);
    return NextResponse.json({ message: "Error updating referral." }, { status: 500 });
  }
}
