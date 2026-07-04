"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, Spinner, Badge, Button, PageHeader, ErrorBox } from "@/components/ui";
import type { AdminUser, UserStatus } from "@/lib/types";

const statusTone: Record<UserStatus, "success" | "danger" | "neutral"> = {
  ACTIVE: "success",
  SUSPENDED: "danger",
  WITHDRAWN: "neutral",
  INACTIVE: "neutral",
};
const statusLabel: Record<UserStatus, string> = {
  ACTIVE: "활성",
  SUSPENDED: "정지",
  WITHDRAWN: "탈퇴",
  INACTIVE: "비활성",
};
const roleLabel: Record<string, string> = { PATIENT: "환자", DOCTOR: "의료진", ADMIN: "관리자" };

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [q, setQ] = useState("");

  const load = () => {
    api<AdminUser[]>("/api/admin/users")
      .then(setUsers)
      .catch((e) => setError(e.message));
  };
  useEffect(load, []);

  const changeStatus = async (id: number, status: UserStatus) => {
    setBusy(id);
    try {
      const updated = await api<AdminUser>(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        body: { status },
      });
      setUsers((prev) => prev?.map((u) => (u.id === id ? updated : u)) ?? null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "처리 실패");
    } finally {
      setBusy(null);
    }
  };

  if (error) return <ErrorBox message={error} />;

  const filtered = (users ?? []).filter(
    (u) => q === "" || u.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="사용자 관리" subtitle="계정 상태를 관리합니다 (정지 시 세션 회수)" />

      {!users ? (
        <Spinner />
      ) : (
        <>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="이메일 검색"
            className="mt-6 h-10 w-full max-w-xs rounded-lg border border-line bg-surface px-3.5 text-[14px] text-content outline-none focus:border-brand"
          />
          <Card className="mt-4 overflow-hidden">
            <div className="divide-y divide-line">
              {filtered.map((u) => (
                <div key={u.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-content">{u.email}</span>
                      <Badge tone={statusTone[u.status]}>{statusLabel[u.status]}</Badge>
                    </div>
                    <div className="mt-0.5 text-[13px] text-muted">
                      {roleLabel[u.role] ?? u.role}
                      {u.phone ? ` · ${u.phone}` : ""}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {u.status === "ACTIVE" ? (
                      <Button size="sm" variant="danger" disabled={busy === u.id} onClick={() => changeStatus(u.id, "SUSPENDED")}>
                        정지
                      </Button>
                    ) : (
                      <Button size="sm" variant="success" disabled={busy === u.id} onClick={() => changeStatus(u.id, "ACTIVE")}>
                        활성화
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {filtered.length === 0 ? (
                <div className="px-5 py-10 text-center text-[14px] text-muted">사용자가 없습니다.</div>
              ) : null}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
