"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loginType, setLoginType] = useState<"user" | "business">("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    if (!username || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "로그인에 실패했습니다.");
        return;
      }
      login(data.token, data.user);
      router.push("/");
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

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
                {loginType === "user" ? "아이디 또는 이메일" : "사업자 아이디"}
              </label>
              <input
                type="text"
                placeholder={loginType === "user" ? "아이디 또는 이메일 입력" : "사업자 아이디 입력"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>
            {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" className="accent-[#c8a96e]" />
                로그인 유지
              </label>
              <Link href="#" className="text-sm text-muted hover:text-accent">
                비밀번호 찾기
              </Link>
            </div>

            <button onClick={handleLogin} disabled={loading} className="w-full rounded-xl bg-accent py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover disabled:opacity-50">
              {loading ? "로그인 중..." : "로그인"}
            </button>
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
