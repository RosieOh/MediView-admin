"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setTokens, clearTokens } from "@/lib/api";
import { Button, Field } from "@/components/ui";
import type { LoginResponse } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api<LoginResponse>("/api/auth/login", {
        method: "POST",
        auth: false,
        body: { email: email.trim(), password: pw },
      });
      if (res.role !== "ADMIN") {
        clearTokens();
        throw new Error("관리자 계정만 접근할 수 있습니다.");
      }
      setTokens(res.token, res.refreshToken);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 3 20 6v6c0 5-3.4 8.4-8 9.7C7.4 20.4 4 17 4 12V6l8-3Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <span className="text-[18px] font-extrabold text-content">
            Medi<span className="text-brand">View</span>
            <span className="ml-1.5 text-[13px] font-semibold text-muted">Admin</span>
          </span>
        </div>

        <h1 className="text-[24px] font-bold text-content">관리자 로그인</h1>
        <p className="mt-1 text-[14px] text-muted">콘솔에 접근하려면 로그인하세요.</p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <Field
            label="이메일"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@mediview.app"
          />
          <Field
            label="비밀번호"
            type="password"
            autoComplete="current-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호"
          />
          {error ? <p className="text-[13px] text-danger">{error}</p> : null}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "로그인 중…" : "로그인"}
          </Button>
        </form>
      </div>
    </div>
  );
}
