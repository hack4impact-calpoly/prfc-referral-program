import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/db";
import nodemailer from "nodemailer";

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

    const emailSent = await sendEmail(prospects, referral_code);
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

async function sendEmail(prospects: any, ref: any) {
  const mail = {
    from: process.env.FROM_EMAIL,
    to: prospects.map((prospect: { prospect_email: any }) => prospect.prospect_email).join(", "),
    subject: "You've Been Referred!",
    text: `Hello! -nodemailer\n`,
    html: `<div style="width: 100%; font-family: 'Open Sans', sans-serif; line-height: 24px;">
      <table width="600" height="250" cellpadding="0" cellspacing="0" border="0" align="center" 
      style="background: url('https://s3-alpha-sig.figma.com/img/2a39/9c80/8f711507772922e304d1872f192aa8e3?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=tucuL9GErPu2zGk7FrJpr0VM8Qk6X5fpOEGfwO9Rd1JH~0XOJYnw4f1JrPky6dZ-NQXQyI~85-zZNbB3Hkt62cmSSrvGq~hZenP~09Wc6qzv5hjnxf3-gJwUNkaYXVJJAlVFeAc0ZADDgPSZXJ~EfRYd1D8F9OcsQOtXtGUYT~PgOTEumfQbhs7D1Vd-w~jnTHl-sdBODUF95m4OVFaIfnNXMGleIBqbJ68QbrClOdgqlEz1Pw5rbzB1c18uJYQ9uY4E3yvOJmhmlFou~sHfGrccY2wSm8Ipwo-OGCjafBMgGINUf3xRhnefezHt1NuGj7o25bz75ja48Q2h~fQpKQ__') no-repeat center center; background-size: cover; text-align: center;">
      <tr>
        <td align="center" valign="middle" style="padding: 20px;">
          <h1 style="weight: 400; font-size: 30px; margin-bottom: 50px;">Intro Message Here</h1>
          <a href="https://www.pasoroblescoop.com" style="text-decoration: none;">
            <button style="background-color: black; color: white; font-size: 18px; border: none; border-radius: 0.25cm; cursor: pointer; width: 200px; height: 50px;">
              Learn More
            </button>
          </a>
        </td>
      </tr>
      </table>
      <div style="width:550px; font-size:14px; align-items: center;">
      <p>Hello Kermit,</p>
      <br>
      <p>We're excited to let you know that your friend, ${prospects.prospect_name}, 
      thinks you'd love being a part of the Paso Robles Food Co-op!
      <br>
      At the Co-op, 
      we're all about building a stronger community by connecting members to fresh, 
      healthy, and locally-sourced food. As a member, you'll enjoy:</p>
      <ul>
      <li>Supporting local farmers and food producers &#129382;</li>
      <li>A say in how the Co-op operates (yes, you're an owner!) &#128499;</li>
      <li>Exclusive discounts and special events &#127881;</li>
      </ul>
      <p>It's easy to join the Co-op and start making an impact in our community! Just 
      click the link below to complete your membership registration:</p>
      <a style="color: black; text-decoration: none;" href="https://www.pasoroblescoop.com">&#128073; Join Now</a>
      <p>Your unique referral code is ${ref}&mdash;be sure to enter it during registration.
      <br>
      Feel free to reach out if you have any questions or want to learn more about what makes 
      the Paso Robles Food Co-op special.
      <br>
      Looking forward to welcoming you into our 
      growing Co-op family!
      <br>
      Warm regards,
      <br>&#128231;[info@pasoroblescoop.com]
      <br>&#128222;[555-555-555]
      <br>&#128187;[<a style="color: black;" href="https://www.pasoroblescoop.com">www.pasoroblescoop.com</a>]</p>
      <br>
      <h3 style="font-size: 18px;"><b>Benefits of Joining:</b></h3>
      <table width="80" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="right" style="padding-left: 50px;">
            <img src="cid:phoneImage" width="30" alt="Phone">
          </td>
        </tr>
        <tr>
          <td align="left">
            <h4 style="font-size: 16px;"><b>Blah</b></h4>
          </td>
        </tr>
      </table>     
      <p style="height: 100px;">Why pay $4 every time you need an item? As a Gold Primo member, you get unlimited
      FREE next delivery on gold eligible items.</p>
      <table width="80" cellpadding="0" cellspacing="0" border="0" style="padding-left: 30px;">
        <tr>
          <td align="right">
            <img src="cid:undoImage" width="40" alt="Phone">
          </td>
        </tr>
        <tr>
          <td align="left">
            <h4 style="font-size: 16px;"><b>Blah</b></h4>
          </td>
        </tr>
      </table>     
      <p style="height: 100px;">Get exclusive deals and save more on souq.com, only for Gold Primo customers.
      Saving extra dirhams on top of other savings? Why not!</p>
      <table width="80" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="right" style="padding-left: 50px;">
            <img src="cid:giftImage" width="30" alt="Phone">
          </td>
        </tr>
        <tr>
          <td align="left">
            <h4 style="font-size: 16px;"><b>Blah</b></h4>
          </td>
        </tr>
      </table>     
      <p style="height: 100px;">We want you to be delighted. Our Souq Gold Primo dedicated and specially trained 
      customer service team are here to help you with whatever you need. Feel the 
      luxury, feel Gold!</p>
      <table width="80" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="left">
            <h4 style="font-size: 16px;"><b>Blah</b></h4>
          </td>
        </tr>
      </table>     
      <p style="height: 200px;">Changed your mind? Now you can return your product and get full refund 
      within 30 days of delivery.</p>
      <div style="text-align: center;">
         <h3 style="font-size: 16px;"><b>More Surprises Coming Soon</b></h3>
         <p style="margin-bottom: 100px;">We won't stop surprising you here. This program is meant to give Gold Primo members benefits that never ends.
            <br>
            <br>
            <br>
            Want to learn more? Click here <a style="color: black; text-decoration: none;" href="https://www.pasoroblescoop.com">(blah blah blah)</a>
         </p>
         <a href="https://www.pasoroblescoop.com">
            <button style="width: 300px; height: 50px; border-radius: 0.25cm; background-color: black; 
            font-size: 18px; color: white;">Learn More</button>
         </a>
      </div>
      </div>
   </div>`,
    attachments: [
      {
        filename: "Phone.png",
        path: "C:/Projects/prfc-referral-program/public/Phone.png",
        cid: "phoneImage",
      },
      {
        filename: "Undo - 2.png",
        path: "C:/Projects/prfc-referral-program/public/Undo - 2.png",
        cid: "undoImage",
      },
      {
        filename: "Gift.png",
        path: "C:/Projects/prfc-referral-program/public/Gift.png",
        cid: "giftImage",
      },
    ],
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
