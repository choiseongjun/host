import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/reviews?venueId=xxx
export async function GET(request: NextRequest) {
  const venueId = new URL(request.url).searchParams.get("venueId");
  if (!venueId) return NextResponse.json({ error: "venueId required" }, { status: 400 });

  const reviews = await prisma.review.findMany({
    where: { venueId },
    include: { author: { select: { nickname: true, profileImage: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

// POST /api/reviews
export async function POST(request: NextRequest) {
  const body = await request.json();

  const overall = (body.atmosphere + body.value + body.service) / 3;

  const review = await prisma.review.create({
    data: {
      venueId: body.venueId,
      authorId: body.authorId,
      content: body.content,
      atmosphere: body.atmosphere,
      value: body.value,
      service: body.service,
      overall: Math.round(overall * 10) / 10,
    },
  });

  // 업소 평점 갱신
  const agg = await prisma.review.aggregate({
    where: { venueId: body.venueId },
    _avg: { overall: true },
    _count: true,
  });

  await prisma.venue.update({
    where: { id: body.venueId },
    data: {
      rating: Math.round((agg._avg.overall || 0) * 10) / 10,
      reviewCount: agg._count,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
