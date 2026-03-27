import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { nickname: true, profileImage: true } },
      comments: {
        include: { author: { select: { nickname: true, profileImage: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.post.update({ where: { id }, data: { views: { increment: 1 } } });

  return NextResponse.json(post);
}
