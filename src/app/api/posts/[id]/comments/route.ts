import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const comment = await prisma.comment.create({
    data: {
      postId: id,
      authorId: body.authorId,
      content: body.content,
      parentId: body.parentId,
    },
  });

  await prisma.post.update({ where: { id }, data: { commentCount: { increment: 1 } } });

  return NextResponse.json(comment, { status: 201 });
}
