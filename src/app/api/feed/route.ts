import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/feed
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const venueCategory = searchParams.get("venueCategory");
  const type = searchParams.get("type");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (venueCategory) {
    where.venue = { category: venueCategory };
  }

  const [items, total] = await Promise.all([
    prisma.feedItem.findMany({
      where,
      include: { venue: { select: { name: true, category: true, categorySlug: true, phone: true, address: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.feedItem.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, limit });
}

// POST /api/feed
export async function POST(request: NextRequest) {
  const body = await request.json();

  const item = await prisma.feedItem.create({
    data: {
      venueId: body.venueId,
      authorId: body.authorId,
      type: body.type,
      content: body.content,
      tags: body.tags || [],
      isLive: body.isLive ?? true,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
