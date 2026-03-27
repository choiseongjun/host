import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/venues/:id/menu
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = await prisma.menuItem.findMany({
    where: { venueId: id },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json(items);
}

// POST /api/venues/:id/menu
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const item = await prisma.menuItem.create({
    data: {
      venueId: id,
      category: body.category,
      name: body.name,
      price: body.price,
      description: body.description,
      image: body.image,
      isPopular: body.isPopular || false,
      isNew: body.isNew || false,
      sortOrder: body.sortOrder || 0,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
