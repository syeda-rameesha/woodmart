// src/app/api/contact/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // for now just log — later: send email, save to DB, etc.
    console.log("Contact form submission:", body);

    // TODO: validate body.name/body.email/body.message before accepting
    return NextResponse.json({ ok: true, message: "Received" }, { status: 200 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ ok: false, message: "Failed" }, { status: 500 });
  }
}