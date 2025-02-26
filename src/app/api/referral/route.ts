import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/db";
import nodemailer from "nodemailer";
import { info } from "console";

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body from the request
    //const body = await req.json();

    const t = await req.text();
    const body = JSON.parse(t);

    // Destructure required parameters from the request body
    const { member_name, member_email, prospect_name, prospect_email, referral_code } = body;

    console.log({ member_name, member_email, prospect_name, prospect_email, referral_code });
    // Validate required fields with specific error messages
    if (!member_name) {
      return NextResponse.json({ message: "Member name is required." }, { status: 400 });
    }
    if (!member_email) {
      return NextResponse.json({ message: "Member email is required." }, { status: 400 });
    }
    if (!prospect_name) {
      return NextResponse.json({ message: "Prospect name is required." }, { status: 400 });
    }
    if (!prospect_email) {
      return NextResponse.json({ message: "Prospect email is required." }, { status: 400 });
    }
    if (!referral_code) {
      return NextResponse.json({ message: "Referral code is required." }, { status: 400 });
    }

    const emailSent = await sendEmail(prospect_email, member_name);
    if (!emailSent) {
      return NextResponse.json({ message: "Failed to send email." }, { status: 500 });
    }

    console.log("trying to create new referral");
    // Create a new referral entry in the database
    const newReferral = await prisma.referral.create({
      data: {
        member_name: member_name,
        member_email: member_email,
        prospect_name: prospect_name,
        prospect_email: prospect_email,
        referral_code: prospect_email,
      },
    });

    console.log("created referral");

    // Return the created referral entry as JSON response
    return NextResponse.json(newReferral, { status: 201 });
  } catch (error) {
    console.error("Error creating referral:", error);
    return NextResponse.json({ message: "Error creating referral." }, { status: 500 });
  }
}

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(prospect: string, name: string) {
  const mail = {
    from: process.env.FROM_EMAIL,
    to: prospect,
    subject: "You've Been Referred!",
    text: `Hello! -nodemailer\n${name}`,
    html: `<p>Hello! -nodemailer</p><p>${name}</p>`,
  };

  try {
    const sendAttempt = await transport.sendMail(mail);
    console.log("Email sent successfully: ", sendAttempt.response);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
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
