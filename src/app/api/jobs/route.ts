import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/jobs
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const region = searchParams.get("region");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = { status: "ACTIVE" };
  if (type) where.type = type;
  if (category) where.category = category;
  if (region) where.region = region;

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: { author: { select: { nickname: true } } },
      orderBy: [{ isPremium: "desc" }, { isUrgent: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);

  return NextResponse.json({ jobs, total, page, limit });
}

// POST /api/jobs
export async function POST(request: NextRequest) {
  const body = await request.json();

  const job = await prisma.job.create({
    data: {
      type: body.type,
      title: body.title,
      category: body.category,
      region: body.region,
      district: body.district,
      salary: body.salary,
      workHours: body.workHours,
      gender: body.gender,
      age: body.age,
      description: body.description,
      requirements: body.requirements || [],
      contact: body.contact,
      authorId: body.authorId,
      isUrgent: body.isUrgent || false,
    },
  });

  return NextResponse.json(job, { status: 201 });
}
