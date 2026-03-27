import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/venues/:id
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const venue = await prisma.venue.findUnique({
    where: { id },
    include: {
      menuItems: { orderBy: { sortOrder: "asc" } },
      priceItems: { orderBy: { sortOrder: "asc" } },
      reviews: { orderBy: { createdAt: "desc" }, take: 20 },
      feedItems: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!venue) {
    return NextResponse.json({ error: "Venue not found" }, { status: 404 });
  }

  // 조회수 증가
  await prisma.venue.update({ where: { id }, data: { viewCount: { increment: 1 } } });

  return NextResponse.json(venue);
}

// PATCH /api/venues/:id
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const venue = await prisma.venue.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(venue);
}

// DELETE /api/venues/:id
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.venue.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
