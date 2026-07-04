# MediView Admin (Next.js)

MediView **관리자 콘솔**. 백엔드 관리 API에 붙어 승인 워크플로·대시보드·사용자 관리·보고서를 제공한다.
디자인 토큰은 랜딩과 동일한 [`../design/DESIGN_SYSTEM.md`](../design/DESIGN_SYSTEM.md)를 따른다.

## 실행

```bash
cd admin
npm install
npm run dev      # http://localhost:3001
```

`NEXT_PUBLIC_API_URL`(기본 `http://localhost:8080`)로 백엔드 주소를 지정한다.
로그인은 **ADMIN 권한 계정**만 가능하다(백엔드 RBAC).

## 화면
- **로그인** `/login` — `/api/auth/login` (ADMIN만)
- **대시보드** `/` — `/api/admin/stats/overview` (사용자/예약/매출/KYC)
- **기관 승인** `/organizations` — 목록 + 승인/반려/정지
- **사용자** `/users` — 목록/검색 + 정지/활성화(세션 회수)
- **보고서** `/reports` — 월별 집계 생성 + 목록 + CSV 다운로드

## 연동
- `lib/api.ts` — `ApiResponse<T>` 봉투 언랩, Bearer 토큰(localStorage)
- 인증 가드: `app/(dash)/layout.tsx` — 토큰 없으면 `/login`
- CORS: 백엔드가 `localhost:*` 허용(운영은 prod 프로파일에서 도메인 지정)
