import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const take = Number(searchParams.get("take") ?? 20);

  const [likes, dislikes] = await Promise.all([
    prisma.userLikes.findMany({ where: { userId: userId ?? "" }, select: { tagId: true } }),
    prisma.userDislikes.findMany({ where: { userId: userId ?? "" }, select: { tagId: true } }),
  ]);
  const likeIds = new Set(likes.map(x => x.tagId));
  const dislikeIds = new Set(dislikes.map(x => x.tagId));

  const posts = await prisma.post.findMany({
    take,
    orderBy: { createdAt: "desc" },
    include: { tags: { include: { tag: true } }, author: true },
  });

  const scored = posts.map(p => {
    const ageHours = (Date.now() - p.createdAt.getTime()) / 36e5;
    const recency = Math.max(0, 48 - ageHours);
    const matches = p.tags.reduce(
      (acc, pt) => acc + (likeIds.has(pt.tagId) ? 1 : 0) - (dislikeIds.has(pt.tagId) ? 1 : 0),
      0
    );
    const score = recency + matches * 10; // peso gustos
    return { ...p, score };
  }).sort((a, b) => b.score - a.score);

  return NextResponse.json(scored);
}

export async function POST(req: Request) {
  const { authorId, title, description, imageUrl, videoUrl, tagIds = [] } = await req.json();

  const post = await prisma.post.create({
    data: {
      authorId, title, description, imageUrl, videoUrl,
      tags: { create: tagIds.map((tagId: string) => ({ tag: { connect: { id: tagId } } })) },
    },
    include: { tags: { include: { tag: true } }, author: true },
  });
  return NextResponse.json(post);
}
