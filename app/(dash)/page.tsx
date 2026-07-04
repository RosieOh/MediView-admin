"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, Spinner, fmtWon, ErrorBox } from "@/components/ui";
import type { Overview } from "@/lib/types";

const roleLabel: Record<string, string> = { PATIENT: "환자", DOCTOR: "의료진", ADMIN: "관리자" };
const apptLabel: Record<string, string> = {
  SCHEDULED: "예약",
  WAITING: "대기",
  IN_PROGRESS: "진행",
  COMPLETED: "완료",
  CANCELLED: "취소",
  NO_SHOW: "미방문",
};

export default function Dashboard() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Overview>("/api/admin/stats/overview")
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <ErrorBox message={error} />;
  if (!data) return <Spinner />;

  const stats = [
    { label: "전체 사용자", value: data.totalUsers.toLocaleString() },
    { label: "전체 예약", value: data.totalAppointments.toLocaleString() },
    { label: "순매출", value: fmtWon(data.netRevenue) },
    { label: "본인확인 완료", value: data.verifiedKyc.toLocaleString() },
  ];

  return (
    <div>
      <h1 className="text-[26px] font-bold text-content">대시보드</h1>
      <p className="mt-1 text-[14px] text-muted">플랫폼 현황 한눈에 보기</p>

      <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="text-[13px] text-muted">{s.label}</div>
            <div className="mt-1.5 text-[26px] font-extrabold tracking-tight text-content [font-variant-numeric:tabular-nums]">
              {s.value}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-[16px] font-bold text-content">역할별 사용자</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(data.usersByRole).map(([k, v]) => (
              <Bar key={k} label={roleLabel[k] ?? k} value={v} total={data.totalUsers} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-[16px] font-bold text-content">예약 상태</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(data.appointmentsByStatus)
              .filter(([, v]) => v > 0)
              .map(([k, v]) => (
                <Bar key={k} label={apptLabel[k] ?? k} value={v} total={data.totalAppointments} />
              ))}
            {data.totalAppointments === 0 ? (
              <p className="text-[14px] text-muted">예약 데이터가 없습니다.</p>
            ) : null}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-[16px] font-bold text-content">결제 요약</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KV label="결제 건수" value={`${data.paidPaymentCount}건`} />
          <KV label="총매출" value={fmtWon(data.grossRevenue)} />
          <KV label="환불액" value={fmtWon(data.refundedAmount)} />
          <KV label="순매출" value={fmtWon(data.netRevenue)} strong />
        </div>
      </Card>
    </div>
  );
}

function Bar({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-[14px]">
        <span className="text-muted">{label}</span>
        <span className="font-semibold text-content [font-variant-numeric:tabular-nums]">{value}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function KV({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <div className="text-[13px] text-muted">{label}</div>
      <div
        className={`mt-0.5 text-[17px] font-bold [font-variant-numeric:tabular-nums] ${
          strong ? "text-brand-ink" : "text-content"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
