import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, likes = [], dislikes = [] } = await req.json();

  await prisma.userLikes.deleteMany({ where: { userId } });
  await prisma.userDislikes.deleteMany({ where: { userId } });

  if (likes.length)      await prisma.userLikes.createMany({ data: likes.map((tagId: string) => ({ userId, tagId }))});
  if (dislikes.length)   await prisma.userDislikes.createMany({ data: dislikes.map((tagId: string) => ({ userId, tagId }))});

  return NextResponse.json({ ok: true });
}
