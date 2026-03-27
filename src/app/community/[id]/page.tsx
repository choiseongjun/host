import Link from "next/link";
import { posts, comments } from "@/data/mock";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = posts.find((p) => p.id === id);
  const postComments = comments.filter((c) => c.postId === id);

  if (!post) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted">게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-accent">홈</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-accent">커뮤니티</Link>
        <span>/</span>
        <span className="text-foreground">{post.category}</span>
      </div>

      {/* Post */}
      <article className="mt-6 rounded-xl border border-card-border bg-card-bg p-6">
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-medium ${
              post.category === "추천/질문"
                ? "bg-blue-500/20 text-blue-400"
                : post.category === "후기"
                ? "bg-green-500/20 text-green-400"
                : post.category === "모임"
                ? "bg-purple-500/20 text-purple-400"
                : post.category === "정보"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-zinc-500/20 text-zinc-400"
            }`}
          >
            {post.category}
          </span>
        </div>

        <h1 className="mt-3 text-xl font-bold text-foreground">{post.title}</h1>

        <div className="mt-3 flex items-center justify-between border-b border-card-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-muted">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{post.author}</p>
              <p className="text-xs text-muted">{post.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span>조회 {post.views}</span>
          </div>
        </div>

        <div className="mt-6 text-sm leading-7 text-foreground/80 whitespace-pre-line">
          {post.content}
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between border-t border-card-border pt-4">
          <div className="flex gap-3">
            <button className="flex items-center gap-1.5 rounded-lg border border-card-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent">
              ❤️ 좋아요 {post.likes}
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-card-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent">
              🔗 공유
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-card-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent">
              🔖 저장
            </button>
          </div>
          <button className="text-xs text-muted hover:text-red-400">신고</button>
        </div>
      </article>

      {/* Comments */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold text-foreground">댓글 {postComments.length}</h2>

        {/* Comment Input */}
        <div className="mt-4 rounded-xl border border-card-border bg-card-bg p-4">
          <textarea
            rows={3}
            placeholder="댓글을 입력하세요..."
            className="w-full resize-none rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <div className="mt-2 flex justify-end">
            <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover">
              댓글 등록
            </button>
          </div>
        </div>

        {/* Comment List */}
        <div className="mt-4 space-y-3">
          {postComments.map((comment) => (
            <div key={comment.id} className="rounded-xl border border-card-border bg-card-bg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-muted">
                    {comment.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{comment.author}</span>
                      {comment.isAuthor && (
                        <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] text-accent">작성자</span>
                      )}
                    </div>
                    <span className="text-xs text-muted">{comment.date}</span>
                  </div>
                </div>
                <button className="text-xs text-muted hover:text-red-400">신고</button>
              </div>
              <p className="mt-2 pl-10 text-sm leading-6 text-foreground/80">{comment.content}</p>
              <div className="mt-2 flex gap-3 pl-10">
                <button className="text-xs text-muted hover:text-accent">❤️ {comment.likes}</button>
                <button className="text-xs text-muted hover:text-accent">답글</button>
              </div>
            </div>
          ))}

          {postComments.length === 0 && (
            <div className="flex h-24 items-center justify-center rounded-xl border border-card-border bg-card-bg">
              <p className="text-sm text-muted">아직 댓글이 없습니다. 첫 댓글을 달아보세요!</p>
            </div>
          )}
        </div>
      </section>

      {/* Back to List */}
      <div className="mt-8 text-center">
        <Link
          href="/community"
          className="rounded-lg border border-card-border px-6 py-2.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
        >
          목록으로
        </Link>
      </div>
    </div>
  );
}
