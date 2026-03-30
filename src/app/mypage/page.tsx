"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function MypageDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted">로그인이 필요합니다.</p>
          <Link href="/auth/login" className="mt-4 inline-block rounded-xl bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover">
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="rounded-xl border border-card-border bg-card-bg p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-accent/10 text-3xl">
            {user.profileImage ? (
              <img src={user.profileImage} alt="" className="h-full w-full rounded-full object-cover" />
            ) : "👤"}
          </div>
          <h1 className="mt-4 text-xl font-bold text-foreground">{user.nickname}</h1>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
          <p className="mt-0.5 text-xs text-muted">{user.role === "BUSINESS" ? "업소 사장님" : "일반회원"}</p>
        </div>

        {/* 프로필 이미지 설정 */}
        <div className="rounded-xl border border-card-border bg-card-bg p-6">
          <h2 className="text-sm font-semibold text-foreground">프로필 이미지 설정</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-accent/10 text-2xl">
              {user.profileImage ? (
                <img src={user.profileImage} alt="" className="h-full w-full rounded-full object-cover" />
              ) : "👤"}
            </div>
            <button className="rounded-lg border border-card-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent">
              이미지 변경
            </button>
          </div>
        </div>

        {/* 내 즐겨찾기 */}
        <div className="rounded-xl border border-card-border bg-card-bg p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">내 즐겨찾기</h2>
            <Link href="/mypage/favorites" className="text-xs text-accent hover:text-accent-hover">전체보기 →</Link>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted py-8 text-center">즐겨찾기한 업소가 없습니다.</p>
          </div>
        </div>

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="w-full rounded-xl border border-card-border py-3 text-sm text-muted transition-colors hover:border-red-500/50 hover:text-red-400"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
