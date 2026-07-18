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
    "リポジトリ数 40% + 最近の更新 35% + 活動量 25%",
    "作る力は、数だけでなく『最近も動いているか』で差が出やすいからです。",
    "機能を次々に形にして、前へ進めるタイプです。",
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
    "言語の幅 45% + 分野の幅 35% + 新規リポジトリ 20%",
    "探索型の人は、技術の幅と新しい挑戦の回数に特徴が出るからです。",
    "まだ触っていない領域にも、積極的に手を伸ばすタイプです。",
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
    "長く運用中 40% + 稼働中リポジトリ 35% + 文書化 25% - アーカイブ補正",
    "保守の強さは、長く使うコードを更新し続ける姿勢に表れやすいからです。",
    "既存の資産をていねいに育てて、寿命を伸ばすタイプです。",
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
    "PR・Issue活動 55% + フォロワー影響 30% + ピン留め活用 15%",
    "チーム連携は、実装量よりも対話やレビューの回数に出やすいからです。",
    "まわりを巻き込みながら、チームで成果を作るタイプです。",
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
    "新規リポジトリ 45% + 言語の幅 30% + 分野の幅 25%",
    "実験型の動きは、新しい試作をどれだけ回しているかに表れやすいからです。",
    "仮説をすぐ試して、学びを高速で回すタイプです。",
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
    "文書整備 50% + Issue対応 25% + フォロワー影響 25%",
    "教える力は、文章で残す習慣と、質問へのていねいな対応に出るからです。",
    "知識を言葉にして、周りの成長も後押しするタイプです。",
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
    "自作リポジトリ比率 45% + リポジトリ数 30% + 活動量 25%",
    "創る力は、フォークよりも『自分で作った資産』に強く出るからです。",
    "ゼロから形にして、価値を生み出していくタイプです。",
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
    "メイン言語への集中 50% + 実装の積み上げ 30% + 技術幅の絞り込み 20%",
    "専門性は、同じ領域をくり返し深く掘っているかで判断しやすいからです。",
    "得意分野を深く磨いて、完成度を高めるタイプです。",
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
    "言語の幅 40% + 分野の幅 35% + 偏りの少なさ 25%",
    "広く対応できる人は、特定技術に偏らない実装履歴に特徴が出るからです。",
    "複数の領域をまたいで、つなぎ役になれるタイプです。",
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
    "Issue対応 40% + PR対応 25% + 継続保守 35%",
    "不具合対応の力は、課題管理と継続改善の積み重ねに表れやすいからです。",
    "問題を切り分けて、着実に解決へ導くタイプです。",
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
