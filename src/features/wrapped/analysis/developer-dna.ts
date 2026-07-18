import { DAYS, DNA_THRESHOLDS } from "./constants";
import type {
  DeveloperDna,
  DeveloperDnaKey,
  DeveloperDnaProfile,
  WrappedAnalysisInput,
} from "./types";

type ScoreContext = {
  repositoryCount: number;
  activeRepositoryRatio: number;
  longLivedRepositoryRatio: number;
  readmeCoverage: number;
  languageCount: number;
  topicDiversity: number;
  contributionIntensity: number;
  collaborationEvents: number;
  issueEvents: number;
  pullRequestEvents: number;
  pushEvents: number;
  followerSignal: number;
  originalRepositoryRatio: number;
  archivedRepositoryRatio: number;
  freshRepositoryRatio: number;
  languageConcentration: number;
  pinnedRatio: number;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const BALANCE_TARGET = 50;
const TOP_DNA_COUNT = 3;
const MAX_SCORE = 100;

function clampScore(value: number): number {
  return Math.max(0, Math.min(MAX_SCORE, Math.round(value)));
}

function normalize(value: number, threshold: number): number {
  return Math.min(1, value / threshold);
}

function ratio(numerator: number, denominator: number): number {
  if (denominator <= 0) {
    return 0;
  }

  return numerator / denominator;
}

function buildScoreContext(input: WrappedAnalysisInput): ScoreContext {
  const now = Date.now();
  const repositories = input.repositories;
  const repositoryCount = repositories.length;
  const activeRepositoryCount = repositories.filter((repository) => {
    const updatedDays = (now - new Date(repository.updatedAt).getTime()) / MS_PER_DAY;
    return updatedDays <= DAYS.quarter;
  }).length;
  const longLivedRepositoryCount = repositories.filter((repository) => {
    const ageDays = (now - new Date(repository.createdAt).getTime()) / MS_PER_DAY;
    return ageDays >= DAYS.halfYear;
  }).length;
  const freshRepositoryCount = repositories.filter((repository) => {
    const ageDays = (now - new Date(repository.createdAt).getTime()) / MS_PER_DAY;
    return ageDays <= DAYS.halfYear;
  }).length;
  const archivedRepositoryCount = repositories.filter((repository) => repository.archived).length;
  const originalRepositoryCount = repositories.filter((repository) => !repository.fork).length;
  const readmeRepositoryCount = repositories.filter((repository) => {
    const text = `${repository.name} ${repository.description ?? ""}`.toLowerCase();
    return text.includes("readme") || text.includes("docs") || text.includes("guide");
  }).length;
  const languageCount = input.metrics.languageStats.length;
  const topLanguageRatio = ratio(input.metrics.languageStats[0]?.count ?? 0, repositoryCount);
  const topicDiversity = new Set(
    repositories.flatMap((repository) => repository.topics.map((topic) => topic.toLowerCase())),
  ).size;
  const contributionIntensity = normalize(
    input.contributions.totalContributions,
    DNA_THRESHOLDS.contributionHigh,
  );
  const collaborationEvents =
    input.contributions.pullRequestEvents + input.contributions.issuesEvents;
  const pinnedRatio = ratio(input.pinnedRepositories.length, Math.max(repositoryCount, 1));

  return {
    repositoryCount,
    activeRepositoryRatio: ratio(activeRepositoryCount, repositoryCount),
    longLivedRepositoryRatio: ratio(longLivedRepositoryCount, repositoryCount),
    readmeCoverage: ratio(readmeRepositoryCount, repositoryCount),
    languageCount,
    topicDiversity,
    contributionIntensity,
    collaborationEvents,
    issueEvents: input.contributions.issuesEvents,
    pullRequestEvents: input.contributions.pullRequestEvents,
    pushEvents: input.contributions.pushEvents,
    followerSignal: normalize(input.user.followers, DNA_THRESHOLDS.followersHigh),
    originalRepositoryRatio: ratio(originalRepositoryCount, repositoryCount),
    archivedRepositoryRatio: ratio(archivedRepositoryCount, repositoryCount),
    freshRepositoryRatio: ratio(freshRepositoryCount, repositoryCount),
    languageConcentration: topLanguageRatio,
    pinnedRatio,
  };
}

function buildDnaScore(
  key: DeveloperDnaKey,
  label: string,
  formula: string,
  reason: string,
  description: string,
  score: number,
): DeveloperDna {
  return {
    key,
    label,
    score: clampScore(score),
    formula,
    reason,
    description,
  };
}

function createBuilderDna(context: ScoreContext): DeveloperDna {
  const repositorySignal = normalize(
    context.repositoryCount,
    DNA_THRESHOLDS.repositoriesHigh,
  );
  const activeSignal = normalize(
    context.activeRepositoryRatio,
    DNA_THRESHOLDS.activeRepositoryRatioHigh,
  );
  // Why this weighting:
  // Builderは「量」よりも「継続的に届ける行動」を重視したいため、
  // Repo数・直近更新率・Contribution密度をバランス配点する。
  const score = repositorySignal * 40 + activeSignal * 35 + context.contributionIntensity * 25;

  return buildDnaScore(
    "builder",
    "ビルダー",
    "リポジトリ量 40% + 直近更新率 35% + コントリビューション密度 25%",
    "継続的に作って届ける傾向は、公開レポジトリ数・最近の更新率・イベント量の3点で最も表れやすいため。",
    "機能を形にして積み上げる、実装ドリブンの開発者。",
    score,
  );
}

function createExplorerDna(context: ScoreContext): DeveloperDna {
  const languageSignal = normalize(
    context.languageCount,
    DNA_THRESHOLDS.languageDiversityHigh,
  );
  const topicSignal = normalize(context.topicDiversity, DNA_THRESHOLDS.topicDiversityHigh);
  const freshSignal = normalize(context.freshRepositoryRatio, 0.55);
  const score = languageSignal * 45 + topicSignal * 35 + freshSignal * 20;

  return buildDnaScore(
    "explorer",
    "エクスプローラー",
    "言語多様性 45% + トピック多様性 35% + 新規リポジトリ比率 20%",
    "技術探索は『使う言語の幅』『扱う分野の幅』『新しい試行』に強く現れるため。",
    "未知の領域に手を伸ばし、技術の地図を広げる探求者。",
    score,
  );
}

function createMaintainerDna(context: ScoreContext): DeveloperDna {
  const longevitySignal = normalize(context.longLivedRepositoryRatio, 0.6);
  const activeSignal = normalize(
    context.activeRepositoryRatio,
    DNA_THRESHOLDS.activeRepositoryRatioMedium,
  );
  const readmeSignal = normalize(context.readmeCoverage, DNA_THRESHOLDS.readmeCoverageHigh);
  const archivePenalty = normalize(context.archivedRepositoryRatio, 0.4) * 20;
  const score = longevitySignal * 40 + activeSignal * 35 + readmeSignal * 25 - archivePenalty;

  return buildDnaScore(
    "maintainer",
    "メンテナー",
    "長期運用リポジトリ率 40% + 活動中リポジトリ率 35% + 文書網羅率 25% - アーカイブ補正",
    "保守性は『長く使われる資産を更新し続ける力』と『ドキュメント化』で判断しやすいため。",
    "既存資産を丁寧に守り、寿命を伸ばすメンテナー。",
    score,
  );
}

function createCollaboratorDna(context: ScoreContext): DeveloperDna {
  const collaborationSignal = normalize(context.collaborationEvents, 60);
  const followerSignal = context.followerSignal;
  const pinnedSignal = normalize(context.pinnedRatio, 0.25);
  const score = collaborationSignal * 55 + followerSignal * 30 + pinnedSignal * 15;

  return buildDnaScore(
    "collaborator",
    "コラボレーター",
    "PR/Issue活動 55% + フォロワー影響度 30% + ピン留め公開姿勢 15%",
    "協働性はコード以外の対話行動に現れやすく、PR/Issue比重を高めて評価するため。",
    "チームの流れを作り、周囲と価値を共創するコラボレーター。",
    score,
  );
}

function createExperimenterDna(context: ScoreContext): DeveloperDna {
  const freshSignal = normalize(context.freshRepositoryRatio, 0.6);
  const languageSignal = normalize(
    context.languageCount,
    DNA_THRESHOLDS.languageDiversityMedium,
  );
  const topicSignal = normalize(context.topicDiversity, 10);
  const score = freshSignal * 45 + languageSignal * 30 + topicSignal * 25;

  return buildDnaScore(
    "experimenter",
    "実験者",
    "新規リポジトリ比率 45% + 言語幅 30% + 分野幅 25%",
    "実験志向は『新しいプロジェクトを立てる頻度』と『異なる技術を試す行動』に反映されるため。",
    "仮説を素早く形にし、学習ループを回す実験者。",
    score,
  );
}

function createTeacherDna(context: ScoreContext): DeveloperDna {
  const docsSignal = normalize(context.readmeCoverage, 0.7);
  const issueSignal = normalize(context.issueEvents, 25);
  const followerSignal = context.followerSignal;
  const score = docsSignal * 50 + issueSignal * 25 + followerSignal * 25;

  return buildDnaScore(
    "teacher",
    "ティーチャー",
    "ドキュメント整備率 50% + Issue対応 25% + フォロワー影響度 25%",
    "知識共有はREADME/Docs整備と、Issue上の説明・案内の継続行動が最も観測しやすいため。",
    "ナレッジを言語化し、学習を広げるティーチャー。",
    score,
  );
}

function createCreatorDna(context: ScoreContext): DeveloperDna {
  const originalSignal = normalize(context.originalRepositoryRatio, 0.85);
  const repositorySignal = normalize(
    context.repositoryCount,
    DNA_THRESHOLDS.repositoriesMedium,
  );
  const contributionSignal = context.contributionIntensity;
  const score = originalSignal * 45 + repositorySignal * 30 + contributionSignal * 25;

  return buildDnaScore(
    "creator",
    "クリエイター",
    "オリジナルリポジトリ比率 45% + リポジトリ量 30% + コントリビューション密度 25%",
    "創作傾向はフォークではなく自作資産を増やす行動に現れるため、オリジナル比率を重視。",
    "新しい価値をゼロから生み出すクリエイター。",
    score,
  );
}

function createSpecialistDna(context: ScoreContext): DeveloperDna {
  const concentrationSignal = normalize(context.languageConcentration, 0.7);
  const depthSignal = normalize(context.pushEvents, 90);
  const stabilitySignal = 1 - normalize(context.languageCount, 8);
  const score = concentrationSignal * 50 + depthSignal * 30 + stabilitySignal * 20;

  return buildDnaScore(
    "specialist",
    "スペシャリスト",
    "主要言語集中度 50% + プッシュ深度 30% + スタック収束度 20%",
    "専門性は『特定領域への集中』と『反復的な実装深度』で測るのが現実的なため。",
    "1領域を深く掘り、完成度を高めるスペシャリスト。",
    score,
  );
}

function createGeneralistDna(context: ScoreContext): DeveloperDna {
  const languageSignal = normalize(
    context.languageCount,
    DNA_THRESHOLDS.languageDiversityHigh,
  );
  const topicSignal = normalize(context.topicDiversity, DNA_THRESHOLDS.topicDiversityHigh);
  const concentrationBalance = 1 - normalize(context.languageConcentration, 0.9);
  const score = languageSignal * 40 + topicSignal * 35 + concentrationBalance * 25;

  return buildDnaScore(
    "generalist",
    "ジェネラリスト",
    "言語多様性 40% + トピック多様性 35% + 言語分散バランス 25%",
    "ジェネラリストは幅広い分野にまたがる実装履歴と、単一技術への偏りの低さに現れるため。",
    "複数領域を横断し、接続するジェネラリスト。",
    score,
  );
}

function createDebuggerDna(context: ScoreContext): DeveloperDna {
  const issueSignal = normalize(context.issueEvents, 30);
  const pullRequestSignal = normalize(context.pullRequestEvents, 30);
  const maintainerSignal = normalize(context.activeRepositoryRatio, 0.5);
  const score = issueSignal * 40 + pullRequestSignal * 25 + maintainerSignal * 35;

  return buildDnaScore(
    "debugger",
    "デバッガー",
    "Issue対応 40% + PR対応 25% + 継続保守率 35%",
    "不具合解決はIssue/PRの反復と、既存資産を継続的に更新する行動に強く現れるため。",
    "問題を切り分けて解決へ導くデバッガー。",
    score,
  );
}

function getBalanceScore(dna: DeveloperDna[]): number {
  const averageDistance =
    dna.reduce((acc, item) => acc + Math.abs(item.score - BALANCE_TARGET), 0) / dna.length;
  return clampScore(MAX_SCORE - averageDistance * 2);
}

export function buildDeveloperDnaProfile(input: WrappedAnalysisInput): DeveloperDnaProfile {
  const context = buildScoreContext(input);
  const dna = [
    createBuilderDna(context),
    createExplorerDna(context),
    createMaintainerDna(context),
    createCollaboratorDna(context),
    createExperimenterDna(context),
    createTeacherDna(context),
    createCreatorDna(context),
    createSpecialistDna(context),
    createGeneralistDna(context),
    createDebuggerDna(context),
  ].sort((a, b) => b.score - a.score);

  return {
    dna,
    dominantDna: dna[0],
    topDnaKeys: dna.slice(0, TOP_DNA_COUNT).map((item) => item.key),
    balanceScore: getBalanceScore(dna),
  };
}
