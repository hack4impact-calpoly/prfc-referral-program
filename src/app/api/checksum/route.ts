import { NextRequest, NextResponse } from "next/server";
import { calculateChecksum } from "@/utils/checksum";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nm, em, ref, cs } = body;

    if (!nm || !em || !ref || !cs) {
      return NextResponse.json({ message: "Missing required parameters." }, { status: 400 });
    }

    // Clean up the name by removing spaces
    const cleanedName = nm.replace(/\s+/g, "");

    // Generate the checksum
    const generatedChecksum = calculateChecksum(`${em}${cleanedName}${ref}`);

    // Compare the generated checksum with the provided checksum
    if (generatedChecksum !== cs) {
      return NextResponse.json({ message: "Checksum mismatch." }, { status: 400 });
    }

    return NextResponse.json({ message: "Checksum validated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error validating checksum:", error);
    return NextResponse.json({ message: "Error validating checksum." }, { status: 500 });
  }
}
