"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getToken, clearTokens } from "@/lib/api";

const nav = [
  { href: "/", label: "대시보드", icon: "grid" },
  { href: "/organizations", label: "기관 승인", icon: "building" },
  { href: "/users", label: "사용자", icon: "users" },
  { href: "/reports", label: "보고서", icon: "chart" },
];

function Icon({ name }: { name: string }) {
  const p: Record<string, string> = {
    grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
    building: "M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M9 7h.01M12 7h.01M9 11h.01M12 11h.01M15 21V11h4v10",
    users: "M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    chart: "M3 3v18h18M8 15v3M13 10v8M18 6v12",
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={p[name]} />
    </svg>
  );
}

export default function DashLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) router.replace("/login");
    else setReady(true);
  }, [router]);

  if (!ready) return <div className="min-h-screen bg-canvas" />;

  const logout = () => {
    clearTokens();
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-line bg-surface px-4 py-6 md:flex">
        <div className="flex items-center gap-2 px-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 3 20 6v6c0 5-3.4 8.4-8 9.7C7.4 20.4 4 17 4 12V6l8-3Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <span className="text-[16px] font-extrabold text-content">
            Medi<span className="text-brand">View</span>
          </span>
          <span className="text-[12px] font-semibold text-subtle">Admin</span>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {nav.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors ${
                  active
                    ? "bg-primary-50 text-brand-ink"
                    : "text-muted hover:bg-surface-2 hover:text-content"
                }`}
              >
                <Icon name={n.icon} />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-content"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          로그아웃
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-60">
        <div className="mx-auto max-w-[1080px] px-6 py-8 md:px-10">{children}</div>
      </main>
    </div>
  );
}
