import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/venues - 업소 목록
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const region = searchParams.get("region");
  const district = searchParams.get("district");
  const priceLevel = searchParams.get("priceLevel");
  const lateNight = searchParams.get("lateNight");
  const keyword = searchParams.get("keyword");
  const sort = searchParams.get("sort") || "rating";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = { isApproved: true };

  if (category) where.categorySlug = category;
  if (region) where.region = region;
  if (district) where.district = district;
  if (priceLevel) where.priceLevel = priceLevel;
  if (lateNight === "true") where.lateNight = true;
  if (keyword) {
    where.OR = [
      { name: { contains: keyword, mode: "insensitive" } },
      { tags: { has: keyword } },
      { description: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const orderBy =
    sort === "rating" ? { rating: "desc" as const }
    : sort === "reviews" ? { reviewCount: "desc" as const }
    : sort === "newest" ? { createdAt: "desc" as const }
    : { rating: "desc" as const };

  const [venues, total] = await Promise.all([
    prisma.venue.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.venue.count({ where }),
  ]);

  return NextResponse.json({ venues, total, page, limit });
}

// POST /api/venues - 업소 등록
export async function POST(request: NextRequest) {
  const body = await request.json();

  const venue = await prisma.venue.create({
    data: {
      name: body.name,
      category: body.category,
      categorySlug: body.categorySlug,
      region: body.region,
      district: body.district,
      address: body.address,
      phone: body.phone,
      hours: body.hours,
      lateNight: body.lateNight || false,
      closedDays: body.closedDays,
      priceRange: body.priceRange,
      priceLevel: body.priceLevel || "MEDIUM",
      shortIntro: body.shortIntro,
      description: body.description,
      tags: body.tags || [],
      facilities: body.facilities || [],
      images: body.images || [],
      ownerId: body.ownerId,
      sourceUrl: body.sourceUrl,
      sourceName: body.sourceName,
      isApproved: body.isApproved || false,
    },
  });

  return NextResponse.json(venue, { status: 201 });
}
