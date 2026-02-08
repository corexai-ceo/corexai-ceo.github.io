/* =================================================
   Core X AI - Risk Rule Engine v1.2
   Multi-Category + Domain Trust + Pattern Hybrid
   ================================================= */

/* -----------------------------
   도메인 추출
----------------------------- */
function extractDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (e) {
    return url.toLowerCase();
  }
}

/* -----------------------------
   위험 점수 계산
----------------------------- */
function calculateRiskScore(input) {
  const domain = extractDomain(input);
  const text = domain.toLowerCase();
  let score = 0;

  /* ============================
     1. 카테고리별 키워드 사전
     (확장 가능 구조)
  ============================ */

  const riskKeywordMap = {
    gambling: [
      "casino", "bet", "slot", "gambling",
      "poker", "baccarat", "roulette",
      "sports", "odds", "win", "vip","hoc"
    ],
    adult: [
      "porn", "sex", "xxx", "adult",
      "cam", "escort", "nude", "18", "av", "miss"
    ],
    illegal: [
      "drug", "weed", "coke", "herb",
      "hack", "crack", "torrent"
    ]
  };

  Object.values(riskKeywordMap).forEach(keywordList => {
    keywordList.forEach(k => {
      if (text.includes(k)) score += 25;
    });
  });

  /* ============================
     2. 숫자 포함 여부
  ============================ */
  if (/\d/.test(text)) score += 15;

  /* ============================
     3. 연속 숫자 (자동 생성형)
  ============================ */
  if (/\d{2,}/.test(text)) score += 25;

  /* ============================
     4. 하이픈 포함
  ============================ */
  if (text.includes("-")) score += 15;

  /* ============================
     5. 도메인 길이 패턴
  ============================ */
  const name = text.split(".")[0];
  if (name.length >= 8 && name.length <= 12) score += 10;

  /* ============================
     6. 저신뢰 TLD (가중치)
  ============================ */
  const lowTrustTLDs = [
    ".ws", ".ink", ".xyz", ".top", ".vip",
    ".club", ".online", ".live", ".cc", ".pw", ".org", ".gg"
  ];

  lowTrustTLDs.forEach(tld => {
    if (text.endsWith(tld)) score += 20;
  });

  /* ============================
     7. 고신뢰 TLD (감점)
  ============================ */
  const highTrustTLDs = [
    ".kr", ".go.kr", ".ac.kr", ".edu"
  ];

  highTrustTLDs.forEach(tld => {
    if (text.endsWith(tld)) score -= 20;
  });

  /* ============================
     8. 중립 TLD (영향 없음)
  ============================ */
  const neutralTLDs = [".ai", ".io", ".dev", ".tech"];

  neutralTLDs.forEach(tld => {
    if (text.endsWith(tld)) score += 0;
  });

  return Math.max(0, Math.min(score, 100));
}

/* -----------------------------
   점수 → 위험도
----------------------------- */
function getRiskLevel(score) {
  if (score >= 70) {
    return { label: "높음", color: "#c0392b" };
  }
  if (score >= 40) {
    return { label: "중간", color: "#e67e22" };
  }
  return { label: "낮음", color: "#27ae60" };
}

/* -----------------------------
   AI 판단 근거 생성 (연출용)
----------------------------- */
function generateAIDecisionReason(score) {
  if (score >= 70) {
    return "도메인 신뢰도, 구조적 패턴 및 다중 유해 콘텐츠 학습 데이터와의 유사도가 높게 분석되었습니다.";
  }
  if (score >= 40) {
    return "일부 위험 신호가 탐지되었으며, 추가적인 정밀 분석이 필요한 상태로 판단됩니다.";
  }
  return "현재 분석 범위 내에서는 유해 위험 가능성이 낮은 것으로 판단됩니다.";
}
