import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/db";

/**
 * API Route for retrieving user by email
 * @returns {user: json}
 */
export async function GET(req: NextRequest) {
  try {
    //getting email from the request
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email not specified" }, { status: 404 });
    }

    //querying user from tblowner table using their email
    const user = await prisma.tblowner.findUnique({
      where: { owneremail: email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 500 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Error fetching table owners", err);
    return NextResponse.json("No user entries found", { status: 500 });
  }
}
