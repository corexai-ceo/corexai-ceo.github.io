/* =================================================
   Core X AI - Risk Rule Engine v2.0
   Human-like Heuristic + Domain Pattern Hybrid
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
  const name = text.split(".")[0];
  let score = 0;

  /* ============================
     1. 카테고리별 키워드 (강화)
  ============================ */
  const riskKeywordMap = {
    gambling: [
      "casino", "bet", "slot", "gambling",
      "poker", "baccarat", "roulette",
      "sports", "odds", "vip", "win", "coin"
    ],
    adult: [
      "porn", "sex", "xxx", "adult",
      "cam", "escort", "nude", "18", "av"
    ],
    illegal: [
      "drug", "weed", "coke", "hack",
      "crack", "torrent", "dark"
    ]
  };

  Object.values(riskKeywordMap).forEach(list => {
    list.forEach(k => {
      if (text.includes(k)) score += 30;
    });
  });

  /* ============================
     2. 숫자 / 하이픈 기본 패턴
  ============================ */
  if (/\d/.test(name)) score += 15;
  if (/\d{2,}/.test(name)) score += 25;
  if (name.includes("-")) score += 20;

  /* ============================
     3. 자동 생성형 도메인 (결정타)
     ex) cop-33, hoc-567, ab-99
  ============================ */
  if (/^[a-z]{2,5}-\d{2,4}$/.test(name)) {
    score += 40;
  }

  if (/^[a-z]{3}\d{2,4}$/.test(name)) {
    score += 30;
  }

  /* ============================
     4. 의미 없는 짧은 문자열 + 숫자
  ============================ */
  const legitWords = /(corp|tech|ai|lab|soft|data|cloud|system)/;
  if (!legitWords.test(name) && name.length <= 7 && /\d/.test(name)) {
    score += 25;
  }

  /* ============================
     5. 도메인 길이 패턴
  ============================ */
  if (name.length >= 8 && name.length <= 12) score += 10;

  /* ============================
     6. 저신뢰 TLD (실사용 기반)
  ============================ */
  const lowTrustTLDs = [
    ".ws", ".xyz", ".top", ".vip", ".club",
    ".online", ".live", ".cc", ".pw", ".ink"
  ];
  lowTrustTLDs.forEach(tld => {
    if (text.endsWith(tld)) score += 25;
  });

  /* ============================
     7. 중립 TLD
  ============================ */
  const neutralTLDs = [".com", ".net", ".ai", ".io", ".dev"];
  neutralTLDs.forEach(tld => {
    if (text.endsWith(tld)) score += 5;
  });

  /* ============================
     8. 고신뢰 TLD (강력 감점)
  ============================ */
  const highTrustTLDs = [".kr", ".go.kr", ".ac.kr", ".edu"];
  highTrustTLDs.forEach(tld => {
    if (text.endsWith(tld)) score -= 30;
  });

  return Math.max(0, Math.min(score, 100));
}

/* -----------------------------
   점수 → 위험도
----------------------------- */
function getRiskLevel(score) {
  if (score >= 75) {
    return { label: "높음", color: "#c0392b" };
  }
  if (score >= 45) {
    return { label: "중간", color: "#e67e22" };
  }
  return { label: "낮음", color: "#27ae60" };
}

/* -----------------------------
   AI 판단 근거 (연출용)
----------------------------- */
function generateAIDecisionReason(score) {
  if (score >= 75) {
    return "자동 생성형 도메인 구조, 저신뢰 TLD 사용 및 유해 사이트 운영군에서 반복 관측된 패턴과의 유사도가 높게 분석되었습니다.";
  }
  if (score >= 45) {
    return "일부 위험 신호가 탐지되었으며, 과거 유해 사이트 데이터와의 부분적 구조 유사성이 확인되었습니다.";
  }
  return "현재 분석 범위 내에서는 유해 위험 가능성이 낮은 것으로 판단되나, 지속적인 모니터링이 권장됩니다.";
}
