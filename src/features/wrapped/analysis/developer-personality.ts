import type {
  DeveloperDnaKey,
  DeveloperDnaProfile,
  DeveloperPersonality,
} from "./types";

type PersonalityRule = {
  key: string;
  title: string;
  description: string;
  matchedDna: DeveloperDnaKey[];
  isMatch: (profile: DeveloperDnaProfile) => boolean;
};

const HIGH_DNA_SCORE = 68;
const VERY_HIGH_DNA_SCORE = 82;
const DNA_LABELS: Record<DeveloperDnaKey, string> = {
  builder: "ビルダー",
  explorer: "エクスプローラー",
  maintainer: "メンテナー",
  collaborator: "コラボレーター",
  experimenter: "実験者",
  teacher: "ティーチャー",
  creator: "クリエイター",
  specialist: "スペシャリスト",
  generalist: "ジェネラリスト",
  debugger: "デバッガー",
};

function getScore(profile: DeveloperDnaProfile, key: DeveloperDnaKey): number {
  return profile.dna.find((item) => item.key === key)?.score ?? 0;
}

function hasHigh(profile: DeveloperDnaProfile, key: DeveloperDnaKey): boolean {
  return getScore(profile, key) >= HIGH_DNA_SCORE;
}

function hasVeryHigh(profile: DeveloperDnaProfile, key: DeveloperDnaKey): boolean {
  return getScore(profile, key) >= VERY_HIGH_DNA_SCORE;
}

function hasAllHigh(profile: DeveloperDnaProfile, keys: DeveloperDnaKey[]): boolean {
  return keys.every((key) => hasHigh(profile, key));
}

const PERSONALITY_RULES: PersonalityRule[] = [
  {
    key: "system-architect",
    title: "システムアーキテクト",
    description: "ビルダーとメンテナーが高く、長く使える設計を積み上げる。",
    matchedDna: ["builder", "maintainer"],
    isMatch: (profile) => hasAllHigh(profile, ["builder", "maintainer"]),
  },
  {
    key: "open-source-hero",
    title: "オープンソースヒーロー",
    description: "クリエイターとコラボレーターの組み合わせで公開価値と協働を両立する。",
    matchedDna: ["creator", "collaborator"],
    isMatch: (profile) => hasAllHigh(profile, ["creator", "collaborator"]),
  },
  {
    key: "craft-mentor",
    title: "クラフトメンター",
    description: "ティーチャーとメンテナーが強く、品質と知識伝達を同時に引き上げる。",
    matchedDna: ["teacher", "maintainer"],
    isMatch: (profile) => hasAllHigh(profile, ["teacher", "maintainer"]),
  },
  {
    key: "rapid-prototyper",
    title: "高速プロトタイパー",
    description: "実験者とビルダーが高く、仮説をすぐ動く形にする。",
    matchedDna: ["experimenter", "builder"],
    isMatch: (profile) => hasAllHigh(profile, ["experimenter", "builder"]),
  },
  {
    key: "cross-domain-strategist",
    title: "越境ストラテジスト",
    description: "エクスプローラーとジェネラリストの掛け合わせで領域横断の選択肢を作る。",
    matchedDna: ["explorer", "generalist"],
    isMatch: (profile) => hasAllHigh(profile, ["explorer", "generalist"]),
  },
  {
    key: "incident-responder",
    title: "インシデントレスポンダー",
    description: "デバッガーとメンテナーが高く、障害時にも安定運用へ戻せる。",
    matchedDna: ["debugger", "maintainer"],
    isMatch: (profile) => hasAllHigh(profile, ["debugger", "maintainer"]),
  },
  {
    key: "community-catalyst",
    title: "コミュニティカタリスト",
    description: "コラボレーターとティーチャーが高く、チームの学習速度を上げる。",
    matchedDna: ["collaborator", "teacher"],
    isMatch: (profile) => hasAllHigh(profile, ["collaborator", "teacher"]),
  },
  {
    key: "deep-crafter",
    title: "ディープクラフター",
    description: "スペシャリストとメンテナーが高く、深い専門性を運用で磨く。",
    matchedDna: ["specialist", "maintainer"],
    isMatch: (profile) => hasAllHigh(profile, ["specialist", "maintainer"]),
  },
  {
    key: "platform-builder",
    title: "プラットフォームビルダー",
    description: "ビルダーとスペシャリストが高く、再利用可能な土台を作る。",
    matchedDna: ["builder", "specialist"],
    isMatch: (profile) => hasAllHigh(profile, ["builder", "specialist"]),
  },
  {
    key: "product-explorer",
    title: "プロダクトエクスプローラー",
    description: "クリエイターとエクスプローラーが高く、新しい価値仮説を連続的に試す。",
    matchedDna: ["creator", "explorer"],
    isMatch: (profile) => hasAllHigh(profile, ["creator", "explorer"]),
  },
  {
    key: "polyglot-engineer",
    title: "ポリグロットエンジニア",
    description: "ジェネラリストとビルダーで幅広い技術を実務へ落とし込む。",
    matchedDna: ["generalist", "builder"],
    isMatch: (profile) => hasAllHigh(profile, ["generalist", "builder"]),
  },
  {
    key: "architecture-guardian",
    title: "アーキテクチャガーディアン",
    description: "メンテナーとスペシャリストで設計の一貫性を守る。",
    matchedDna: ["maintainer", "specialist"],
    isMatch: (profile) =>
      hasAllHigh(profile, ["maintainer", "specialist"]) &&
      hasVeryHigh(profile, "maintainer"),
  },
  {
    key: "quality-evangelist",
    title: "品質エバンジェリスト",
    description: "デバッガーとティーチャーで品質改善を仕組みとして浸透させる。",
    matchedDna: ["debugger", "teacher"],
    isMatch: (profile) => hasAllHigh(profile, ["debugger", "teacher"]),
  },
  {
    key: "delivery-commander",
    title: "デリバリーコマンダー",
    description: "ビルダーが非常に高く、クリエイターと組み合わせて高速に価値を届ける。",
    matchedDna: ["builder", "creator"],
    isMatch: (profile) =>
      hasVeryHigh(profile, "builder") && hasHigh(profile, "creator"),
  },
  {
    key: "feedback-loop-master",
    title: "フィードバックループマスター",
    description: "コラボレーターと実験者で仮説検証サイクルを高速化する。",
    matchedDna: ["collaborator", "experimenter"],
    isMatch: (profile) => hasAllHigh(profile, ["collaborator", "experimenter"]),
  },
  {
    key: "steady-innovator",
    title: "堅実なイノベーター",
    description: "実験者とメンテナーを両立し、変化と安定をバランスさせる。",
    matchedDna: ["experimenter", "maintainer"],
    isMatch: (profile) => hasAllHigh(profile, ["experimenter", "maintainer"]),
  },
  {
    key: "knowledge-architect",
    title: "ナレッジアーキテクト",
    description: "ティーチャーとクリエイターで知識を資産化し、再利用可能な形で残す。",
    matchedDna: ["teacher", "creator"],
    isMatch: (profile) => hasAllHigh(profile, ["teacher", "creator"]),
  },
  {
    key: "silent-debugger",
    title: "静かなるデバッガー",
    description: "デバッガーが高く、堅実な保守運用で問題を着実に減らす。",
    matchedDna: ["debugger", "maintainer"],
    isMatch: (profile) =>
      hasVeryHigh(profile, "debugger") && hasHigh(profile, "maintainer"),
  },
  {
    key: "ecosystem-connector",
    title: "エコシステムコネクター",
    description: "ジェネラリストとコラボレーターが高く、チーム間・技術間の橋渡しが得意。",
    matchedDna: ["generalist", "collaborator"],
    isMatch: (profile) => hasAllHigh(profile, ["generalist", "collaborator"]),
  },
  {
    key: "future-scout",
    title: "フューチャースカウト",
    description: "エクスプローラーと実験者で新潮流を先回りして試す。",
    matchedDna: ["explorer", "experimenter"],
    isMatch: (profile) => hasAllHigh(profile, ["explorer", "experimenter"]),
  },
  {
    key: "craft-defender",
    title: "クラフトディフェンダー",
    description: "スペシャリストとデバッガーで品質を妥協せず守り抜く。",
    matchedDna: ["specialist", "debugger"],
    isMatch: (profile) => hasAllHigh(profile, ["specialist", "debugger"]),
  },
  {
    key: "feature-smith",
    title: "フィーチャースミス",
    description: "ビルダーとクリエイターが高く、プロダクト機能を継続的に鍛える。",
    matchedDna: ["builder", "creator"],
    isMatch: (profile) => hasAllHigh(profile, ["builder", "creator"]),
  },
  {
    key: "operational-stabilizer",
    title: "運用スタビライザー",
    description: "メンテナーとコラボレーターで運用改善をチームに定着させる。",
    matchedDna: ["maintainer", "collaborator"],
    isMatch: (profile) => hasAllHigh(profile, ["maintainer", "collaborator"]),
  },
  {
    key: "teaching-polymath",
    title: "教えるポリマス",
    description: "ティーチャーとジェネラリストで幅広い知識をわかりやすく伝える。",
    matchedDna: ["teacher", "generalist"],
    isMatch: (profile) => hasAllHigh(profile, ["teacher", "generalist"]),
  },
  {
    key: "refactoring-navigator",
    title: "リファクタリングナビゲーター",
    description: "メンテナーとエクスプローラーを活かし、改善余地を段階的に広げる。",
    matchedDna: ["maintainer", "explorer"],
    isMatch: (profile) => hasAllHigh(profile, ["maintainer", "explorer"]),
  },
  {
    key: "experiment-led-builder",
    title: "実験駆動ビルダー",
    description: "実験者が非常に高くビルダーも高い、検証駆動の実装者。",
    matchedDna: ["experimenter", "builder"],
    isMatch: (profile) =>
      hasVeryHigh(profile, "experimenter") && hasHigh(profile, "builder"),
  },
  {
    key: "bridge-engineer",
    title: "ブリッジエンジニア",
    description: "コラボレーターとエクスプローラーで新技術をチームへ接続する。",
    matchedDna: ["collaborator", "explorer"],
    isMatch: (profile) => hasAllHigh(profile, ["collaborator", "explorer"]),
  },
  {
    key: "craft-researcher",
    title: "クラフトリサーチャー",
    description: "スペシャリストと実験者が高く、深掘りと試行を循環させる。",
    matchedDna: ["specialist", "experimenter"],
    isMatch: (profile) => hasAllHigh(profile, ["specialist", "experimenter"]),
  },
  {
    key: "runtime-guardian",
    title: "ランタイムガーディアン",
    description: "デバッガーが非常に高くコラボレーターも高い、運用品質の守護者。",
    matchedDna: ["debugger", "collaborator"],
    isMatch: (profile) =>
      hasVeryHigh(profile, "debugger") && hasHigh(profile, "collaborator"),
  },
  {
    key: "learning-accelerator",
    title: "ラーニングアクセラレーター",
    description: "ティーチャーとエクスプローラーで学びと導入を加速させる。",
    matchedDna: ["teacher", "explorer"],
    isMatch: (profile) => hasAllHigh(profile, ["teacher", "explorer"]),
  },
  {
    key: "product-backbone",
    title: "プロダクトの背骨",
    description: "ビルダーとメンテナーが非常に高く、開発の背骨を担う。",
    matchedDna: ["builder", "maintainer"],
    isMatch: (profile) =>
      hasVeryHigh(profile, "builder") && hasVeryHigh(profile, "maintainer"),
  },
  {
    key: "innovation-crafter",
    title: "イノベーションクラフター",
    description: "クリエイターと実験者でアイデアを実装まで持ち込む。",
    matchedDna: ["creator", "experimenter"],
    isMatch: (profile) => hasAllHigh(profile, ["creator", "experimenter"]),
  },
  {
    key: "full-cycle-mentor",
    title: "フルサイクルメンター",
    description: "ビルダー・コラボレーター・ティーチャーの3軸でチーム全体を引き上げる。",
    matchedDna: ["builder", "collaborator", "teacher"],
    isMatch: (profile) => hasAllHigh(profile, ["builder", "collaborator", "teacher"]),
  },
  {
    key: "stability-first-engineer",
    title: "安定性ファーストエンジニア",
    description: "メンテナー・デバッガー中心で信頼性の高い改善を積み重ねる。",
    matchedDna: ["maintainer", "debugger"],
    isMatch: (profile) =>
      hasVeryHigh(profile, "maintainer") && hasHigh(profile, "debugger"),
  },
  {
    key: "balanced-craftsperson",
    title: "バランス型クラフトパーソン",
    description: "DNAの偏りが少なく、状況に応じて役割を切り替えられる。",
    matchedDna: ["generalist", "maintainer", "builder"],
    isMatch: (profile) => profile.balanceScore >= 72,
  },
  {
    key: "adaptive-developer",
    title: "適応型デベロッパー",
    description: "変化と運用の両面で適応できる総合型エンジニア。",
    matchedDna: ["generalist", "experimenter", "maintainer"],
    isMatch: (profile) => profile.balanceScore >= 65,
  },
];

function buildFallback(profile: DeveloperDnaProfile): DeveloperPersonality {
  const top = profile.dna[0];
  const second = profile.dna[1];

  return {
    key: `the-${top.key}`,
    title: `${top.label}タイプ`,
    description: `${top.label}を主軸に、${second.label}を組み合わせて成果を出すタイプ。`,
    matchedDna: [top.key, second.key],
    reason: `上位DNAは ${top.label} (${top.score}) と ${second.label} (${second.score})。単一指標ではなく2軸で判定。`,
  };
}

export function analyzeDeveloperPersonality(
  profile: DeveloperDnaProfile,
): DeveloperPersonality {
  const matched = PERSONALITY_RULES.find((rule) => rule.isMatch(profile));
  if (!matched) {
    return buildFallback(profile);
  }

  const scorePreview = matched.matchedDna
    .map((key) => `${DNA_LABELS[key]}:${getScore(profile, key)}`)
    .join(" / ");

  return {
    key: matched.key,
    title: matched.title,
    description: matched.description,
    matchedDna: matched.matchedDna,
    reason: `複合判定に一致 (${scorePreview})`,
  };
}

export const DEVELOPER_PERSONALITY_VARIANTS = PERSONALITY_RULES.length;
