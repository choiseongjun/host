import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/posts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const keyword = searchParams.get("keyword");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { content: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { author: { select: { nickname: true } } },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({ posts, total, page, limit });
}

// POST /api/posts
export async function POST(request: NextRequest) {
  const body = await request.json();

  const post = await prisma.post.create({
    data: {
      category: body.category,
      title: body.title,
      content: body.content,
      images: body.images || [],
      authorId: body.authorId,
      relatedVenueId: body.relatedVenueId,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
