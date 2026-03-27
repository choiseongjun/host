"use client";

import MypageSidebar from "@/components/MypageSidebar";

export default function ProfileEditPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <MypageSidebar />

        <div className="flex-1 space-y-6">
          <h1 className="text-xl font-bold text-foreground">프로필 수정</h1>

          {/* Profile Image */}
          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <h2 className="text-sm font-semibold text-foreground">프로필 이미지</h2>
            <div className="mt-4 flex items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-accent/10 text-4xl">
                👤
              </div>
              <div>
                <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover">
                  이미지 변경
                </button>
                <button className="ml-2 rounded-lg border border-card-border px-4 py-2 text-sm text-muted transition-colors hover:border-red-500/50 hover:text-red-400">
                  삭제
                </button>
                <p className="mt-2 text-xs text-muted">JPG, PNG 파일 (최대 5MB)</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <h2 className="text-sm font-semibold text-foreground">기본 정보</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">아이디</label>
                <input
                  type="text"
                  value="gangnam_user123"
                  disabled
                  className="mt-1.5 w-full rounded-lg border border-card-border bg-zinc-900 px-4 py-3 text-sm text-muted"
                />
                <p className="mt-1 text-xs text-muted">아이디는 변경할 수 없습니다.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">닉네임</label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="text"
                    defaultValue="강남유저123"
                    className="flex-1 rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                  <button className="shrink-0 rounded-lg border border-card-border px-4 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent">
                    중복확인
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">이메일</label>
                <input
                  type="email"
                  defaultValue="user@example.com"
                  className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">휴대폰 번호</label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="tel"
                    defaultValue="010-1234-5678"
                    className="flex-1 rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                  <button className="shrink-0 rounded-lg border border-card-border px-4 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent">
                    변경
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">성별</label>
                <div className="mt-1.5 flex gap-3">
                  {["남성", "여성", "비공개"].map((g) => (
                    <label key={g} className="flex items-center gap-2 text-sm text-muted">
                      <input type="radio" name="gender" defaultChecked={g === "남성"} className="accent-[#c8a96e]" />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">생년월일</label>
                <input
                  type="date"
                  defaultValue="1990-01-01"
                  className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <h2 className="text-sm font-semibold text-foreground">비밀번호 변경</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">현재 비밀번호</label>
                <input
                  type="password"
                  placeholder="현재 비밀번호 입력"
                  className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">새 비밀번호</label>
                <input
                  type="password"
                  placeholder="새 비밀번호 (영문, 숫자, 특수문자 포함 8자 이상)"
                  className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">새 비밀번호 확인</label>
                <input
                  type="password"
                  placeholder="새 비밀번호 재입력"
                  className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>
              <button className="rounded-lg border border-card-border px-6 py-2.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent">
                비밀번호 변경
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <h2 className="text-sm font-semibold text-foreground">알림 설정</h2>
            <div className="mt-4 space-y-4">
              {[
                { label: "리뷰 좋아요 알림", desc: "내 리뷰에 좋아요가 달리면 알림", default: true },
                { label: "찜 업소 이벤트 알림", desc: "찜한 업소의 이벤트/소식 알림", default: true },
                { label: "구인구직 알림", desc: "관심 업종의 새 구인글 알림", default: false },
                { label: "마케팅 알림", desc: "할인, 프로모션 등 마케팅 정보 수신", default: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">{item.label}</p>
                    <p className="text-xs text-muted">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked={item.default} className="peer sr-only" />
                    <div className="h-6 w-11 rounded-full bg-zinc-700 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-accent peer-checked:after:translate-x-full" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center justify-between">
            <button className="rounded-xl bg-accent px-8 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover">
              변경사항 저장
            </button>
            <button className="text-sm text-red-400 hover:text-red-300">
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
