import MypageSidebar from "@/components/MypageSidebar";
import Link from "next/link";

const myJobs = [
  {
    id: "mj1",
    type: "구인" as const,
    title: "청담동 라운지바 바텐더 모집",
    category: "바/라운지",
    region: "강남구 청담동",
    salary: "월 350만원~",
    date: "2026-03-24",
    views: 156,
    contacts: 8,
    status: "진행중" as const,
  },
  {
    id: "mj2",
    type: "구인" as const,
    title: "강남 룸살롱 여성 직원 모집",
    category: "룸살롱",
    region: "강남구 논현동",
    salary: "일 50만원~",
    date: "2026-03-20",
    views: 342,
    contacts: 15,
    status: "진행중" as const,
  },
  {
    id: "mj3",
    type: "구인" as const,
    title: "홍대 클럽 DJ 모집",
    category: "클럽",
    region: "마포구 홍대입구",
    salary: "회당 30만원~",
    date: "2026-03-10",
    views: 89,
    contacts: 3,
    status: "마감" as const,
  },
];

export default function MyJobsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <MypageSidebar />

        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">내 구인구직</h1>
              <p className="mt-1 text-sm text-muted">총 {myJobs.length}개</p>
            </div>
            <Link
              href="/jobs"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
            >
              새 글 작성
            </Link>
          </div>

          {/* Tab */}
          <div className="flex gap-1 rounded-xl border border-card-border bg-card-bg p-1">
            {["전체", "구인", "구직"].map((tab) => (
              <button
                key={tab}
                className="flex-1 rounded-lg py-2 text-sm text-muted transition-colors hover:text-foreground first:bg-accent first:text-black first:font-medium"
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {myJobs.map((job) => (
              <div key={job.id} className="rounded-xl border border-card-border bg-card-bg p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          job.type === "구인"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {job.type}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          job.status === "진행중"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-zinc-500/20 text-zinc-400"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-foreground">{job.title}</h3>
                    <p className="mt-1 text-xs text-muted">{job.category} · {job.region}</p>
                  </div>
                  <p className="text-sm font-medium text-accent">{job.salary}</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-card-border pt-4">
                  <div className="flex gap-6 text-xs text-muted">
                    <span>등록일 {job.date}</span>
                    <span>조회 {job.views}</span>
                    <span>연락 {job.contacts}건</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent">
                      수정
                    </button>
                    {job.status === "진행중" ? (
                      <button className="rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-orange-500/50 hover:text-orange-400">
                        마감
                      </button>
                    ) : (
                      <button className="rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-green-500/50 hover:text-green-400">
                        재등록
                      </button>
                    )}
                    <button className="rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-red-500/50 hover:text-red-400">
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
