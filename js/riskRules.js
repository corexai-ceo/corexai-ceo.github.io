/* ===============================
   Core X AI - Risk Rule Engine v1.1
   Domain Pattern + Keyword Hybrid
   =============================== */

/* 도메인 추출 */
function extractDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (e) {
    return url.toLowerCase();
  }
}

/* 위험 점수 계산 */
function calculateRiskScore(input) {
  const domain = extractDomain(input);
  const text = domain.toLowerCase();
  let score = 0;

  /* =====================
     1. 키워드 기반
  ===================== */
  const highRiskKeywords = [
    "casino", "bet", "slot", "gambling",
    "poker", "baccarat", "roulette"
  ];

  highRiskKeywords.forEach(k => {
    if (text.includes(k)) score += 30;
  });

  /* =====================
     2. 숫자 포함 여부
  ===================== */
  if (/\d/.test(text)) {
    score += 20;   // 숫자 포함
  }

  /* =====================
     3. 연속 숫자
  ===================== */
  if (/\d{2,}/.test(text)) {
    score += 30;   // 2자리 이상 연속 숫자
  }

  /* =====================
     4. 하이픈 포함
  ===================== */
  if (text.includes("-")) {
    score += 15;
  }

  /* =====================
     5. 도메인 길이 (자동 생성형)
  ===================== */
  const name = text.split(".")[0];
  if (name.length >= 8 && name.length <= 12) {
    score += 10;
  }

  /* =====================
     6. TLD 패턴
  ===================== */
  if (text.endsWith(".bet")) score += 40;
  if (text.endsWith(".com")) score += 10;
  if (text.endsWith(".kr")) score -= 20;

  return Math.min(score, 100);
}
/* =====================
   7. 자동 생성형 도메인 패턴
   ===================== */
if (/\d/.test(text) && text.includes("-")) {
  score += 25;
}
return Math.min(score, 100);

/* 점수 → 위험도 변환 */
function getRiskLevel(score) {
  if (score >= 70) {
    return { label: "높음", color: "#c0392b" };
  }
  if (score >= 40) {
    return { label: "중간", color: "#e67e22" };
  }
  return { label: "낮음", color: "#27ae60" };
}
