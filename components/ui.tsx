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

const badgeTones: Record<string, string> = {
  brand: "bg-primary-50 text-primary-700",
  success: "bg-[#E4F6ED] text-[#137A4E]",
  warning: "bg-[#FBEFD9] text-[#996314]",
  danger: "bg-[#FBE3E4] text-[#B02529]",
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
      <p className="mt-2 text-[13px] text-muted">
        백엔드 서버(localhost:8080)가 실행 중이고 ADMIN 권한이 있는지 확인하세요.
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
