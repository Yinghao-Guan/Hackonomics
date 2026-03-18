// src/lib/nodes.ts
export type ChoiceKey = "A" | "B" | "C";

export type Effect =
    | { type: "add"; key: keyof GameStats; value: number }
    | { type: "set"; key: keyof GameStats; value: number }
    | { type: "achievement"; id: string; title: string; description: string }
    | { type: "log"; text: string }
    | { type: "goto"; nodeId: string };

export type GameStats = {
    // base stats
    money: number;
    foodStock: number;
    population: number;
    techLevel: number;
    
    // Derived Stats 
    gdp: number;
    cpi: number; 
    unemploymentRate: number; 
    happiness: number;
    productivity: number; 
    
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
    avatar?: string; 
    bg?: "black" | "room" | "village"; 
};

export type ChoiceNode = {
    id: string;
    type: "choice";
    speaker: string;
    text: string | string[];
    avatar?: string;
    bg?: "black" | "room" | "village";
    choices: Array<{
        key: ChoiceKey;
        title: string;
        description?: string;
        effects: Effect[];
    }>;
};

export type Node = DialogueNode | ChoiceNode;

export const START_NODE_ID = "event1_start";

export const INITIAL_STATS: GameStats = {
    money: 5000,
    foodStock: 18,
    population: 20,
    techLevel: 1.0, 
    
    gdp: 1000,     
    cpi: 100,       
    unemploymentRate: 0, 
    happiness: 70,
    productivity: 100,
    
    season: 1,
    day: 1,
    actionPoints: 3,
};

export const NODES: Record<string, Node> = {

    // 事件一
    event1_start: {
        id: "event1_start", type: "dialogue", speaker: "村民A", avatar: "👨‍🌾", bg: "room",
        text: "（门被猛地推开）不好了村长！粮仓里的粮食……不够所有人分了！", 
        next: "event1_prophet",
    },
    event1_prophet: {
        id: "event1_prophet", type: "dialogue", speaker: "立（Prophet）", avatar: "🐴", bg: "village",
        text: "欢迎上任，村长。顺带一提：冬天快到了。", 
        next: "event1_dialogue_1",
    },
    event1_dialogue_1: {
        id: "event1_dialogue_1", type: "dialogue", speaker: "村民一（老人）", avatar: "👴", bg: "village",
        text: "我们年纪大了，少吃点也没事，把粮食留给年轻人吧……", 
        next: "event1_dialogue_2",
    },
    event1_dialogue_2: {
        id: "event1_dialogue_2", type: "dialogue", speaker: "村民二（壮年）", avatar: "💪", bg: "village",
        text: "要是我们没力气干活，下个季节咱们全村都得饿死！必须保住干活的人！",  
        next: "event1_dialogue_3",
    },
    event1_dialogue_3: {
        id: "event1_dialogue_3", type: "dialogue", speaker: "村民三（孩子）", avatar: "👧", bg: "village",
        text: "妈妈……我们要饿肚子了吗？",  
        next: "event1_prophet_2",
    },
    event1_prophet_2: {
        id: "event1_prophet_2", type: "dialogue", speaker: "立（Prophet）", avatar: "🐴", bg: "village",
        text: "有时候，不做选择本身也是一种选择。现在的库存只有 18kg，刚好够 18 个人活命。而你们有 20 张嘴。选吧，村长。", 
        next: "event1_choice",
    },

    // 真正的抉择节点
    event1_choice: {
        id: "event1_choice", type: "choice", speaker: "立（Prophet）", avatar: "🐴", bg: "village",
        text: "（当前小麦：18kg | 人口：20人 | 维持生命最低需求：1kg/人）",
        choices: [
            {
                key: "A",
                title: "平均分配 (所有人分到 0.9kg)",
                description: "马克思主义流派：倾向结果均等。所有人轻微饥饿，没有人被放弃。", 
                effects: [
                    { type: "set", key: "foodStock", value: 0 }, 
                    { type: "add", key: "productivity", value: -5 },
                    {
                        type: "achievement",
                        id: "ach_shared_hardship",
                        title: "同甘共苦", 
                        description: "你选择让所有人一起撑过去。但在绝对稀缺下，平均分配导致了整体效率的下滑。",
                    },
                    { type: "log", text: "事件一：平均分配，全员轻微饥饿，生产力下降。" },
                    { type: "goto", nodeId: "event1_ending" },
                ],
            },
            {
                key: "B",
                title: "优先劳动力 (老人小孩断粮)", 
                description: "新古典经济学：追求资源最优配置。牺牲非生产性人口保全未来产出。",
                effects: [
                    { type: "set", key: "foodStock", value: 0 }, 
                    { type: "add", key: "happiness", value: -15 }, 
                    { type: "add", key: "population", value: -2 }, 
                    {
                        type: "achievement",
                        id: "ach_optimal_question",
                        title: "最优解？",
                        description: "你把未来，放在了现在之前。效用最大化原则在极端情况下的冷血体现。", 
                    },
                    { type: "log", text: "事件一：优先劳动力，老人小孩牺牲，幸福度大跌。" },
                    { type: "goto", nodeId: "event1_ending" },
                ],
            },
            {
                key: "C",
                title: "不做干预 (由村民自行争抢)", 
                description: "奥地利学派：相信个体博弈与自发秩序。结果不可预测。", 
                effects: [
                    { type: "set", key: "foodStock", value: 0 },
                    { type: "add", key: "productivity", value: -3 }, 
                    { type: "add", key: "happiness", value: -8 },
                    { type: "add", key: "population", value: -1 }, 
                    {
                        type: "achievement",
                        id: "ach_free_or_escape",
                        title: "自由 or 逃避",
                        description: "你选择了不替任何人做决定。体会哈耶克式自发秩序的代价吧。", 
                    },
                    { type: "log", text: "事件一：不干预，引发轻度骚乱，结果差强人意。" },
                    { type: "goto", nodeId: "event1_ending" },
                ],
            },
        ],
    },

    // 总结与教学
    event1_ending: {
        id: "event1_ending", type: "dialogue", speaker: "立（Prophet）", avatar: "🐴", bg: "village",
        text: "做完决定了？很好。", 
        next: "event1_ending_2",
    },
    event1_ending_2: {
        id: "event1_ending_2", type: "dialogue", speaker: "立（Prophet）", avatar: "🐴", bg: "village",
        text: "请记住刚才的感觉。你做出选择的那一刻，你便永远地放弃了别的某种东西。在经济学里，这叫【机会成本 (Opportunity Cost)】。", 
        next: "season_end",
    },

    season_end: {
        id: "season_end", type: "dialogue", speaker: "（系统）", bg: "black",
        text: "【第一季 结束】\n由于你的决策，村庄的各项指标已发生不可逆的变动。", 
        next: "season_start",
    },
    season_start: {
        id: "season_start", type: "dialogue", speaker: "立（Prophet）", avatar: "🐴", bg: "village",
        text: "恭喜熬过第一季。但别高兴得太早，春天的“丰收”，有时候比冬天的饥荒更可怕。敬请期待事件二吧。", 
        next: "event1_start", // MVP 演示完毕，先循环回事件一开头方便测试
    },
};