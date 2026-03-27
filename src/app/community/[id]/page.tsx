import Link from "next/link";
import { prisma } from "@/lib/prisma";

const postCategoryMap: Record<string, { label: string; color: string }> = {
  RECOMMEND: { label: "추천/질문", color: "bg-blue-500/20 text-blue-400" },
  REVIEW: { label: "후기", color: "bg-green-500/20 text-green-400" },
  MEETUP: { label: "모임", color: "bg-purple-500/20 text-purple-400" },
  FREE: { label: "자유", color: "bg-zinc-500/20 text-zinc-400" },
  INFO: { label: "정보", color: "bg-yellow-500/20 text-yellow-400" },
};

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { nickname: true, profileImage: true } },
      comments: {
        include: { author: { select: { nickname: true, profileImage: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) {
    return <div className="flex h-96 items-center justify-center"><p className="text-muted">게시글을 찾을 수 없습니다.</p></div>;
  }

  await prisma.post.update({ where: { id }, data: { views: { increment: 1 } } });

  const cat = postCategoryMap[post.category] || postCategoryMap.FREE;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-accent">홈</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-accent">커뮤니티</Link>
        <span>/</span>
        <span className="text-foreground">{cat.label}</span>
      </div>

      <article className="mt-6 rounded-xl border border-card-border bg-card-bg p-6">
        <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${cat.color}`}>{cat.label}</span>
        <h1 className="mt-3 text-xl font-bold text-foreground">{post.title}</h1>
        <div className="mt-3 flex items-center justify-between border-b border-card-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-muted">{post.author.nickname.charAt(0)}</div>
            <div>
              <p className="text-sm font-medium text-foreground">{post.author.nickname}</p>
              <p className="text-xs text-muted">{post.createdAt.toISOString().split("T")[0]}</p>
            </div>
          </div>
          <span className="text-xs text-muted">조회 {post.views}</span>
        </div>
        <div className="mt-6 text-sm leading-7 text-foreground/80 whitespace-pre-line">{post.content}</div>
        <div className="mt-8 flex items-center gap-3 border-t border-card-border pt-4">
          <button className="flex items-center gap-1.5 rounded-lg border border-card-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent">❤️ 좋아요 {post.likes}</button>
          <button className="flex items-center gap-1.5 rounded-lg border border-card-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent">🔗 공유</button>
        </div>
      </article>

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-foreground">댓글 {post.comments.length}</h2>
        <div className="mt-4 space-y-3">
          {post.comments.map((comment) => (
            <div key={comment.id} className="rounded-xl border border-card-border bg-card-bg p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs text-muted">{comment.author.nickname.charAt(0)}</div>
                <div>
                  <span className="text-sm font-medium text-foreground">{comment.author.nickname}</span>
                  {comment.authorId === post.authorId && <span className="ml-1 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] text-accent">작성자</span>}
                  <p className="text-xs text-muted">{comment.createdAt.toISOString().split("T")[0]}</p>
                </div>
              </div>
              <p className="mt-2 pl-10 text-sm leading-6 text-foreground/80">{comment.content}</p>
            </div>
          ))}
          {post.comments.length === 0 && (
            <div className="flex h-24 items-center justify-center rounded-xl border border-card-border bg-card-bg">
              <p className="text-sm text-muted">아직 댓글이 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      <div className="mt-8 text-center">
        <Link href="/community" className="rounded-lg border border-card-border px-6 py-2.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent">목록으로</Link>
      </div>
    </div>
  );
}
