import Link from "next/link";
import MypageSidebar from "@/components/MypageSidebar";

export default function MypageDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <MypageSidebar />

        <div className="flex-1 space-y-6">
          <h1 className="text-xl font-bold text-foreground">마이페이지</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "작성 리뷰", value: "12", icon: "✍️", href: "/mypage/reviews" },
              { label: "찜 목록", value: "8", icon: "❤️", href: "/mypage/favorites" },
              { label: "구인구직 글", value: "3", icon: "💼", href: "/mypage/jobs" },
              { label: "방문 인증", value: "5", icon: "✅", href: "#" },
            ].map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="rounded-xl border border-card-border bg-card-bg p-4 text-center transition-all hover:border-accent/40"
              >
                <span className="text-2xl">{stat.icon}</span>
                <p className="mt-2 text-2xl font-bold text-accent">{stat.value}</p>
                <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <h2 className="text-sm font-semibold text-foreground">최근 활동</h2>
            <div className="mt-4 space-y-4">
              {[
                { action: "리뷰 작성", target: "르누아르", date: "2026-03-25", type: "review" },
                { action: "찜 추가", target: "블루문 라운지", date: "2026-03-24", type: "favorite" },
                { action: "방문 인증", target: "골든 마이크", date: "2026-03-22", type: "verify" },
                { action: "구인글 작성", target: "바텐더 구인", date: "2026-03-20", type: "job" },
                { action: "리뷰 작성", target: "클럽 옥타곤", date: "2026-03-18", type: "review" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between border-b border-card-border pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs">
                      {activity.type === "review" && "✍️"}
                      {activity.type === "favorite" && "❤️"}
                      {activity.type === "verify" && "✅"}
                      {activity.type === "job" && "💼"}
                    </span>
                    <div>
                      <p className="text-sm text-foreground">
                        <span className="text-muted">{activity.action}</span> {activity.target}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted">{activity.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">알림</h2>
              <button className="text-xs text-muted hover:text-accent">모두 읽음</button>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { msg: "작성하신 리뷰에 좋아요가 5개 달렸습니다.", time: "2시간 전", read: false },
                { msg: "찜한 업소 '블루문 라운지'에서 이벤트를 시작했습니다.", time: "1일 전", read: false },
                { msg: "방문 인증이 승인되었습니다.", time: "3일 전", read: true },
              ].map((noti, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-lg p-3 ${
                    noti.read ? "" : "bg-accent/5"
                  }`}
                >
                  {!noti.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                  <div className={noti.read ? "pl-5" : ""}>
                    <p className="text-sm text-foreground">{noti.msg}</p>
                    <p className="mt-0.5 text-xs text-muted">{noti.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
