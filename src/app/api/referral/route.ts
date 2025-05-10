import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/db";
import nodemailer from "nodemailer";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body from the request
    const body = await req.json();

    // Destructure required parameters from the request body
    const { member_name, member_email, prospects, referral_code } = body;
    console.log(body);
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

    const emailSent = await sendEmail(prospects, referral_code, member_name);
    if (!emailSent) {
      return NextResponse.json({ message: "Failed to send email." }, { status: 500 });
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

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(prospects: any, ref: any, member: any) {
  let emailsSent = true;
  const emailImgPath = path.join(process.cwd(), "public", "assets", "paso-coop.jpeg");

  for (const prospect of prospects) {
    // console.log(prospect.prospect_email);
    const mail = {
      from: process.env.FROM_EMAIL,
      to: prospect.prospect_email,
      subject: "You've Been Invited!",
      html: `<div style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    
    
    <!--Header with logo image-->
    <div style="text-align: center;">
      <img src="cid:pasoLogo" alt="THE PASO FOOD CO-OP" style="max-width: 100%;">
    </div>
      
    <! Main content >
    <div style="padding: 20px;">
      <p>Hello ${prospect.prospect_name},</p>
      
      <p>We're excited to let you know that <strong>${member}</strong>, thinks you'd love being a part of the Paso Robles Food Co-op!</p>
      
      <p>At the Co-op, we're all about building a stronger community by connecting members to fresh, healthy, and locally-sourced food. As a member owner, you'll enjoy:</p>
      
      <ul style="padding-left: 10px;">
        <li style="margin-bottom: 8px;">Supporting local farmers and food producers 🌱</li>
        <li style="margin-bottom: 8px;">A say in how the Co-op operates (yes, you're an owner!) 🗳️</li>
        <li style="margin-bottom: 8px;">Exclusive discounts and special events 🎉</li>
      </ul>
      
      <p>It's easy to join the Co-op and start making an impact in our community! Just click the link below to complete your membership registration:</p>
      
    <p>
        <span style="font-weight: bold;">👉 <a href="https://www.pasoroblescoop.com" style="color: black; text-decoration: none;">Join Now</a></span>
      </p>
      <p>Your unique referral code is <strong>${ref}</strong>—be sure to confirm/enter it during registration.</p>
      
      <p>Feel free to reach out if you have any questions or want to learn more about what makes the Paso Robles Food Co-op special. Our monthly meeting is every 4<sup>th</sup> Wednesday at 6pm. All details and info at our website: <a href="www.pasofoodcooperative.com" style="color: #333; text-decoration: underline;">www.pasofoodcooperative.com</a></p>
      
      <p>Looking forward to welcoming you into our growing Co-op family!</p>
      
      <p>Warm regards,<br>
      ${member} and The Paso Robles Food Co-op Member Owners</p>
      
      <! Contact Info >
      <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
        <p style="margin: 5px 0;">
          📧 <a href="mailto:info@pasofoodcooperative.com" style="color: #333; text-decoration: none;">info@pasofoodcooperative.com</a>
        </p>
        <p style="margin: 5px 0;">
          🌐 <a href="www.pasofoodcooperative.com" style="color: #333; text-decoration: none;">www.pasofoodcooperative.com</a>
        </p>
      </div>
    </div>
    </div>`,
      attachments: [
        {
          filename: "paso-coop.jpeg", // Name of the file as it will appear in the email
          path: emailImgPath, // Path relative to your project root
          cid: "pasoLogo", // Content ID referenced in the HTML img src
        },
      ],
    };

    try {
      const sendAttempt = await transport.sendMail(mail);
      console.log("Email sent successfully: ", sendAttempt.response);
    } catch (error) {
      console.error("Error sending email: ", error);
      return false;
    }
  }
  return emailsSent;
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
