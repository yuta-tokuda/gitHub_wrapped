import type { MvpDiagnostic, WrappedAnalysisInput } from "./types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DAYS = {
  week: 7,
  month: 30,
  quarter: 90,
  year: 365,
} as const;

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function ratio(numerator: number, denominator: number): number {
  if (denominator <= 0) {
    return 0;
  }
  return numerator / denominator;
}

function getRecentUpdatedRepositoryCount(
  repositories: WrappedAnalysisInput["repositories"],
  days: number,
): number {
  const now = Date.now();
  return repositories.filter((repository) => {
    const diffDays = (now - new Date(repository.updatedAt).getTime()) / MS_PER_DAY;
    return diffDays <= days;
  }).length;
}

function getNightPushRatio(repositories: WrappedAnalysisInput["repositories"]): number {
  const nightCount = repositories.filter((repository) => {
    const hour = new Date(repository.pushedAt).getHours();
    return hour >= 0 && hour <= 5;
  }).length;
  return ratio(nightCount, repositories.length);
}

function getWeekendPushRatio(repositories: WrappedAnalysisInput["repositories"]): number {
  const weekendCount = repositories.filter((repository) => {
    const day = new Date(repository.pushedAt).getDay();
    return day === 0 || day === 6;
  }).length;
  return ratio(weekendCount, repositories.length);
}

function getReadmeCoverage(input: WrappedAnalysisInput): number {
  const documentedCount = input.repositories.filter((repository) => {
    const text = `${repository.name} ${repository.description ?? ""}`.toLowerCase();
    return text.includes("readme") || text.includes("docs") || text.includes("guide");
  }).length;
  return ratio(documentedCount, input.repositories.length);
}

function createNightOwl(input: WrappedAnalysisInput): MvpDiagnostic {
  const nightRatio = getNightPushRatio(input.repositories);
  const score = clampScore(Math.min(1, nightRatio / 0.45) * 100);

  return {
    key: "night-owl-index",
    title: "夜型コーダー指数",
    score,
    diagnosis: nightRatio >= 0.35 ? "夜の集中力が高いタイプ" : "日中バランス型",
    analysisResult:
      nightRatio >= 0.35
        ? "深夜帯の更新が多く、夜に集中して実装する傾向が明確です。"
        : "深夜偏重は弱く、時間帯を分散して安定的に開発しています。",
    valueLabel: `深夜更新率 ${(nightRatio * 100).toFixed(1)}%`,
    evidence: [
      `深夜更新率 ${(nightRatio * 100).toFixed(1)}%`,
      `対象リポジトリ ${input.repositories.length}件`,
    ],
    funScore: 4,
    implementationDifficulty: 2,
    formula: "0-5時更新比率を45%基準でスコア化",
    shareText: `夜型コーダー指数 ${score}/100（深夜更新 ${(nightRatio * 100).toFixed(1)}%）`,
  };
}

function createWeekendWarrior(input: WrappedAnalysisInput): MvpDiagnostic {
  const weekendRatio = getWeekendPushRatio(input.repositories);
  const score = clampScore(Math.min(1, weekendRatio / 0.5) * 100);

  return {
    key: "weekend-warrior",
    title: "週末職人度",
    score,
    diagnosis: weekendRatio >= 0.3 ? "週末に伸びるクリエイター型" : "平日ストイック型",
    analysisResult:
      weekendRatio >= 0.3
        ? "週末の活動比率が高く、休日にまとまってアウトプットする傾向があります。"
        : "平日の活動比率が高く、業務日ベースで継続するスタイルです。",
    valueLabel: `週末更新率 ${(weekendRatio * 100).toFixed(1)}%`,
    evidence: [
      `週末更新率 ${(weekendRatio * 100).toFixed(1)}%`,
      `平日更新率 ${((1 - weekendRatio) * 100).toFixed(1)}%`,
    ],
    funScore: 4,
    implementationDifficulty: 2,
    formula: "土日更新比率を50%基準でスコア化",
    shareText: `週末職人度 ${score}/100（週末更新 ${(weekendRatio * 100).toFixed(1)}%）`,
  };
}

function createConsistency(input: WrappedAnalysisInput): MvpDiagnostic {
  const recentCount = getRecentUpdatedRepositoryCount(input.repositories, DAYS.month);
  const score = clampScore(Math.min(1, ratio(recentCount, 14)) * 100);

  return {
    key: "consistency-builder",
    title: "継続開発体質",
    score,
    diagnosis: score >= 70 ? "習慣で積み上げる継続型" : "波で成果を出すスプリント型",
    analysisResult:
      score >= 70
        ? "直近1か月でも更新対象が広く、開発習慣が維持されています。"
        : "活動の波があり、集中的に進める期間と休止期間が分かれる傾向です。",
    valueLabel: `30日以内更新 ${recentCount}件`,
    evidence: [
      `30日以内更新 ${recentCount}件`,
      `全体リポジトリ ${input.repositories.length}件`,
    ],
    funScore: 5,
    implementationDifficulty: 2,
    formula: "30日以内更新リポジトリ数を14件基準で正規化",
    shareText: `継続開発体質 ${score}/100（直近更新 ${recentCount}件）`,
  };
}

function createRepoLauncher(input: WrappedAnalysisInput): MvpDiagnostic {
  const now = Date.now();
  const createdInYear = input.repositories.filter((repository) => {
    const ageDays = (now - new Date(repository.createdAt).getTime()) / MS_PER_DAY;
    return ageDays <= DAYS.year;
  }).length;
  const score = clampScore(Math.min(1, createdInYear / 10) * 100);

  return {
    key: "repo-launcher",
    title: "立ち上げ力",
    score,
    diagnosis: score >= 70 ? "新規立ち上げが速いタイプ" : "厳選して立ち上げるタイプ",
    analysisResult:
      score >= 70
        ? "1年以内に複数の新規リポジトリを立ち上げており、着手スピードが高いです。"
        : "新規作成は慎重で、既存資産を深く育てる傾向が見えます。",
    valueLabel: `1年以内新規 ${createdInYear}件`,
    evidence: [
      `1年以内新規 ${createdInYear}件`,
      `総リポジトリ ${input.repositories.length}件`,
    ],
    funScore: 4,
    implementationDifficulty: 2,
    formula: "1年以内作成リポジトリ数を10件基準でスコア化",
    shareText: `立ち上げ力 ${score}/100（1年以内新規 ${createdInYear}件）`,
  };
}

function createLongRunner(input: WrappedAnalysisInput): MvpDiagnostic {
  const now = Date.now();
  const longLivedCount = input.repositories.filter((repository) => {
    const ageDays = (now - new Date(repository.createdAt).getTime()) / MS_PER_DAY;
    return ageDays >= DAYS.year;
  }).length;
  const score = clampScore(Math.min(1, ratio(longLivedCount, Math.max(input.repositories.length, 1)) / 0.7) * 100);

  return {
    key: "long-runner",
    title: "長期運用体質",
    score,
    diagnosis: score >= 65 ? "育て続けるメンテナー型" : "短期検証のスピード型",
    analysisResult:
      score >= 65
        ? "1年以上運用しているリポジトリ比率が高く、保守継続力が強いです。"
        : "短期間で試すリポジトリが多く、検証スピードを重視する構成です。",
    valueLabel: `長期運用率 ${(ratio(longLivedCount, Math.max(input.repositories.length, 1)) * 100).toFixed(1)}%`,
    evidence: [
      `1年以上運用 ${longLivedCount}件`,
      `長期運用率 ${(ratio(longLivedCount, Math.max(input.repositories.length, 1)) * 100).toFixed(1)}%`,
    ],
    funScore: 4,
    implementationDifficulty: 3,
    formula: "1年以上運用リポジトリ比率を70%基準でスコア化",
    shareText: `長期運用体質 ${score}/100`,
  };
}

function createReadmeLove(input: WrappedAnalysisInput): MvpDiagnostic {
  const readmeCoverage = getReadmeCoverage(input);
  const score = clampScore(readmeCoverage * 100);

  return {
    key: "readme-love",
    title: "README愛",
    score,
    diagnosis: score >= 60 ? "説明上手で伝える力が高い" : "実装先行で伸びしろあり",
    analysisResult:
      score >= 60
        ? "ドキュメント系の記述が多く、第三者が理解しやすい公開スタイルです。"
        : "説明文より実装優先の傾向です。README強化で伝達力が伸びます。",
    valueLabel: `README系記述率 ${(readmeCoverage * 100).toFixed(1)}%`,
    evidence: [
      `README系記述率 ${(readmeCoverage * 100).toFixed(1)}%`,
      `推定対象 ${input.repositories.length}件`,
    ],
    funScore: 5,
    implementationDifficulty: 3,
    formula: "README/Docs系キーワードを含むリポジトリ比率",
    shareText: `README愛 ${score}/100（説明力タイプ診断）`,
  };
}

function createPrFirst(input: WrappedAnalysisInput): MvpDiagnostic {
  const interactionTotal = input.contributions.pushEvents + input.contributions.pullRequestEvents;
  const prRatio = ratio(input.contributions.pullRequestEvents, Math.max(interactionTotal, 1));
  const score = clampScore(Math.min(1, prRatio / 0.4) * 100);

  return {
    key: "pr-first",
    title: "PRファースト度",
    score,
    diagnosis: score >= 60 ? "レビュー文化フィット型" : "実装主導のダイレクト型",
    analysisResult:
      score >= 60
        ? "PRイベント比率が高く、レビューを前提に進める開発フローです。"
        : "直接実装・反映の比率が高く、スピード優先の進め方です。",
    valueLabel: `PR比率 ${(prRatio * 100).toFixed(1)}%`,
    evidence: [
      `PRイベント ${input.contributions.pullRequestEvents}件`,
      `Push+PR合計 ${interactionTotal}件`,
    ],
    funScore: 4,
    implementationDifficulty: 3,
    formula: "PRイベント比率を40%基準で正規化",
    shareText: `PRファースト度 ${score}/100`,
  };
}

function createIssueDriven(input: WrappedAnalysisInput): MvpDiagnostic {
  const issueRatio = ratio(
    input.contributions.issuesEvents,
    Math.max(input.contributions.totalContributions, 1),
  );
  const score = clampScore(Math.min(1, issueRatio / 0.2) * 100);

  return {
    key: "issue-driven",
    title: "Issueドリブン度",
    score,
    diagnosis: score >= 55 ? "課題管理から進める設計型" : "実装起点で前進する型",
    analysisResult:
      score >= 55
        ? "Issue活用の比率が高く、課題を起点に進める傾向があります。"
        : "Issueより実装イベントが中心で、作りながら進める傾向です。",
    valueLabel: `Issue比率 ${(issueRatio * 100).toFixed(1)}%`,
    evidence: [
      `Issueイベント ${input.contributions.issuesEvents}件`,
      `総Contribution ${input.contributions.totalContributions}件`,
    ],
    funScore: 4,
    implementationDifficulty: 3,
    formula: "Issueイベント比率を20%基準で正規化",
    shareText: `Issueドリブン度 ${score}/100`,
  };
}

function createOssImpact(input: WrappedAnalysisInput): MvpDiagnostic {
  const impactRaw = input.metrics.totalStars + input.metrics.totalForks * 2 + input.user.followers * 0.5;
  const score = clampScore(Math.min(1, impactRaw / 1200) * 100);

  return {
    key: "oss-impact",
    title: "OSS波及力",
    score,
    diagnosis: score >= 70 ? "外部に届くコミュニティ牽引型" : "これから伸びるポテンシャル型",
    analysisResult:
      score >= 70
        ? "スター・フォーク・フォロワーの総合値が高く、外部波及が確認できます。"
        : "公開活動の基盤はできており、継続で波及力が伸びる状態です。",
    valueLabel: `影響指標 ${Math.round(impactRaw)}`,
    evidence: [
      `Stars ${input.metrics.totalStars} / Forks ${input.metrics.totalForks}`,
      `Followers ${input.user.followers}`,
    ],
    funScore: 5,
    implementationDifficulty: 3,
    formula: "Stars + Forks×2 + Followers×0.5 を1200基準で正規化",
    shareText: `OSS波及力 ${score}/100`,
  };
}

function createStarVelocity(input: WrappedAnalysisInput): MvpDiagnostic {
  const now = Date.now();
  const repoAges = input.repositories.map(
    (repository) => (now - new Date(repository.createdAt).getTime()) / MS_PER_DAY + 1,
  );
  const velocity = input.repositories.reduce((acc, repository, index) => {
    return acc + repository.stargazersCount / repoAges[index];
  }, 0);
  const score = clampScore(Math.min(1, velocity / 1.8) * 100);

  return {
    key: "star-velocity",
    title: "スター獲得速度",
    score,
    diagnosis: score >= 65 ? "短期で反応を取れる発信型" : "じわ伸びで積み上げる型",
    analysisResult:
      score >= 65
        ? "公開後のスター反応が速く、短期間で注目を集める傾向があります。"
        : "長期で評価が積み上がるタイプで、継続運用と相性が良いです。",
    valueLabel: `日次スター速度 ${velocity.toFixed(2)}`,
    evidence: [
      `日次スター速度 ${velocity.toFixed(2)}`,
      `対象リポジトリ ${input.repositories.length}件`,
    ],
    funScore: 5,
    implementationDifficulty: 4,
    formula: "各Repoの Stars/経過日数 を合算し1.8基準で正規化",
    shareText: `スター獲得速度 ${score}/100`,
  };
}

function createLanguageDiversity(input: WrappedAnalysisInput): MvpDiagnostic {
  const languageCount = input.metrics.languageStats.length;
  const score = clampScore(Math.min(1, languageCount / 8) * 100);

  return {
    key: "language-diversity",
    title: "言語多様性DNA",
    score,
    diagnosis: score >= 65 ? "幅広く戦えるポリグロット型" : "主力集中の専門型",
    analysisResult:
      score >= 65
        ? "言語の幅が広く、課題に合わせて技術選択できる余地が大きいです。"
        : "主力言語に集中しており、専門性を深める構成です。",
    valueLabel: `使用言語 ${languageCount}種`,
    evidence: [
      `使用言語 ${languageCount}種`,
      `主要言語 ${input.metrics.topLanguage ?? "未設定"}`,
    ],
    funScore: 4,
    implementationDifficulty: 2,
    formula: "使用言語数を8言語基準で正規化",
    shareText: `言語多様性DNA ${score}/100`,
  };
}

function createLanguageFocus(input: WrappedAnalysisInput): MvpDiagnostic {
  const topRatio = input.metrics.languageStats[0]?.ratio ?? 0;
  const score = clampScore(Math.min(1, topRatio / 75) * 100);

  return {
    key: "language-focus",
    title: "言語集中DNA",
    score,
    diagnosis: score >= 65 ? "一点突破のスペシャリスト型" : "複数技術のバランス型",
    analysisResult:
      score >= 65
        ? "主要言語への集中が強く、深掘りで成果を出すスタイルです。"
        : "主要言語の偏りが小さく、複数技術を横断して使っています。",
    valueLabel: `主要言語比率 ${topRatio.toFixed(1)}%`,
    evidence: [
      `主要言語比率 ${topRatio.toFixed(1)}%`,
      `言語数 ${input.metrics.languageStats.length}種`,
    ],
    funScore: 4,
    implementationDifficulty: 2,
    formula: "主要言語比率を75%基準で正規化",
    shareText: `言語集中DNA ${score}/100`,
  };
}

function createFrontBackStyle(input: WrappedAnalysisInput): MvpDiagnostic {
  const frontendLanguages = ["typescript", "javascript", "html", "css"];
  const backendLanguages = ["go", "rust", "java", "kotlin", "python", "ruby"];
  const frontCount = input.metrics.languageStats
    .filter((item) => frontendLanguages.includes(item.name.toLowerCase()))
    .reduce((acc, item) => acc + item.count, 0);
  const backCount = input.metrics.languageStats
    .filter((item) => backendLanguages.includes(item.name.toLowerCase()))
    .reduce((acc, item) => acc + item.count, 0);
  const total = Math.max(frontCount + backCount, 1);
  const frontRatio = ratio(frontCount, total);
  const score = clampScore(Math.abs(frontRatio - 0.5) >= 0.25 ? 75 : 55);

  const styleLabel =
    frontRatio >= 0.65 ? "フロント寄りビルダー" : frontRatio <= 0.35 ? "バック寄りビルダー" : "フルスタック寄り";

  return {
    key: "front-back-style",
    title: "フロント/バック傾向",
    score,
    diagnosis: styleLabel,
    analysisResult: `${styleLabel}としての傾向が出ています。扱う言語構成から職能バランスを推定しています。`,
    valueLabel: `Front ${(frontRatio * 100).toFixed(1)}% / Back ${((1 - frontRatio) * 100).toFixed(1)}%`,
    evidence: [
      `フロント推定 ${(frontRatio * 100).toFixed(1)}%`,
      `バック推定 ${((1 - frontRatio) * 100).toFixed(1)}%`,
    ],
    funScore: 4,
    implementationDifficulty: 2,
    formula: "言語マップで Front/Back 件数比率を算出",
    shareText: `開発傾向: ${styleLabel}`,
  };
}

function createExperimentRepoRate(input: WrappedAnalysisInput): MvpDiagnostic {
  const now = Date.now();
  const shortLived = input.repositories.filter((repository) => {
    const ageDays = (now - new Date(repository.createdAt).getTime()) / MS_PER_DAY;
    const updatedGap = (now - new Date(repository.updatedAt).getTime()) / MS_PER_DAY;
    return ageDays <= DAYS.quarter && updatedGap > DAYS.month;
  }).length;
  const shortRatio = ratio(shortLived, Math.max(input.repositories.length, 1));
  const score = clampScore(Math.min(1, shortRatio / 0.35) * 100);

  return {
    key: "experiment-repo-rate",
    title: "実験リポジトリ率",
    score,
    diagnosis: score >= 60 ? "試作を高速で回す実験型" : "長く育てる運用型",
    analysisResult:
      score >= 60
        ? "短期で試すリポジトリ比率が高く、仮説検証サイクルが速いです。"
        : "短命Repoは少なく、継続運用を前提にした構成です。",
    valueLabel: `短期試作率 ${(shortRatio * 100).toFixed(1)}%`,
    evidence: [
      `短期試作 ${shortLived}件`,
      `短期試作率 ${(shortRatio * 100).toFixed(1)}%`,
    ],
    funScore: 5,
    implementationDifficulty: 3,
    formula: "90日以内作成かつ30日以上未更新のRepo比率",
    shareText: `実験リポジトリ率 ${score}/100`,
  };
}

function createTestCulture(input: WrappedAnalysisInput): MvpDiagnostic {
  const testNamed = input.repositories.filter((repository) => {
    const text = `${repository.name} ${repository.description ?? ""}`.toLowerCase();
    return text.includes("test") || text.includes("spec");
  }).length;
  const testRatio = ratio(testNamed, Math.max(input.repositories.length, 1));
  const score = clampScore(Math.min(1, testRatio / 0.4) * 100);

  return {
    key: "test-culture",
    title: "テスト文化度",
    score,
    diagnosis: score >= 60 ? "品質重視の検証型" : "機能先行でこれから整備型",
    analysisResult:
      score >= 60
        ? "テスト系キーワードを持つRepo比率が高く、品質指向が読み取れます。"
        : "テスト関連の公開シグナルは少なめで、今後の整備余地があります。",
    valueLabel: `テスト系Repo比率 ${(testRatio * 100).toFixed(1)}%`,
    evidence: [
      `テスト系Repo ${testNamed}件`,
      `比率 ${(testRatio * 100).toFixed(1)}%`,
    ],
    funScore: 5,
    implementationDifficulty: 4,
    formula: "test/spec関連キーワードのRepo比率を40%基準で正規化",
    shareText: `テスト文化度 ${score}/100`,
  };
}

function createCiMind(input: WrappedAnalysisInput): MvpDiagnostic {
  const automationNamed = input.repositories.filter((repository) => {
    const text = `${repository.name} ${repository.description ?? ""}`.toLowerCase();
    return text.includes("ci") || text.includes("workflow") || text.includes("automation");
  }).length;
  const ciRatio = ratio(automationNamed, Math.max(input.repositories.length, 1));
  const score = clampScore(Math.min(1, ciRatio / 0.25) * 100);

  return {
    key: "ci-mind",
    title: "CI志向度",
    score,
    diagnosis: score >= 55 ? "自動化で回すDX型" : "手動最適化のクラフト型",
    analysisResult:
      score >= 55
        ? "自動化関連のシグナルが観測され、効率化を重視する傾向です。"
        : "自動化より実装・運用の手触りを重視する傾向です。",
    valueLabel: `自動化系Repo比率 ${(ciRatio * 100).toFixed(1)}%`,
    evidence: [
      `自動化系Repo ${automationNamed}件`,
      `比率 ${(ciRatio * 100).toFixed(1)}%`,
    ],
    funScore: 4,
    implementationDifficulty: 4,
    formula: "CI/Workflow関連キーワード比率を25%基準で正規化",
    shareText: `CI志向度 ${score}/100`,
  };
}

function createIssuePrBalance(input: WrappedAnalysisInput): MvpDiagnostic {
  const total = input.contributions.issuesEvents + input.contributions.pullRequestEvents;
  const balance = 1 - Math.abs(ratio(input.contributions.issuesEvents, Math.max(total, 1)) - 0.5) * 2;
  const score = clampScore(balance * 100);

  return {
    key: "issue-pr-balance",
    title: "課題/レビュー均衡度",
    score,
    diagnosis: score >= 65 ? "課題管理とレビューが両立したバランス型" : "どちらかに強みが寄る特化型",
    analysisResult:
      score >= 65
        ? "Issue対応とPR対応の比率が近く、開発プロセスのバランスが良いです。"
        : "IssueまたはPRのどちらかに寄っており、役割特化の傾向があります。",
    valueLabel: `Issue ${input.contributions.issuesEvents} / PR ${input.contributions.pullRequestEvents}`,
    evidence: [
      `Issue ${input.contributions.issuesEvents}件`,
      `PR ${input.contributions.pullRequestEvents}件`,
    ],
    funScore: 4,
    implementationDifficulty: 3,
    formula: "IssueイベントとPRイベントの比率差から均衡スコア化",
    shareText: `課題/レビュー均衡度 ${score}/100`,
  };
}

function createMaintainerRatio(input: WrappedAnalysisInput): MvpDiagnostic {
  const activeQuarter = getRecentUpdatedRepositoryCount(input.repositories, DAYS.quarter);
  const activeRatio = ratio(activeQuarter, Math.max(input.repositories.length, 1));
  const score = clampScore(Math.min(1, activeRatio / 0.65) * 100);

  return {
    key: "maintainer-ratio",
    title: "メンテナー比率",
    score,
    diagnosis: score >= 70 ? "保守を継続できる信頼運用型" : "新規開発寄りのチャレンジ型",
    analysisResult:
      score >= 70
        ? "直近90日での稼働率が高く、継続保守の強さが数値に表れています。"
        : "新規着手の比率が高く、保守より開発に寄った活動構成です。",
    valueLabel: `90日稼働率 ${(activeRatio * 100).toFixed(1)}%`,
    evidence: [
      `90日以内更新 ${activeQuarter}件`,
      `90日稼働率 ${(activeRatio * 100).toFixed(1)}%`,
    ],
    funScore: 4,
    implementationDifficulty: 2,
    formula: "90日以内更新Repo比率を65%基準で正規化",
    shareText: `メンテナー比率 ${score}/100`,
  };
}

function createDeliveryPace(input: WrappedAnalysisInput): MvpDiagnostic {
  const paceRaw =
    input.contributions.pushEvents * 0.5 +
    input.contributions.pullRequestEvents * 1.2 +
    input.contributions.issuesEvents * 0.8;
  const score = clampScore(Math.min(1, paceRaw / 120) * 100);

  return {
    key: "delivery-pace",
    title: "小粒デリバリー指数",
    score,
    diagnosis: score >= 65 ? "小さく速く届けるデリバリー型" : "じっくり仕上げる深掘り型",
    analysisResult:
      score >= 65
        ? "Push/PR/Issueの合成指標が高く、短いサイクルでの出荷傾向が強いです。"
        : "更新は慎重で、1件ごとの仕上げ密度を重視する傾向です。",
    valueLabel: `デリバリー指標 ${paceRaw.toFixed(1)}`,
    evidence: [
      `Push ${input.contributions.pushEvents} / PR ${input.contributions.pullRequestEvents}`,
      `Issue ${input.contributions.issuesEvents} / 合成 ${paceRaw.toFixed(1)}`,
    ],
    funScore: 5,
    implementationDifficulty: 4,
    formula: "Push×0.5 + PR×1.2 + Issue×0.8 を120基準で正規化",
    shareText: `小粒デリバリー指数 ${score}/100`,
  };
}

function createArchetype(input: WrappedAnalysisInput, diagnostics: MvpDiagnostic[]): MvpDiagnostic {
  const builderSignal = diagnostics.find((item) => item.key === "consistency-builder")?.score ?? 0;
  const collaboratorSignal = diagnostics.find((item) => item.key === "pr-first")?.score ?? 0;
  const explorerSignal = diagnostics.find((item) => item.key === "language-diversity")?.score ?? 0;
  const maintainerSignal = diagnostics.find((item) => item.key === "maintainer-ratio")?.score ?? 0;

  const archetypeScore = clampScore(
    builderSignal * 0.35 +
      collaboratorSignal * 0.2 +
      explorerSignal * 0.2 +
      maintainerSignal * 0.25,
  );

  const diagnosis =
    archetypeScore >= 75
      ? "静かな最適化者"
      : archetypeScore >= 60
        ? "実装で引っ張る推進者"
        : "これから伸びる挑戦者";

  return {
    key: "developer-archetype",
    title: "開発者アーキタイプ",
    score: archetypeScore,
    diagnosis,
    analysisResult: `20診断の主要軸（継続性・協働・多様性・保守性）を統合した結果、現在は「${diagnosis}」タイプです。`,
    valueLabel: `統合スコア ${archetypeScore}`,
    evidence: [
      `継続性 ${builderSignal} / 協働 ${collaboratorSignal}`,
      `多様性 ${explorerSignal} / 保守性 ${maintainerSignal}`,
    ],
    funScore: 5,
    implementationDifficulty: 5,
    formula: "継続性/協働/多様性/保守性の加重平均",
    shareText: `あなたの開発者タイプは「${diagnosis}」`,
  };
}

export function buildMvpDiagnostics(input: WrappedAnalysisInput): MvpDiagnostic[] {
  const diagnostics: MvpDiagnostic[] = [
    createNightOwl(input),
    createWeekendWarrior(input),
    createConsistency(input),
    createRepoLauncher(input),
    createLongRunner(input),
    createReadmeLove(input),
    createPrFirst(input),
    createIssueDriven(input),
    createOssImpact(input),
    createStarVelocity(input),
    createLanguageDiversity(input),
    createLanguageFocus(input),
    createFrontBackStyle(input),
    createExperimentRepoRate(input),
    createTestCulture(input),
    createCiMind(input),
    createIssuePrBalance(input),
    createMaintainerRatio(input),
    createDeliveryPace(input),
  ];

  diagnostics.push(createArchetype(input, diagnostics));
  return diagnostics;
}
