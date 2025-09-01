import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") as "DISCIPLINA"|"ESTILO"|"TEMA"|null;
  const where = category ? { category } : {};
  const tags = await prisma.tag.findMany({ where, orderBy: { name: "asc" } });
  return NextResponse.json(tags);
}
