import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/venues/:id/price
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = await prisma.priceItem.findMany({
    where: { venueId: id },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json(items);
}

// POST /api/venues/:id/price
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const item = await prisma.priceItem.create({
    data: {
      venueId: id,
      category: body.category,
      name: body.name,
      price: body.price,
      unit: body.unit,
      description: body.description,
      sortOrder: body.sortOrder || 0,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
