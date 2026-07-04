"use client";

import { useEffect, useState } from "react";
import { api, API_URL, getToken } from "@/lib/api";
import { Card, Spinner, Button, PageHeader, ErrorBox, fmtWon } from "@/components/ui";
import type { PeriodReport, ReportListItem } from "@/lib/types";

export default function ReportsPage() {
  const [list, setList] = useState<ReportListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState(defaultPeriod());
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<PeriodReport | null>(null);

  const load = () => {
    api<ReportListItem[]>("/api/admin/reports/quarterly")
      .then(setList)
      .catch((e) => setError(e.message));
  };
  useEffect(load, []);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await api<PeriodReport>(
        `/api/admin/reports/quarterly?period=${encodeURIComponent(period)}`,
        { method: "POST" }
      );
      setResult(res);
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "생성 실패");
    } finally {
      setGenerating(false);
    }
  };

  const download = async (id: number) => {
    // 인증 헤더가 필요하므로 fetch 후 blob 다운로드
    try {
      const res = await fetch(`${API_URL}/api/admin/reports/${id}/download`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const text = await res.text();
      const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${id}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("다운로드 실패");
    }
  };

  if (error) return <ErrorBox message={error} />;

  return (
    <div>
      <PageHeader title="보고서" subtitle="월별 집계 보고서 생성 및 다운로드" />

      <Card className="mt-6 p-6">
        <div className="flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-muted">기간 (yyyy-MM)</span>
            <input
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="2026-07"
              className="h-10 w-40 rounded-lg border border-line bg-surface px-3.5 text-[14px] text-content outline-none focus:border-brand [font-variant-numeric:tabular-nums]"
            />
          </label>
          <Button onClick={generate} disabled={generating}>
            {generating ? "생성 중…" : "보고서 생성"}
          </Button>
        </div>

        {result ? (
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-4">
            <KV label="신규 사용자" value={`${result.newUsers}`} />
            <KV label="신규 예약" value={`${result.newAppointments}`} />
            <KV label="순매출" value={fmtWon(result.netRevenue)} />
            <KV label="플랫폼 수수료" value={fmtWon(result.platformFee)} strong />
          </div>
        ) : null}
      </Card>

      <h2 className="mt-8 text-[16px] font-bold text-content">생성된 보고서</h2>
      {!list ? (
        <Spinner />
      ) : list.length === 0 ? (
        <Card className="mt-3 p-8 text-center text-[14px] text-muted">생성된 보고서가 없습니다.</Card>
      ) : (
        <Card className="mt-3 overflow-hidden">
          <div className="divide-y divide-line">
            {list.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <div className="font-semibold text-content [font-variant-numeric:tabular-nums]">{r.period}</div>
                  <div className="text-[13px] text-muted">
                    생성 #{r.id} · 작성자 {r.generatedBy}
                  </div>
                </div>
                <Button size="sm" variant="secondary" onClick={() => download(r.id)}>
                  CSV 다운로드
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function KV({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <div className="text-[13px] text-muted">{label}</div>
      <div className={`mt-0.5 text-[17px] font-bold [font-variant-numeric:tabular-nums] ${strong ? "text-brand-ink" : "text-content"}`}>
        {value}
      </div>
    </div>
  );
}

function defaultPeriod() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
