"use client";

import type { ReactNode } from "react";

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const sizes = { sm: "h-8 px-3 text-[13px]", md: "h-10 px-4 text-[14px]" };
  const variants: Record<string, string> = {
    primary: "bg-brand text-white hover:bg-primary-600",
    secondary: "bg-surface text-content border border-line-strong hover:border-brand",
    ghost: "text-muted hover:bg-surface-2 hover:text-content",
    danger: "bg-danger text-white hover:opacity-90",
    success: "bg-success text-white hover:opacity-90",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// JellySafe 4단계 리스크 스케일 토큰 사용(raw hex 금지).
// 라이트/다크 각각 대비 검증 완료(모두 ≥4.5:1) — globals.css 의 --status-* 참조.
// success→safe, warning→caution, danger→critical(오류/반려의 심각도) 로 매핑한다.
const badgeTones: Record<string, string> = {
  brand: "bg-primary-50 text-primary-700",
  success: "bg-status-safe-bg text-status-safe-ink",
  warning: "bg-status-caution-bg text-status-caution-ink",
  danger: "bg-status-critical-bg text-status-critical-ink",
  critical: "bg-status-critical-bg text-status-critical-ink",
  neutral: "bg-surface-2 text-muted",
};

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: keyof typeof badgeTones;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${badgeTones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-line bg-surface ${className}`}>{children}</div>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-brand" />
    </div>
  );
}

/**
 * 목록 로딩용 스켈레톤. 콘텐츠 자리에는 스피너 대신 스켈레톤을 쓴다
 * (레이아웃 점프 방지 + 무엇이 로드되는지 미리 보여줌).
 * prefers-reduced-motion 에서는 펄스를 멈추고 정적 플레이스홀더로 남는다.
 */
export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <Card className="mt-4 divide-y divide-line" aria-busy="true" aria-live="polite">
      <span className="sr-only">불러오는 중…</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="motion-safe:animate-pulse h-9 w-9 shrink-0 rounded-full bg-surface-2" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="motion-safe:animate-pulse h-3.5 w-[38%] rounded bg-surface-2" />
            <div className="motion-safe:animate-pulse h-3 w-[24%] rounded bg-surface-2" />
          </div>
          <div className="motion-safe:animate-pulse h-6 w-16 shrink-0 rounded-full bg-surface-2" />
        </div>
      ))}
    </Card>
  );
}

/** 통계 카드 그리드용 스켈레톤. 실제 카드와 같은 그리드/높이라 로드 후 레이아웃이 튀지 않는다. */
export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div
      className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">불러오는 중…</span>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-5">
          <div className="motion-safe:animate-pulse h-3 w-20 rounded bg-surface-2" />
          <div className="motion-safe:animate-pulse mt-3 h-7 w-24 rounded bg-surface-2" />
        </Card>
      ))}
    </div>
  );
}

/**
 * 빈 상태. "없습니다" 대신 다음 행동을 알려준다(product 레지스터: 빈 상태는 인터페이스를 가르친다).
 */
export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="px-5 py-14 text-center">
      <p className="text-[15px] font-semibold text-content">{title}</p>
      {hint ? <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-6 text-muted">{hint}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-muted">{label}</span>
      <input
        {...props}
        className="h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-[15px] text-content outline-none transition-colors focus:border-brand"
      />
    </label>
  );
}

export function fmtWon(n?: number) {
  return `${(n ?? 0).toLocaleString("ko-KR")}원`;
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <Card className="mt-4 p-6">
      <div className="flex items-center gap-2 text-danger">
        <Badge tone="danger">오류</Badge>
        <span className="text-[14px]">{message}</span>
      </div>
      <p className="mt-2 text-[13px] leading-6 text-muted">
        네트워크 연결과 ADMIN 권한을 확인한 뒤 다시 시도해 주세요. 문제가 계속되면
        관리자에게 문의하세요.
      </p>
    </Card>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-bold text-content">{title}</h1>
        {subtitle ? <p className="mt-1 text-[14px] text-muted">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}
