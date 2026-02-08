/* ===============================
   Core X AI - Risk Rule Engine v1.2
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
  if (/\d/.test(text)) score += 20;

  /* =====================
     3. 연속 숫자
  ===================== */
  if (/\d{2,}/.test(text)) score += 30;

  /* =====================
     4. 하이픈 포함
  ===================== */
  if (text.includes("-")) score += 15;

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

  /* =====================
     7. 자동 생성형 도메인 패턴 (핵심!)
     숫자 + 하이픈 조합
  ===================== */
  if (/\d/.test(text) && text.includes("-")) {
    score += 25;
  }

  return Math.min(score, 100);
}

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

/* =====================
   AI 판단 근거 생성
===================== */
function generateAIDecisionReason(score) {
  if (score >= 70) {
    return "도메인 생성 패턴, 구조적 특성 및 기존 유해사이트 학습 데이터와의 유사도가 높게 나타났습니다.";
  }
  if (score >= 40) {
    return "일부 위험 패턴이 탐지되었으나, 명확한 유해성 판단을 위해 추가 분석이 필요한 상태입니다.";
  }
  return "현재까지 분석된 패턴에서는 유해 위험 신호가 낮은 것으로 판단됩니다.";
}
