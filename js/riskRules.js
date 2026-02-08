/*************************************************
 * Domain Risk Scoring Engine v1.0
 * Core X AI
 * 규칙 기반 유해사이트 1차 판별 엔진
 *************************************************/

// URL에서 도메인만 추출
function extractDomain(url) {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .toLowerCase();
}

// 위험 점수 계산
function calculateRiskScore(url) {
  let score = 0;
  const domain = extractDomain(url);
  const name = domain.split(".")[0];

  /* ==========================
     Rule 1. 숫자 포함 여부
  ========================== */
  if (/\d/.test(domain)) {
    score += 25;
  }

  /* ==========================
     Rule 2. 연속 숫자 (2자리 이상)
  ========================== */
  if (/\d{2,}/.test(domain)) {
    score += 30;
  }

  /* ==========================
     Rule 3. 하이픈 포함
  ========================== */
  if (domain.includes("-")) {
    score += 20;
  }

  /* ==========================
     Rule 4. 도메인 길이 (자동 생성형)
  ========================== */
  if (name.length >= 8 && name.length <= 12) {
    score += 10;
  }

  /* ==========================
     Rule 5. TLD 패턴
  ========================== */
  if (domain.endsWith(".bet")) score += 40;
  if (domain.endsWith(".com")) score += 10;
  if (domain.endsWith(".kr")) score -= 20;

  return score;
}

// 점수를 위험도 등급으로 변환
function getRiskLevel(score) {
  if (score >= 50) {
    return {
      level: "HIGH",
      label: "고위험",
      color: "#c0392b"
    };
  }

  if (score >= 30) {
    return {
      level: "MEDIUM",
      label: "의심",
      color: "#e67e22"
    };
  }

  return {
    level: "LOW",
    label: "낮음",
    color: "#27ae60"
  };
}
