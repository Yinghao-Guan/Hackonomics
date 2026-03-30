"use client";

import type { Achievement } from "@/lib/gameState";
import { useLanguage } from "@/lib/language";
import { clearStorage } from "@/lib/storage";
import { ACHIEVEMENT_EN, localizeAchievement, type Lang } from "@/lib/translations";
import { useRouter } from "next/navigation";

type ChoiceKey = "A" | "B" | "C";
type Choices = Record<string, ChoiceKey>;

type PersonalityId = "keynesian" | "libertarian" | "statist" | "pragmatist";

type AchievementCatalogItem = {
    id: string;
    zh: { title: string; description: string };
    en: { title: string; description: string };
};

const SCORE_MAP: Record<string, Record<ChoiceKey, PersonalityId>> = {
    event1_choice: { A: "keynesian", B: "statist", C: "libertarian" },
    event2_choice: { A: "keynesian", B: "pragmatist", C: "libertarian" },
    event3_choice: { A: "statist", B: "keynesian", C: "libertarian" },
    event4_choice: { A: "statist", B: "keynesian", C: "libertarian" },
    event5_choice: { A: "keynesian", B: "libertarian", C: "statist" },
    event6_choice: { A: "statist", B: "keynesian", C: "libertarian" },
    event7_choice: { A: "keynesian", B: "libertarian", C: "statist" },
    event8_choice: { A: "keynesian", B: "pragmatist", C: "libertarian" },
    event9_choice: { A: "statist", B: "pragmatist", C: "libertarian" },
    event10_choice: { A: "statist", B: "libertarian", C: "pragmatist" },
};

const PERSONALITIES: Record<
    PersonalityId,
    {
        icon: string;
        accent: string;
        glow: string;
        edge: string;
        zh: { name: string; desc: string; quote: string; quoteAuthor: string; brief: string };
        en: { name: string; desc: string; quote: string; quoteAuthor: string; brief: string };
    }
> = {
    keynesian: {
        icon: "🏛️",
        accent: "text-sky-300",
        glow: "from-sky-500/30 via-cyan-400/12 to-transparent",
        edge: "border-sky-300/35 shadow-[0_0_45px_rgba(56,189,248,0.12)]",
        zh: {
            name: "宏观干预主义者",
            desc: "你相信市场会失灵，而国家干预是修复它的解药。当危机降临，你的第一反应是：用制度的力量稳住局面，保护每一个活在此刻的人。你愿意用今天的通胀换取明天的就业，用财政赤字换取社会的稳定。",
            quote: "长期来看，我们都会死。",
            quoteAuthor: "约翰·梅纳德·凯恩斯",
            brief: "偏向托底、稳就业、用制度换秩序。",
        },
        en: {
            name: "Keynesian Architect",
            desc: "You believe markets fail, and government intervention is the remedy. When crisis strikes, your first instinct is to stabilize through institutional design — protecting every person living in the present. You trade today's inflation for tomorrow's employment, and fiscal deficits for social stability.",
            quote: "In the long run, we are all dead.",
            quoteAuthor: "John Maynard Keynes",
            brief: "Stabilizes crises through intervention and institutional design.",
        },
    },
    libertarian: {
        icon: "⚖️",
        accent: "text-amber-300",
        glow: "from-amber-500/30 via-yellow-300/10 to-transparent",
        edge: "border-amber-300/35 shadow-[0_0_45px_rgba(251,191,36,0.12)]",
        zh: {
            name: "自由市场信徒",
            desc: "你相信价格信号是比任何官僚更聪明的协调者，市场是比任何法令更公平的裁判。干预只会扭曲信号，制造更大的问题。你让创造性破坏发生，因为你知道：废墟上，才能长出真正的繁荣。",
            quote: "自发秩序是人类行动的结果，而非人类设计的产物。",
            quoteAuthor: "弗里德里希·哈耶克",
            brief: "相信价格、竞争和自发秩序。",
        },
        en: {
            name: "Free Market Libertarian",
            desc: "You trust price signals over any bureaucrat, and markets over any decree. Intervention only distorts signals and creates bigger problems. You let creative destruction run its course — knowing that true prosperity grows from the ruins.",
            quote: "Spontaneous order is the result of human action, not human design.",
            quoteAuthor: "Friedrich Hayek",
            brief: "Trusts price signals, competition, and spontaneous order.",
        },
    },
    statist: {
        icon: "✊",
        accent: "text-rose-300",
        glow: "from-rose-500/30 via-red-400/12 to-transparent",
        edge: "border-rose-300/35 shadow-[0_0_45px_rgba(251,113,133,0.12)]",
        zh: {
            name: "铁腕国家主义者",
            desc: "你不相信市场，也不相信自发秩序。当问题出现，你毫不犹豫地动用国家权力——禁令、没收、管控。效率高于一切，权威先于共识。历史上，这样的领袖既建起了最宏伟的工程，也留下了最难以计算的代价。",
            quote: "国家是阶级矛盾不可调和的产物。",
            quoteAuthor: "弗拉基米尔·列宁",
            brief: "倾向强力调度，用权威压住混乱。",
        },
        en: {
            name: "Iron-Fisted Statist",
            desc: "You trust neither markets nor spontaneous order. When problems arise, you reach for state power without hesitation — bans, expropriations, controls. Efficiency above all, authority before consensus. Such leaders built the grandest projects in history, and paid the heaviest prices.",
            quote: "The state is a product of the irreconcilability of class antagonisms.",
            quoteAuthor: "Vladimir Lenin",
            brief: "Prefers hard coordination and state authority over disorder.",
        },
    },
    pragmatist: {
        icon: "🧭",
        accent: "text-emerald-300",
        glow: "from-emerald-500/30 via-lime-300/10 to-transparent",
        edge: "border-emerald-300/35 shadow-[0_0_45px_rgba(52,211,153,0.12)]",
        zh: {
            name: "折中实用主义者",
            desc: "你没有固定的意识形态。有时干预，有时放手，有时妥协。你在乎的是此时此地的最优解，而非任何理论的内在纯洁性。这是最难被贴标签的答案，也是现实世界大多数优秀决策者的真实写照。",
            quote: "不管黑猫白猫，能抓到老鼠的就是好猫。",
            quoteAuthor: "邓小平",
            brief: "不执着纯度，优先眼前可行解。",
        },
        en: {
            name: "Pragmatic Centrist",
            desc: "You have no fixed ideology. Sometimes intervening, sometimes stepping back, sometimes compromising. You seek the optimal solution for the moment, not the purity of any theory. The hardest type to label — and the truest portrait of most great real-world decision-makers.",
            quote: "It doesn't matter if a cat is black or white; if it catches mice, it's a good cat.",
            quoteAuthor: "Deng Xiaoping",
            brief: "Values workable solutions over ideological purity.",
        },
    },
};

const LABEL: Record<PersonalityId, { zh: string; en: string }> = {
    keynesian: { zh: "干预", en: "Keynesian" },
    libertarian: { zh: "自由", en: "Libertarian" },
    statist: { zh: "国家", en: "Statist" },
    pragmatist: { zh: "折中", en: "Pragmatist" },
};

const ALL_ACHIEVEMENTS: AchievementCatalogItem[] = [
    { id: "ach_shared_hardship", zh: { title: "同甘共苦", description: "你选择让所有人一起撑过去。但在绝对稀缺下，平均分配导致了整体效率的下滑。" }, en: ACHIEVEMENT_EN.ach_shared_hardship },
    { id: "ach_optimal_question", zh: { title: "最优解？", description: "你把未来，放在了现在之前。效用最大化原则在极端情况下的冷血体现。" }, en: ACHIEVEMENT_EN.ach_optimal_question },
    { id: "ach_free_or_escape", zh: { title: "自由 or 逃避", description: "你选择了不替任何人做决定。体会哈耶克式自发秩序的代价吧。" }, en: ACHIEVEMENT_EN.ach_free_or_escape },
    { id: "ach_prudent_ruler", zh: { title: "未雨绸缪", description: "你强制储粮备荒。村民牢骚满腹，但仓库里堆满了应对灾害的储备。凯恩斯主义式的风险防范，代价是民心的短期流失。" }, en: ACHIEVEMENT_EN.ach_prudent_ruler },
    { id: "ach_utility_maximizer", zh: { title: "效用最大化", description: "肉类的香气飘遍全村，幸福度暴涨。但小麦储备大幅削减，下一场灾荒的缓冲期已大为缩短。" }, en: ACHIEVEMENT_EN.ach_utility_maximizer },
    { id: "ach_invisible_hand", zh: { title: "看不见的手", description: "黑市自发形成，酒香四溢。金币滚滚而来，但清醒的劳动力却越来越少。奥地利学派的自发秩序，有时候味道像酒。" }, en: ACHIEVEMENT_EN.ach_invisible_hand },
    { id: "ach_iron_fist", zh: { title: "铁腕治河", description: "水质恢复，渔民欢呼雀跃。但木材产量暴跌，建筑升级成本急剧上升，经济发展停滞。公共利益至上，代价是发展的脚步。" }, en: ACHIEVEMENT_EN.ach_iron_fist },
    { id: "ach_pigouvian", zh: { title: "庇古的算盘", description: "税金充盈财政，伐木速度趋于均衡，水质缓慢恢复。将外部成本内部化——让污染者为自己的代价买单。" }, en: ACHIEVEMENT_EN.ach_pigouvian },
    { id: "ach_coase_theorem", zh: { title: "科斯的手", description: "渔民获得产权后向伐木工索取污染赔偿，市场在剧烈博弈后自寻均衡。科斯定理：明晰产权，无需政府干预。" }, en: ACHIEVEMENT_EN.ach_coase_theorem },
    { id: "ach_luddite", zh: { title: "卢德分子", description: "农夫们欢呼雀跃，广场重归平静。但新农具的碎片里，埋葬的是这个村庄本可拥有的未来。技术水平永久回退。" }, en: ACHIEVEMENT_EN.ach_luddite },
    { id: "ach_welfare_state", zh: { title: "福利国家", description: "失业者领到了救济金，暂时喘了口气。但财政支出的窟窿越来越大，赤字危机已在暗处蓄势。这是凯恩斯主义的温情，也是它的软肋。" }, en: ACHIEVEMENT_EN.ach_welfare_state },
    { id: "ach_creative_destruction", zh: { title: "创造性破坏", description: "阵痛是真实的，哭声也是真实的。但熬过这个寒冬，失业者中诞生了铁匠、布匠和厨子——新的服务业就此萌芽。" }, en: ACHIEVEMENT_EN.ach_creative_destruction },
    { id: "ach_money_printer", zh: { title: "印钞机轰鸣", description: "桥建好了，货物滚滚而来。但寡妇发现她攒的铜板，买不到以前一半的东西了。通货膨胀——文明最隐秘的税收。" }, en: ACHIEVEMENT_EN.ach_money_printer },
    { id: "ach_gold_standard", zh: { title: "硬通货的尊严", description: "寡妇的铜板保住了购买力，村民对货币充满信任。但桥，依然没有建起来，河对岸的繁荣与这座村庄无缘。" }, en: ACHIEVEMENT_EN.ach_gold_standard },
    { id: "ach_expropriation", zh: { title: "征用令", description: "桥建好了，CPI纹丝不动。但商人们的眼神变了——谁还敢在这里积累财富？私人投资意愿跌入冰点。" }, en: ACHIEVEMENT_EN.ach_expropriation },
    { id: "ach_price_ceiling", zh: { title: "限价令", description: "农夫笑了，矿主停工了。价格压下去了，工具却消失了。供需曲线上，那片无谓损失（Deadweight Loss）触目惊心。" }, en: ACHIEVEMENT_EN.ach_price_ceiling },
    { id: "ach_antitrust", zh: { title: "反垄断战争", description: "国库大出血，但竞争回来了。新矿山的铁，把垄断者从神坛上拉了下来。市场均衡，用公帑买的。" }, en: ACHIEVEMENT_EN.ach_antitrust },
    { id: "ach_trickle_down", zh: { title: "涓滴效应", description: "农民在痛苦中熬着，矿主的财富堆成山。终于，他把钱投向了村庄的道路建设——涓滴效应，迟到的正义。" }, en: ACHIEVEMENT_EN.ach_trickle_down },
    { id: "ach_helicopter_money", zh: { title: "直升机撒钱", description: "消费券发出去，餐厅活下来了，GDP企稳了。但物价悄悄涨上去了——凯恩斯主义托底总需求，代价是日后的通胀。" }, en: ACHIEVEMENT_EN.ach_helicopter_money },
    { id: "ach_liquidationist", zh: { title: "清算主义者", description: "餐厅倒了，失业者流落街头。但通货紧缩之后，物价回落，经济结构在剧痛中完成了自我修复。奥地利学派的处方，又苦又烈。" }, en: ACHIEVEMENT_EN.ach_liquidationist },
    { id: "ach_nationalization", zh: { title: "国有化", description: "餐厅没有倒，伙计们的工钱照发。但从今往后，这里每一道菜都要经过村长办公室审批。官僚主义的成本，你还没开始计算。" }, en: ACHIEVEMENT_EN.ach_nationalization },
    { id: "ach_progressive_tax", zh: { title: "北欧之梦", description: "水井建成，瘟疫解除。底层村民奔走相告，富商则暗暗心寒。二次分配缩小了贫富差距，但商业投资意愿，已悄然下滑。" }, en: ACHIEVEMENT_EN.ach_progressive_tax },
    { id: "ach_flat_tax", zh: { title: "税制中性", description: "水井建成，瘟疫解除。富商对税制满意，资本继续积累。但贫农的负担压垮了腰，阶层的裂缝，又深了一寸。" }, en: ACHIEVEMENT_EN.ach_flat_tax },
    { id: "ach_free_rider", zh: { title: "搭便车者", description: "众筹失败了。每个人都等着别人先捐。水井没建成，瘟疫来了。财产权得到了捍卫，但代价是死人。这叫搭便车问题（Free Rider Problem）。" }, en: ACHIEVEMENT_EN.ach_free_rider },
    { id: "ach_protectionism", zh: { title: "锁国令", description: "铁匠的炉火没有熄灭。但村民们继续用着笨重的旧工具，效率低下，与山外的繁荣渐行渐远。保护，是有代价的温柔。" }, en: ACHIEVEMENT_EN.ach_protectionism },
    { id: "ach_tariff", zh: { title: "关税壁垒", description: "国库丰盈，铁匠铺勉强维持，农民也得到了半价工具。没有人完全满意，没有人彻底受损——这就是妥协的艺术。" }, en: ACHIEVEMENT_EN.ach_tariff },
    { id: "ach_comparative_advantage", zh: { title: "比较优势", description: "铁匠铺的炉火熄灭了，村里爆发了一波失业潮。但粮仓满得快溢出来，GDP飙升。李嘉图是对的——但他没有告诉你，该怎么面对那个失业的铁匠。" }, en: ACHIEVEMENT_EN.ach_comparative_advantage },
    { id: "ach_currency_war", zh: { title: "以牙还牙", description: "出口恢复了，滞销的麦子终于卖出去了。但每个村民口袋里的钱，也悄悄缩水了。竞争性贬值——一场没有赢家的底线竞争。" }, en: ACHIEVEMENT_EN.ach_currency_war },
    { id: "ach_strong_currency", zh: { title: "货币的尊严", description: "出口行业哀鸿遍野，但每一枚铜板的购买力，都坚挺如初。强势货币，是无声的宣言：我们不参与这场竞相堕落的游戏。" }, en: ACHIEVEMENT_EN.ach_strong_currency },
    { id: "ach_monetary_union", zh: { title: "货币同盟", description: "汇率战永久终结，贸易畅通无阻。但代价是，你再也无法用印钞来解决任何国内危机了。权力，有时候需要你亲手交出去，才能换来真正的稳定。" }, en: ACHIEVEMENT_EN.ach_monetary_union },
    {
        id: "ending_watcher_of_era",
        zh: { title: "时代的守望者", description: "你经历了饥荒、通胀、垄断与暴动。你没有逃避，也没有被吞噬。你用权衡与妥协，硬生生地趟出了一条文明的活路。" },
        en: { title: "The Watcher of Era", description: "You endured famine, inflation, monopoly, and revolt. You were neither consumed nor defeated, and carved a path for civilization through tradeoffs and compromise." },
    },
    {
        id: "ending_ghost_town",
        zh: { title: "死寂之村", description: "你没有被推翻，也没有被击败。你只是在冰冷的算计中，失去了所有需要你计算的人。" },
        en: { title: "A Ghost Town", description: "You were not overthrown or defeated. You simply lost everyone for whom you were doing the calculations." },
    },
    {
        id: "ending_fall_of_tyrant",
        zh: { title: "独裁者的末日", description: "你把效率凌驾于人性之上，最终被忍无可忍的人性反噬。执政者最大的错觉，是以为数字可以替代人心。" },
        en: { title: "The Fall of a Tyrant", description: "You placed efficiency above humanity and were ultimately devoured by the backlash of people pushed too far." },
    },
    {
        id: "ending_unremarkable",
        zh: { title: "平庸之赐", description: "你放弃了理解与控制世界的权力。在一个由选择构成的世界里，你选择了不再选择。" },
        en: { title: "The Gift of Being Unremarkable", description: "You gave up the power to understand and shape the world. In a world built from choices, you chose to stop choosing." },
    },
];

function computeScores(choices: Choices): Record<PersonalityId, number> {
    const scores: Record<PersonalityId, number> = { keynesian: 0, libertarian: 0, statist: 0, pragmatist: 0 };
    for (const [eventId, map] of Object.entries(SCORE_MAP)) {
        const chosen = choices[eventId];
        if (chosen) scores[map[chosen]]++;
    }
    return scores;
}

function getDominant(scores: Record<PersonalityId, number>): PersonalityId {
    const entries = Object.entries(scores) as [PersonalityId, number][];
    const max = Math.max(...entries.map(([, value]) => value));
    const winners = entries.filter(([, value]) => value === max).map(([key]) => key);
    if (winners.length > 1) return "pragmatist";
    return winners[0];
}

export default function EconomicProfile({
    choices,
    achievements,
    lang,
    revealPersonality = true,
    extraAchievements = [],
}: {
    choices: Choices;
    achievements: Achievement[];
    lang: Lang;
    revealPersonality?: boolean;
    extraAchievements?: Achievement[];
}) {
    const router = useRouter();
    const { setLang } = useLanguage();
    const scores = computeScores(choices);
    const dominant = getDominant(scores);
    const main = PERSONALITIES[dominant];
    const mainText = main[lang];
    const total = Object.values(scores).reduce((sum, value) => sum + value, 0) || 1;
    const mergedAchievements = [...achievements, ...extraAchievements.filter((item) => !achievements.some((base) => base.id === item.id))];
    const unlockedIds = new Set(mergedAchievements.map((achievement) => achievement.id));
    const unlockedCount = ALL_ACHIEVEMENTS.filter((achievement) => unlockedIds.has(achievement.id)).length;
    const orderedTypes: PersonalityId[] = ["keynesian", "libertarian", "statist", "pragmatist"];
    const secondaryTypes = orderedTypes
        .filter((type) => type !== dominant)
        .sort((left, right) => scores[right] - scores[left]);
    const unknownCard = {
        icon: "❖",
        title: lang === "en" ? "Unknown Profile" : "未知人格",
        summary: lang === "en"
            ? "This ending does not grant access to your economic profile."
            : "这个结局不会向你公开真正的经济人格。",
        detail: lang === "en"
            ? "You reached an ending, but the system withholds ideological attribution. The archive of deeds remains, yet the profile itself stays sealed."
            : "你抵达了一个结局，但系统拒绝给出意识形态归类。成就陈列仍然保留，而人格档案本身依旧封存。",
        quote: lang === "en" ? "Profile unavailable." : "人格档案不可用。",
        quoteAuthor: lang === "en" ? "Archive Seal" : "档案封印",
    };

    const titleLabel = lang === "en" ? "Economic Ideology Dashboard" : "经济人格总览";
    const archiveLabel = lang === "en" ? "Hall of Deeds" : "成就展示架";
    const archiveSubLabel = lang === "en" ? "Unlocked relics shine. The rest remain in shadow." : "达成的成就会发光，未达成的仍旧沉在暗处。";
    const progressLabel = lang === "en" ? "Unlocked" : "已点亮";
    const altLabel = lang === "en" ? "Other Leanings" : "其他人格倾向";
    const hiddenLabel = lang === "en" ? "Sealed Archive" : "封存档案";
    const languageToggleLabel = lang === "en" ? "中文" : "EN";
    const restartLabel = lang === "en" ? "Restart" : "重新开始";
    const languageLabel = lang === "en" ? "Language" : "语言";
    const mainProfileLabel = lang === "en" ? "Main profile" : "主人格";

    return (
        <div className="absolute inset-0 z-[80] overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(200,167,109,0.18),transparent_28%),linear-gradient(180deg,rgba(10,8,6,0.96),rgba(20,14,10,0.98)_30%,rgba(10,8,6,1))] text-white backdrop-blur-md">
            <div className="pointer-events-none absolute inset-0 opacity-40">
                <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgba(255,221,169,0.12),transparent)]" />
                <div className="absolute left-[-10%] top-32 h-72 w-72 rounded-full bg-amber-200/8 blur-3xl" />
                <div className="absolute right-[-5%] top-80 h-80 w-80 rounded-full bg-red-900/12 blur-3xl" />
            </div>

            <div className="relative mx-auto flex min-h-full w-full max-w-7xl flex-col gap-10 px-4 py-8 md:px-8 md:py-10">
                <section className="min-h-[100svh] snap-start flex items-center">
                    <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)]">
                        <div
                            className={`relative overflow-hidden rounded-[2rem] border ${main.edge} bg-[linear-gradient(135deg,rgba(33,25,18,0.92),rgba(13,10,8,0.96))] p-6 md:p-8 animate-[profileCardRise_0.8s_cubic-bezier(.22,1,.36,1)]`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${main.glow}`} />
                            <div className="relative">
                                <div className="mb-4 flex items-start justify-between gap-4">
                                    <div>
                                        <div className="mb-2 text-[11px] uppercase tracking-[0.35em] text-amber-100/45">{titleLabel}</div>
                                        <h1 className={`text-3xl font-black tracking-[0.03em] md:text-5xl ${revealPersonality ? main.accent : "text-stone-100"}`}>
                                            {revealPersonality ? mainText.name : unknownCard.title}
                                        </h1>
                                        <p className="mt-2 text-sm text-stone-300/75 md:text-base">
                                            {revealPersonality ? LABEL[dominant][lang] : hiddenLabel}
                                        </p>
                                    </div>
                                    <div className="animate-[cardFloat_5.5s_ease-in-out_infinite] text-5xl md:text-7xl">
                                        {revealPersonality ? main.icon : unknownCard.icon}
                                    </div>
                                </div>

                                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 backdrop-blur-sm">
                                    <p className="text-sm leading-7 text-stone-100/88 md:text-base">
                                        {revealPersonality ? mainText.desc : unknownCard.detail}
                                    </p>
                                    <div className="mt-5 border-t border-amber-100/10 pt-4">
                                        <p className={`text-sm italic md:text-base ${revealPersonality ? main.accent : "text-stone-200"}`}>
                                            &ldquo;{revealPersonality ? mainText.quote : unknownCard.quote}&rdquo;
                                        </p>
                                        <p className="mt-2 text-right text-xs tracking-[0.2em] text-stone-400 uppercase">
                                            {revealPersonality ? mainText.quoteAuthor : unknownCard.quoteAuthor}
                                        </p>
                                    </div>
                                </div>

                                {revealPersonality ? (
                                    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                        {orderedTypes.map((type) => {
                                            const pct = Math.round((scores[type] / total) * 100);
                                            const personality = PERSONALITIES[type];
                                            return (
                                                <div
                                                    key={type}
                                                    className={`rounded-2xl border px-4 py-3 ${type === dominant ? `${personality.edge} bg-white/8` : "border-white/8 bg-white/4"}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-sm font-semibold ${type === dominant ? personality.accent : "text-stone-200/75"}`}>
                                                            {LABEL[type][lang]}
                                                        </span>
                                                        <span className={`text-xs ${type === dominant ? personality.accent : "text-stone-400"}`}>{pct}%</span>
                                                    </div>
                                                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                                                        <div
                                                            className={`h-full rounded-full ${type === dominant ? "bg-current opacity-100" : "bg-white/35 opacity-60"} ${personality.accent}`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="mt-5 rounded-[1.5rem] border border-white/8 bg-white/4 p-5">
                                        <div className="text-sm leading-7 text-stone-200/80">{unknownCard.summary}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="rounded-[1.75rem] border border-amber-100/15 bg-[linear-gradient(180deg,rgba(64,45,26,0.35),rgba(18,13,10,0.82))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
                                <div className="text-[11px] uppercase tracking-[0.28em] text-amber-100/40">{revealPersonality ? altLabel : hiddenLabel}</div>
                                <div className="mt-4 space-y-3">
                                    {revealPersonality ? secondaryTypes.map((type, index) => {
                                        const personality = PERSONALITIES[type];
                                        const text = personality[lang];
                                        return (
                                            <div
                                                key={type}
                                                className="rounded-2xl border border-white/8 bg-black/18 p-4"
                                                style={{ animation: `fadeIn 0.45s ease-out ${0.12 * (index + 1)}s both` }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="text-2xl">{personality.icon}</div>
                                                    <div>
                                                        <div className={`text-sm font-semibold ${personality.accent}`}>{text.name}</div>
                                                        <div className="mt-1 text-xs leading-5 text-stone-300/68">{text.brief}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }) : Array.from({ length: 3 }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="rounded-2xl border border-white/8 bg-black/18 p-4"
                                            style={{ animation: `fadeIn 0.45s ease-out ${0.12 * (index + 1)}s both` }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl text-stone-500">?</div>
                                                <div>
                                                    <div className="text-sm font-semibold text-stone-300">{lang === "en" ? "Unknown" : "未知"}</div>
                                                    <div className="mt-1 text-xs leading-5 text-stone-400">{lang === "en" ? "Classification withheld." : "分类结果已封存。"}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[1.75rem] border border-white/10 bg-black/25 p-5">
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <div className="text-[11px] uppercase tracking-[0.28em] text-stone-400">{progressLabel}</div>
                                        <div className="mt-1 text-3xl font-black text-amber-200">{unlockedCount} / {ALL_ACHIEVEMENTS.length}</div>
                                    </div>
                                    <div className="text-right text-xs text-stone-400">
                                        <div>{mainProfileLabel}</div>
                                        <div className={`mt-1 font-semibold ${revealPersonality ? main.accent : "text-stone-200"}`}>
                                            {revealPersonality ? mainText.name : unknownCard.title}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <button
                                    onClick={() => { setLang(lang === "en" ? "zh" : "en"); }}
                                    className="rounded-[1.25rem] border border-amber-200/20 bg-white/6 px-5 py-4 text-base font-bold text-amber-200 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {languageLabel}: {languageToggleLabel}
                                </button>
                                <button
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        clearStorage();
                                        router.push("/");
                                    }}
                                    className={`rounded-[1.25rem] border bg-white/6 px-5 py-4 text-base font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] ${main.edge} ${main.accent}`}
                                >
                                    {restartLabel}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="pb-10">
                    <div className="mb-6 text-center">
                        <div className="text-[11px] uppercase tracking-[0.35em] text-amber-100/40">{archiveLabel}</div>
                        <h2 className="mt-3 text-3xl font-black text-amber-100 md:text-4xl">{lang === "en" ? "Medieval Trophy Gallery" : "中世纪成就陈列馆"}</h2>
                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-300/70 md:text-base">{archiveSubLabel}</p>
                    </div>

                    <div className="relative overflow-hidden rounded-[2rem] border border-amber-200/10 bg-[linear-gradient(180deg,rgba(52,35,20,0.8),rgba(18,13,10,0.96))] px-4 py-8 md:px-8">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(246,204,127,0.14),transparent_32%)]" />
                        <div className="pointer-events-none absolute left-0 right-0 top-20 h-3 bg-[linear-gradient(90deg,rgba(76,47,24,0.1),rgba(124,79,40,0.65),rgba(76,47,24,0.1))] shadow-[0_16px_24px_rgba(0,0,0,0.45)]" />
                        <div className="pointer-events-none absolute left-0 right-0 top-[34rem] hidden h-3 bg-[linear-gradient(90deg,rgba(76,47,24,0.1),rgba(124,79,40,0.65),rgba(76,47,24,0.1))] shadow-[0_16px_24px_rgba(0,0,0,0.45)] lg:block" />

                        <div className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {ALL_ACHIEVEMENTS.map((achievement, index) => {
                                const unlocked = unlockedIds.has(achievement.id);
                                const display = lang === "en" ? achievement.en : achievement.zh;
                                const unlockedSource = mergedAchievements.find((item) => item.id === achievement.id);
                                const localizedUnlocked = unlockedSource ? localizeAchievement(unlockedSource, lang) : null;
                                const title = localizedUnlocked?.title ?? display.title;
                                const description = localizedUnlocked?.description ?? display.description;

                                return (
                                    <article
                                        key={achievement.id}
                                        className={`relative min-h-44 rounded-[1.4rem] border p-5 transition-all duration-500 ${
                                            unlocked
                                                ? "border-amber-200/35 bg-[linear-gradient(180deg,rgba(247,210,127,0.18),rgba(56,36,18,0.55))] shadow-[0_10px_35px_rgba(245,194,84,0.12)]"
                                                : "border-stone-500/18 bg-[linear-gradient(180deg,rgba(40,30,24,0.55),rgba(16,13,11,0.88))] opacity-65 saturate-50"
                                        }`}
                                        style={{ animation: `fadeIn 0.4s ease-out ${index * 0.03}s both` }}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className={`text-xs font-bold tracking-[0.25em] uppercase ${unlocked ? "text-amber-100/70" : "text-stone-500"}`}>
                                                {unlocked ? (lang === "en" ? "Unlocked" : "已达成") : (lang === "en" ? "Locked" : "未达成")}
                                            </div>
                                            <div className={`text-lg ${unlocked ? "text-amber-200" : "text-stone-600"}`}>{unlocked ? "✦" : "✧"}</div>
                                        </div>
                                        <h3 className={`mt-4 text-lg font-black leading-6 ${unlocked ? "text-amber-50" : "text-stone-300"}`}>{title}</h3>
                                        <p className={`mt-3 text-sm leading-6 ${unlocked ? "text-stone-100/82" : "text-stone-400"}`}>{description}</p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={(event) => {
                                event.stopPropagation();
                                clearStorage();
                                router.push("/");
                            }}
                            className={`rounded-[1.25rem] border bg-white/6 px-8 py-4 text-base font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] ${main.edge} ${main.accent}`}
                        >
                            {restartLabel}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
