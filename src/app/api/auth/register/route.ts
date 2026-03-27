import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, email, password, nickname, phone, role, businessNumber, businessName, representative, marketing } = body;

  // 중복 체크
  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });
  if (existing) {
    return NextResponse.json({ error: "이미 사용 중인 아이디 또는 이메일입니다." }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      nickname,
      phone,
      role: role || "USER",
      businessNumber,
      businessName,
      representative,
      marketing: marketing || false,
    },
  });

  return NextResponse.json({
    id: user.id,
    username: user.username,
    email: user.email,
    nickname: user.nickname,
    role: user.role,
  }, { status: 201 });
}
