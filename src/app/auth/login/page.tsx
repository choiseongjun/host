"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [loginType, setLoginType] = useState<"user" | "business">("user");

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-accent">사랑과</span>
            <span className="text-foreground">전쟁</span>
          </Link>
          <p className="mt-2 text-sm text-muted">밤이 시작되는 곳</p>
        </div>

        {/* Login Type Toggle */}
        <div className="mt-8 flex rounded-xl border border-card-border bg-card-bg p-1">
          <button
            onClick={() => setLoginType("user")}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
              loginType === "user"
                ? "bg-accent text-black"
                : "text-muted hover:text-foreground"
            }`}
          >
            일반 회원
          </button>
          <button
            onClick={() => setLoginType("business")}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
              loginType === "business"
                ? "bg-accent text-black"
                : "text-muted hover:text-foreground"
            }`}
          >
            업소 사장님
          </button>
        </div>

        {/* Login Form */}
        <div className="mt-6 rounded-xl border border-card-border bg-card-bg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">
                {loginType === "user" ? "이메일 또는 아이디" : "사업자 이메일"}
              </label>
              <input
                type="text"
                placeholder={loginType === "user" ? "이메일 또는 아이디 입력" : "사업자 이메일 입력"}
                className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호 입력"
                className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" className="accent-[#c8a96e]" />
                로그인 유지
              </label>
              <Link href="#" className="text-sm text-muted hover:text-accent">
                비밀번호 찾기
              </Link>
            </div>

            <button className="w-full rounded-xl bg-accent py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover">
              로그인
            </button>
          </div>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-card-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card-bg px-3 text-muted">간편 로그인</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <button className="flex items-center justify-center rounded-lg border border-card-border py-3 text-sm transition-colors hover:border-accent hover:text-accent">
                <span className="text-lg">💬</span>
                <span className="ml-1.5 text-xs text-muted">카카오</span>
              </button>
              <button className="flex items-center justify-center rounded-lg border border-card-border py-3 text-sm transition-colors hover:border-accent hover:text-accent">
                <span className="text-lg">🟢</span>
                <span className="ml-1.5 text-xs text-muted">네이버</span>
              </button>
              <button className="flex items-center justify-center rounded-lg border border-card-border py-3 text-sm transition-colors hover:border-accent hover:text-accent">
                <span className="text-lg">🔵</span>
                <span className="ml-1.5 text-xs text-muted">구글</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          아직 회원이 아니신가요?{" "}
          <Link href="/auth/signup" className="font-medium text-accent hover:text-accent-hover">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
