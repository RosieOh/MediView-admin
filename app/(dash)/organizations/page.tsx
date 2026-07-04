"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, Spinner, Badge, Button, PageHeader, ErrorBox } from "@/components/ui";
import type { Organization, OrgStatus } from "@/lib/types";

const statusTone: Record<OrgStatus, "success" | "warning" | "danger" | "neutral"> = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "danger",
  SUSPENDED: "neutral",
};
const statusLabel: Record<OrgStatus, string> = {
  APPROVED: "승인됨",
  PENDING: "대기",
  REJECTED: "반려",
  SUSPENDED: "정지",
};

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  const load = () => {
    api<Organization[]>("/api/admin/organizations")
      .then(setOrgs)
      .catch((e) => setError(e.message));
  };
  useEffect(load, []);

  const act = async (id: number, action: "approve" | "reject" | "suspend") => {
    setBusy(id);
    try {
      const updated = await api<Organization>(`/api/admin/organizations/${id}/${action}`, {
        method: "POST",
      });
      setOrgs((prev) => prev?.map((o) => (o.id === id ? updated : o)) ?? null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "처리 실패");
    } finally {
      setBusy(null);
    }
  };

  if (error) return <ErrorBox message={error} />;

  return (
    <div>
      <PageHeader title="기관 승인" subtitle="의료기관 등록을 검토하고 승인/반려합니다" />

      {!orgs ? (
        <Spinner />
      ) : orgs.length === 0 ? (
        <Card className="mt-6 p-10 text-center text-[14px] text-muted">등록된 기관이 없습니다.</Card>
      ) : (
        <Card className="mt-6 overflow-hidden">
          <div className="divide-y divide-line">
            {orgs.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-content">{o.name}</span>
                    <Badge tone={statusTone[o.status]}>{statusLabel[o.status]}</Badge>
                  </div>
                  <div className="mt-0.5 text-[13px] text-muted">
                    {o.type === "CLINIC" ? "의원" : "병원"} · 사업자 {o.bizNo}
                    {o.phone ? ` · ${o.phone}` : ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  {o.status !== "APPROVED" ? (
                    <Button size="sm" variant="success" disabled={busy === o.id} onClick={() => act(o.id, "approve")}>
                      승인
                    </Button>
                  ) : null}
                  {o.status === "PENDING" ? (
                    <Button size="sm" variant="danger" disabled={busy === o.id} onClick={() => act(o.id, "reject")}>
                      반려
                    </Button>
                  ) : null}
                  {o.status === "APPROVED" ? (
                    <Button size="sm" variant="secondary" disabled={busy === o.id} onClick={() => act(o.id, "suspend")}>
                      정지
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
