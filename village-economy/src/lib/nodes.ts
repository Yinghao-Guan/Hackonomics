// src/lib/nodes.ts
export type ChoiceKey = "A" | "B" | "C";

export type Effect =
    | { type: "add"; key: keyof GameStats; value: number }
    | { type: "set"; key: keyof GameStats; value: number }
    | { type: "achievement"; id: string; title: string; description: string }
    | { type: "log"; text: string }
    | { type: "goto"; nodeId: string };

export type GameStats = {
    money: number;
    foodStock: number;
    population: number;
    happiness: number;
    productivity: number; // 0~200 (just a simple scale)
    season: number;
    day: number;
    actionPoints: number;
};

export type DialogueNode = {
    id: string;
    type: "dialogue";
    speaker: string;
    text: string | string[];
    next: string;
};

export type ChoiceNode = {
    id: string;
    type: "choice";
    speaker: string;
    text: string | string[];
    choices: Array<{
        key: ChoiceKey;
        title: string;
        description?: string;
        effects: Effect[];
    }>;
};

export type Node = DialogueNode | ChoiceNode;

export const START_NODE_ID = "intro_001";

export const INITIAL_STATS: GameStats = {
    money: 100,
    foodStock: 18,
    population: 20,
    happiness: 60,
    productivity: 100,
    season: 1,
    day: 1,
    actionPoints: 3,
};

// 你的朋友写的剧情 + 事件一（MVP）
// 说明：这里的“黑屏/渐亮”等视觉效果先用文本 + 占位UI表达
export const NODES: Record<string, Node> = {
    intro_001: {
        id: "intro_001",
        type: "dialogue",
        speaker: "（黑屏）",
        text: "你在一个陌生的房间醒来。耳边传来几个大妈大婶的嘀咕声。",
        next: "intro_002",
    },
    intro_002: {
        id: "intro_002",
        type: "dialogue",
        speaker: "大妈们",
        text: ["大妈一：昨天不是还好好的？", "大妈二：可不是嘛。", "大妈三：会不会……脑子坏了？"],
        next: "intro_003",
    },
    intro_003: {
        id: "intro_003",
        type: "dialogue",
        speaker: "（画面渐亮）",
        text: "你睁开眼，一头驴的大脸占据了你的视野。它静静看着你，两秒后开口说话。",
        next: "intro_004",
    },
    intro_004: {
        id: "intro_004",
        type: "dialogue",
        speaker: "驴",
        text: "（叹气）你终于醒了。",
        next: "intro_005",
    },
    intro_005: {
        id: "intro_005",
        type: "dialogue",
        speaker: "你（内心）",
        text: "这是哪里？我是不是吃坏东西了？不对！驴怎么会说话！",
        next: "intro_006",
    },
    intro_006: {
        id: "intro_006",
        type: "dialogue",
        speaker: "你",
        text: "你……刚刚是说话了？",
        next: "intro_007",
    },
    intro_007: {
        id: "intro_007",
        type: "dialogue",
        speaker: "驴",
        text: "比起这个，你还是关心下自己在哪吧。",
        next: "intro_008",
    },
    intro_008: {
        id: "intro_008",
        type: "dialogue",
        speaker: "大妈们（小声）",
        text: ["大妈一：他又开始自言自语了。", "大妈三：我就说吧，脑子坏了。", "大妈二：那还当不当村长了？"],
        next: "intro_009",
    },
    intro_009: {
        id: "intro_009",
        type: "dialogue",
        speaker: "你",
        text: "村长？",
        next: "intro_010",
    },
    intro_010: {
        id: "intro_010",
        type: "dialogue",
        speaker: "驴",
        text: "简单来说：这个村子快撑不下去了。他们连最简单的算术都算不明白，而你这个外来者成了他们的希望。",
        next: "intro_011",
    },
    intro_011: {
        id: "intro_011",
        type: "dialogue",
        speaker: "系统",
        text: "成就解锁：《关于我转生后变成村长这件事》（That Time I Got Reincarnated as a 村长）",
        next: "intro_012",
    },
    intro_012: {
        id: "intro_012",
        type: "dialogue",
        speaker: "你",
        text: "你到底是谁？",
        next: "intro_013",
    },
    intro_013: {
        id: "intro_013",
        type: "dialogue",
        speaker: "驴",
        text: "我叫立（Prophet）。你可以当我是你的幻觉——如果你承认你脑子坏了的话。你接下来做的每个决定，我都会记下来。",
        next: "intro_014",
    },
    intro_014: {
        id: "intro_014",
        type: "dialogue",
        speaker: "（门被推开）村民A",
        text: "不好了！粮仓不够分了！",
        next: "intro_015",
    },
    intro_015: {
        id: "intro_015",
        type: "dialogue",
        speaker: "立（Prophet）",
        text: "欢迎醒来。顺带一提：冬天快到了。",
        next: "event1_001",
    },

    // 事件一：粮食不足（三选一）
    event1_001: {
        id: "event1_001",
        type: "choice",
        speaker: "立（Prophet）",
        text: [
            "村民们发现粮仓里的粮食不够所有人度过这个季节。",
            "当前小麦库存：18kg；人口：20；最低需求：1kg/人。",
            "立：有时候，不做选择本身也是一种选择。",
        ],
        choices: [
            {
                key: "A",
                title: "每个人分到同样的食物",
                description: "所有人轻微饥饿，没有人被特别对待。",
                effects: [
                    { type: "set", key: "foodStock", value: 0 },
                    { type: "add", key: "productivity", value: -5 },
                    {
                        type: "achievement",
                        id: "ach_shared_hardship",
                        title: "同甘共苦",
                        description: "你选择让所有人一起撑过去。",
                    },
                    { type: "log", text: "事件一：选择A（平分粮食）" },
                    { type: "goto", nodeId: "event1_ending" },
                ],
            },
            {
                key: "B",
                title: "确保能干活的人吃饱",
                description: "劳动者稳定，老人小孩饥饿。",
                effects: [
                    { type: "set", key: "foodStock", value: 0 },
                    { type: "add", key: "happiness", value: -5 },
                    { type: "add", key: "population", value: -2 },
                    {
                        type: "achievement",
                        id: "ach_optimal_question",
                        title: "最优解？",
                        description: "你把未来，放在了现在之前。",
                    },
                    { type: "log", text: "事件一：选择B（劳动者优先）" },
                    { type: "goto", nodeId: "event1_ending" },
                ],
            },
            {
                key: "C",
                title: "不做干预",
                description: "依赖个人选择，结果不可预测。",
                effects: [
                    { type: "set", key: "foodStock", value: 0 },
                    // MVP先用固定值代替随机（避免demo不稳定）；你想要随机我也能马上改
                    { type: "add", key: "productivity", value: -3 },
                    { type: "add", key: "happiness", value: -3 },
                    { type: "add", key: "population", value: -1 },
                    {
                        type: "achievement",
                        id: "ach_free_or_escape",
                        title: "自由 or 逃避",
                        description: "你选择了不替任何人做决定。",
                    },
                    { type: "log", text: "事件一：选择C（不干预）" },
                    { type: "goto", nodeId: "event1_ending" },
                ],
            },
        ],
    },

    event1_ending: {
        id: "event1_ending",
        type: "dialogue",
        speaker: "立（Prophet）",
        text: "你做出选择的那一刻，你便放弃了别的某种东西——这就是 opportunity cost。",
        next: "season_end",
    },

    season_end: {
        id: "season_end",
        type: "dialogue",
        speaker: "系统",
        text: "季末结算（MVP）：点击继续进入下一季。",
        next: "season_start",
    },

    season_start: {
        id: "season_start",
        type: "dialogue",
        speaker: "立（Prophet）",
        text: "新的一季开始了。你会继续用“理性”做决定吗？",
        next: "event1_001", // MVP先循环回事件一，方便演示；之后换成事件二
    },
};
