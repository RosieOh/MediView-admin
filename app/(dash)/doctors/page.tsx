"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, Spinner, Badge, Button, PageHeader, ErrorBox } from "@/components/ui";
import type { AdminDoctor, DoctorVerification } from "@/lib/types";

const vTone: Record<DoctorVerification, "success" | "warning" | "danger" | "neutral"> = {
  VERIFIED: "success",
  PENDING: "warning",
  REJECTED: "danger",
  SUSPENDED: "neutral",
};
const vLabel: Record<DoctorVerification, string> = {
  VERIFIED: "검증됨",
  PENDING: "대기",
  REJECTED: "반려",
  SUSPENDED: "정지",
};

const filters: { key: DoctorVerification | "ALL"; label: string }[] = [
  { key: "PENDING", label: "검증 대기" },
  { key: "VERIFIED", label: "검증됨" },
  { key: "REJECTED", label: "반려" },
  { key: "ALL", label: "전체" },
];

export default function DoctorsPage() {
  const [status, setStatus] = useState<DoctorVerification | "ALL">("PENDING");
  const [docs, setDocs] = useState<AdminDoctor[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  const load = () => {
    setDocs(null);
    const q = status === "ALL" ? "" : `?status=${status}`;
    api<AdminDoctor[]>(`/api/admin/organizations/doctors${q}`)
      .then(setDocs)
      .catch((e) => setError(e.message));
  };
  useEffect(load, [status]);

  const act = async (id: number, action: "verify" | "reject") => {
    setBusy(id);
    try {
      await api(`/api/admin/organizations/doctors/${id}/${action}`, { method: "POST" });
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "처리 실패");
    } finally {
      setBusy(null);
    }
  };

  if (error) return <ErrorBox message={error} />;

  return (
    <div>
      <PageHeader title="의료진 검증" subtitle="면허 검증을 검토하고 승인/반려합니다" />

      <div className="mt-6 flex gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setStatus(f.key)}
            className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
              status === f.key
                ? "bg-brand text-white"
                : "border border-line bg-surface text-muted hover:text-content"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!docs ? (
        <Spinner />
      ) : docs.length === 0 ? (
        <Card className="mt-4 p-10 text-center text-[14px] text-muted">해당 상태의 의료진이 없습니다.</Card>
      ) : (
        <Card className="mt-4 overflow-hidden">
          <div className="divide-y divide-line">
            {docs.map((d) => (
              <div key={d.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-primary-50 text-[15px] font-bold text-brand-ink">
                  {(d.name ?? d.email).charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-content">{d.name ?? "이름 미등록"}</span>
                    <Badge tone={vTone[d.verificationStatus]}>{vLabel[d.verificationStatus]}</Badge>
                    {d.organizationStatus !== "APPROVED" ? (
                      <Badge tone="neutral">기관 미승인</Badge>
                    ) : null}
                  </div>
                  <div className="mt-0.5 text-[13px] text-muted">
                    {d.specialty ?? "전문과 미등록"} · {d.organizationName} · {d.email}
                  </div>
                </div>
                <div className="flex gap-2">
                  {d.verificationStatus !== "VERIFIED" ? (
                    <Button size="sm" variant="success" disabled={busy === d.id} onClick={() => act(d.id, "verify")}>
                      검증 승인
                    </Button>
                  ) : null}
                  {d.verificationStatus === "PENDING" ? (
                    <Button size="sm" variant="danger" disabled={busy === d.id} onClick={() => act(d.id, "reject")}>
                      반려
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
