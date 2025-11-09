import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        name: name ?? null,
        password: passwordHash,
      }
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Signup error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
