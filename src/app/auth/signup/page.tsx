"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [signupType, setSignupType] = useState<"user" | "business">("user");
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState({ terms: false, privacy: false, marketing: false });
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    businessNumber: "",
    businessName: "",
    representative: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateForm(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    setError("");

    if (!form.username || !form.email || !form.password || !form.nickname) {
      setError("모든 필수 항목을 입력해주세요.");
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (form.password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          nickname: form.nickname,
          role: signupType === "business" ? "BUSINESS" : "USER",
          marketing: agreed.marketing,
          ...(signupType === "business" && {
            businessNumber: form.businessNumber,
            businessName: form.businessName,
            representative: form.representative,
          }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "회원가입에 실패했습니다.");
        return;
      }

      setStep(3);
    } catch {
      setError("서버 오류가 발생했습니다. 다시 시도해주세요.");
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
          <p className="mt-2 text-sm text-muted">회원가입</p>
        </div>

        {/* Signup Type Toggle */}
        <div className="mt-8 flex rounded-xl border border-card-border bg-card-bg p-1">
          <button
            onClick={() => { setSignupType("user"); setStep(1); }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
              signupType === "user"
                ? "bg-accent text-black"
                : "text-muted hover:text-foreground"
            }`}
          >
            일반 회원
          </button>
          <button
            onClick={() => { setSignupType("business"); setStep(1); }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
              signupType === "business"
                ? "bg-accent text-black"
                : "text-muted hover:text-foreground"
            }`}
          >
            업소 사장님
          </button>
        </div>

        {/* Step Indicator */}
        <div className="mt-6 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                  step >= s
                    ? "bg-accent text-black"
                    : "border border-card-border text-muted"
                }`}
              >
                {s}
              </div>
              <span className="text-[10px] text-muted">
                {s === 1 ? "약관동의" : s === 2 ? "정보입력" : "가입완료"}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-card-border bg-card-bg p-6">
          {/* Step 1: Terms */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">약관 동의</h2>

              <label className="flex items-center gap-3 rounded-lg border border-card-border p-4 transition-colors hover:border-accent/40">
                <input
                  type="checkbox"
                  checked={agreed.terms && agreed.privacy && agreed.marketing}
                  onChange={(e) =>
                    setAgreed({ terms: e.target.checked, privacy: e.target.checked, marketing: e.target.checked })
                  }
                  className="accent-[#c8a96e]"
                />
                <span className="text-sm font-medium text-foreground">전체 동의</span>
              </label>

              <div className="space-y-2 pl-2">
                <label className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    checked={agreed.terms}
                    onChange={(e) => setAgreed({ ...agreed, terms: e.target.checked })}
                    className="accent-[#c8a96e]"
                  />
                  <span className="text-sm text-foreground">[필수] 이용약관 동의</span>
                  <Link href="#" className="ml-auto text-xs text-muted hover:text-accent">보기</Link>
                </label>
                <label className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    checked={agreed.privacy}
                    onChange={(e) => setAgreed({ ...agreed, privacy: e.target.checked })}
                    className="accent-[#c8a96e]"
                  />
                  <span className="text-sm text-foreground">[필수] 개인정보 수집 및 이용 동의</span>
                  <Link href="#" className="ml-auto text-xs text-muted hover:text-accent">보기</Link>
                </label>
                <label className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    checked={agreed.marketing}
                    onChange={(e) => setAgreed({ ...agreed, marketing: e.target.checked })}
                    className="accent-[#c8a96e]"
                  />
                  <span className="text-sm text-foreground">[선택] 마케팅 정보 수신 동의</span>
                  <Link href="#" className="ml-auto text-xs text-muted hover:text-accent">보기</Link>
                </label>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!agreed.terms || !agreed.privacy}
                className="w-full rounded-xl bg-accent py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                다음
              </button>
            </div>
          )}

          {/* Step 2: Info */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                {signupType === "user" ? "회원 정보 입력" : "업소 사장님 정보 입력"}
              </h2>

              {error && (
                <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground">아이디</label>
                <input
                  type="text"
                  placeholder="아이디 입력 (영문, 숫자 4~20자)"
                  value={form.username}
                  onChange={(e) => updateForm("username", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">이메일</label>
                <input
                  type="email"
                  placeholder="이메일 입력"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">비밀번호</label>
                <input
                  type="password"
                  placeholder="비밀번호 (8자 이상)"
                  value={form.password}
                  onChange={(e) => updateForm("password", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">비밀번호 확인</label>
                <input
                  type="password"
                  placeholder="비밀번호 재입력"
                  value={form.passwordConfirm}
                  onChange={(e) => updateForm("passwordConfirm", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">닉네임</label>
                <input
                  type="text"
                  placeholder="닉네임 입력 (2~10자)"
                  value={form.nickname}
                  onChange={(e) => updateForm("nickname", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>

              {signupType === "business" && (
                <>
                  <hr className="border-card-border" />
                  <h3 className="text-sm font-semibold text-foreground">사업자 정보</h3>
                  <div>
                    <label className="block text-sm font-medium text-foreground">사업자등록번호</label>
                    <input
                      type="text"
                      placeholder="000-00-00000"
                      value={form.businessNumber}
                      onChange={(e) => updateForm("businessNumber", e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">상호명</label>
                    <input
                      type="text"
                      placeholder="상호명 입력"
                      value={form.businessName}
                      onChange={(e) => updateForm("businessName", e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">대표자명</label>
                    <input
                      type="text"
                      placeholder="대표자명 입력"
                      value={form.representative}
                      onChange={(e) => updateForm("representative", e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border border-card-border py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  이전
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? "처리 중..." : "가입하기"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {step === 3 && (
            <div className="py-8 text-center">
              <div className="text-5xl">🎉</div>
              <h2 className="mt-4 text-xl font-bold text-foreground">가입을 환영합니다!</h2>
              <p className="mt-2 text-sm text-muted">
                사랑과전쟁의 회원이 되신 것을 축하합니다.
                <br />
                지금 바로 다양한 업소 정보를 확인해보세요.
              </p>
              <div className="mt-8 flex gap-3">
                <Link
                  href="/auth/login"
                  className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
                >
                  로그인하기
                </Link>
                <Link
                  href="/"
                  className="flex-1 rounded-xl border border-card-border py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  메인으로
                </Link>
              </div>
            </div>
          )}
        </div>

        {step !== 3 && (
          <p className="mt-6 text-center text-sm text-muted">
            이미 회원이신가요?{" "}
            <Link href="/auth/login" className="font-medium text-accent hover:text-accent-hover">
              로그인
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
