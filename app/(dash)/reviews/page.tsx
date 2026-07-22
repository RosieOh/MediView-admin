"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, SkeletonRows, EmptyState, Badge, Button, PageHeader, ErrorBox } from "@/components/ui";
import type { AdminReview } from "@/lib/types";

function Stars({ n }: { n: number }) {
  return (
    <span className="text-[13px] tracking-tight text-warning" aria-label={`${n}점`}>
      {"★".repeat(n)}
      <span className="text-line">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  const load = () => {
    setReviews(null);
    api<AdminReview[]>("/api/admin/reviews")
      .then(setReviews)
      .catch((e) => setError(e.message));
  };
  useEffect(load, []);

  const remove = async (id: number) => {
    if (!confirm("이 리뷰를 삭제할까요? 되돌릴 수 없습니다.")) return;
    setBusy(id);
    try {
      await api(`/api/admin/reviews/${id}`, { method: "DELETE" });
      setReviews((prev) => prev?.filter((r) => r.id !== id) ?? null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "삭제 실패");
    } finally {
      setBusy(null);
    }
  };

  if (error) return <ErrorBox message={error} />;

  return (
    <div>
      <PageHeader title="리뷰 관리" subtitle="최근 진료 후기를 검토하고 부적절한 리뷰를 삭제합니다" />

      {!reviews ? (
        <SkeletonRows />
      ) : reviews.length === 0 ? (
        <Card className="mt-4"><EmptyState title="등록된 리뷰가 없습니다" hint="환자가 진료 후 리뷰를 남기면 이곳에 표시됩니다." /></Card>
      ) : (
        <Card className="mt-4 overflow-hidden">
          <div className="divide-y divide-line">
            {reviews.map((r) => (
              <div key={r.id} className="flex flex-wrap items-start gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Stars n={r.rating} />
                    <span className="text-[13px] font-semibold text-content">{r.doctorName ?? "의료진"}</span>
                    <Badge tone="neutral">{r.patientName ?? "익명"}</Badge>
                  </div>
                  {r.comment ? (
                    <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{r.comment}</p>
                  ) : (
                    <p className="mt-1.5 text-[13px] italic text-subtle">코멘트 없음</p>
                  )}
                </div>
                <Button size="sm" variant="danger" disabled={busy === r.id} onClick={() => remove(r.id)}>
                  삭제
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
