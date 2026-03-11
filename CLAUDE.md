# CLAUDE.md — 주식회사 올빼미와수달 (Owl & Otter Co., Ltd.) 웹사이트

## 프로젝트 개요

한국 인디게임 개발사 **주식회사 올빼미와수달**의 공식 회사 소개 웹사이트.
KOCCA 지원사업 심사위원, 투자자, 파트너사가 주요 방문 대상.

- **회사명 (KR)**: 주식회사 올빼미와수달
- **회사명 (EN)**: Owl & Otter Co., Ltd.
- **업종**: 게임 소프트웨어 개발 및 공급
- **소재지**: 경기도 용인시 수지구
- **도메인**: 준비 완료 (별도 확인)

---

## 기술 스택 (최저 비용 원칙)

### 호스팅 전략: 완전 무료
```
도메인 (기준비) → Cloudflare (DNS + CDN, 무료)
                → GitHub Pages (호스팅, 무료)
```

**선택 이유**
- GitHub Pages: 정적 사이트 무료 호스팅, SSL 자동 제공
- Cloudflare: 무료 DNS + CDN + DDoS 방어
- 월 유지비: **0원** (도메인 갱신비 제외)

### 개발 스택
- **언어**: HTML5 + CSS3 + Vanilla JS (빌드 도구 없음)
- **의존성**: 외부 라이브러리 최소화
- **폰트**: Google Fonts (무료)
- **아이콘**: 없거나 SVG 인라인
- **CMS**: 없음 (정적 HTML 직접 편집)

### 디렉토리 구조
```
/
├── index.html          # 메인 (회사 소개)
├── games.html          # 게임/프로젝트 소개 (추후 추가)
├── about.html          # 팀 소개
├── contact.html        # 연락처
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   └── logo/
└── CNAME               # GitHub Pages 커스텀 도메인 설정
```

---

## 배포 방법

### GitHub Pages 설정
1. GitHub 저장소 생성: `owlotter-website` (public)
2. Settings → Pages → Source: `main` 브랜치 `/root`
3. Custom domain: 보유 도메인 입력
4. CNAME 파일 루트에 생성 (도메인명만 기재)

### Cloudflare DNS 설정
```
Type: CNAME
Name: www (또는 @)
Target: [github-username].github.io
Proxy: ON (주황 구름)
```

### 배포 명령어
```bash
git add .
git commit -m "update"
git push origin main
# → 자동 배포 (1~2분 소요)
```

---

## 웹사이트 요구사항

### 필수 포함 내용
- [ ] 회사명 (한/영)
- [ ] 사업자등록번호
- [ ] 대표자명
- [ ] 회사 주소
- [ ] 연락처 (이메일)
- [ ] 사업목적 (게임 소프트웨어 개발 및 공급)
- [ ] 설립연도 (2026)

### KOCCA 지원사업 대비 항목
- 회사 소개 (비전, 미션)
- 개발 중인 게임/프로젝트 소개
- 팀 구성 (대표이사 소개)
- 보도자료/수상 이력 (추후)

### 디자인 방향
- 인디게임 개발사 정체성 반영
- 올빼미(Owl) + 수달(Otter) 브랜드 아이덴티티
- 한국어 기본, 영어 병기 (글로벌 지원사업 대비)
- 모바일 반응형 필수

---

## 개발 우선순위

```
Phase 1 (즉시): index.html 단일 페이지 랜딩
  - 회사 소개 섹션
  - 연락처
  - 법적 고지 (사업자정보)

Phase 2 (법인 설립 완료 후): 
  - 게임/프로젝트 페이지
  - 팀 소개

Phase 3 (지원사업 선정 후):
  - 보도자료
  - 채용 페이지
```

---

## 법적 필수 표기 (한국 법인 사이트)

```
상호: 주식회사 올빼미와수달
대표: 오영욱
사업자등록번호: [발급 후 기재]
주소: 경기도 [비상주 오피스 주소로 기재]
이메일 (대외공식): master@owlottergames.com
이메일 (대표개인): ohyoungwook@owlottergames.com
통신판매업: 해당없음 (B2B 서비스만인 경우)
```

---

## 주의사항

- 법인 사업자등록증 발급 후 사업자등록번호 삽입
- 법인 이메일: Google Workspace 멀티 도메인으로 운영
  - `master@owlottergames.com` (정부서류·KOCCA·나라도움 공식용)
  - `ohyoungwook@owlottergames.com` (명함·미팅·파트너용, 기본 계정)
  - master@는 별칭(Alias)으로 추가 — 동일 받은편지함에서 관리
- 이미지/폰트 저작권 주의 — 무료 라이선스만 사용
- GitHub 저장소는 public으로 설정해야 무료 Pages 사용 가능
