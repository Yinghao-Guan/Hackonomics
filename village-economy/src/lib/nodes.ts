import { Achievement } from "./gameState";

// src/lib/nodes.ts
export type ChoiceKey = "A" | "B" | "C";

export type Effect =
    | { type: "add"; key: keyof GameStats; value: number }
    | { type: "set"; key: keyof GameStats; value: number }
    | { type: "achievement"; id: string; title: string; description: string }
    | { type: "log"; zh: string; en: string }
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

    farmLevel: number;
    pastureLevel: number;
    mineLevel: number;
    academyLevel: number;
    marketLevel: number;
};

// 统一的背景类型定义
export type BgType = "black" | "room" | "village" | "wheat" | "ruins" | "fire" | "dawn";

export type DialogueNode = {
    id: string;
    type: "dialogue";
    speaker: string;
    text: string | string[];
    next: string;
    avatar?: string; 
    bg?: BgType; 
};

export type ChoiceNode = {
    id: string;
    type: "choice";
    speaker: string;
    text: string | string[];
    avatar?: string;
    bg?: BgType;
    choices: Array<{
        key: ChoiceKey;
        title: string;
        effects: Effect[];
    }>;
};

export type IdleNode = {
    id: string;
    type: "idle";
    bg?: BgType;
    next: string;
};

export type TitleSecretNode = {
    id: string;
    type: "title_secret";
    speaker?: string;
    text?: string;
    bg?: BgType;
    next?: string;
};

export type AchievementNode = { id: string; type: "achievement"; text: string; description?: string; bg?: BgType; next: string; };

export type NarrationNode = { 
    id: string; 
    type: "narration"; 
    text: string; 
    bg?: BgType; 
    autoPlayDuration?: number; // 如果有这个值，就会自动倒计时跳转；没有则等待玩家点击
    next: string; 
};

export type Node = DialogueNode | ChoiceNode | IdleNode | TitleSecretNode | AchievementNode | NarrationNode | ProfileNode;

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

    farmLevel: 0,
    pastureLevel: 0,
    mineLevel: 0,
    academyLevel: 0,
    marketLevel: 0,
};

export const NODES: Record<string, Node> = {

    // ─── 统一的挂机枢纽 ───────────────────────────────────────
    idle_main: {
        id: "idle_main", 
        type: "idle", 
        bg: "village", 
        next: "idle_main" 
    },

    // ─── 事件一：生存的重量 ───────────────────────────────────────
    event1_start: {
        id: "event1_start", type: "dialogue", speaker: "村民A", avatar: "/avatar/villager1.png", bg: "room",
        text: "（门被猛地推开）不好了村长！粮仓里的粮食……不够所有人分了！", 
        next: "event1_prophet",
    },
    event1_prophet: {
        id: "event1_prophet", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "欢迎上任，村长。顺带一提：冬天快到了。", 
        next: "event1_dialogue_1",
    },
    event1_dialogue_1: {
        id: "event1_dialogue_1", type: "dialogue", speaker: "村民一（老人）", avatar: "/avatar/old_villager.png", bg: "village",
        text: "我们年纪大了，少吃点也没事，把粮食留给年轻人吧……", 
        next: "event1_dialogue_2",
    },
    event1_dialogue_2: {
        id: "event1_dialogue_2", type: "dialogue", speaker: "村民二（壮年）", avatar: "/avatar/strong_villager.png", bg: "village",
        text: "要是我们没力气干活，下个季节咱们全村都得饿死！必须保住干活的人！",  
        next: "event1_dialogue_3",
    },
    event1_dialogue_3: {
        id: "event1_dialogue_3", type: "dialogue", speaker: "村民三（孩子）", avatar: "👧", bg: "village",
        text: "妈妈……我们要饿肚子了吗？",  
        next: "event1_prophet_2",
    },
    event1_prophet_2: {
        id: "event1_prophet_2", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "有时候，不做选择本身也是一种选择。现在的库存只有 18kg，刚好够 18 个人活命。而你们有 20 张嘴。选吧，村长。", 
        next: "event1_choice",
    },

    event1_choice: {
        id: "event1_choice", type: "choice", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "（当前小麦：18kg | 人口：20人 | 维持生命最低需求：1kg/人）",
        choices: [
            {
                key: "A", title: "平均分配 (所有人分到 0.9kg)",
                effects: [
                    { type: "set", key: "foodStock", value: 0 }, { type: "add", key: "productivity", value: -15 }, { type: "add", key: "gdp", value: -50 },
                    { type: "achievement", id: "ach_shared_hardship", title: "同甘共苦", description: "你选择让所有人一起撑过去。但在绝对稀缺下，平均分配导致了整体效率的下滑。" },
                    { type: "log", zh: "事件一：平均分配，全员轻微饥饿，生产力下降。", en: "Event 1: Equal distribution — everyone slightly hungry, productivity declined." },
                    { type: "goto", nodeId: "event1_ending" },
                ],
            },
            {
                key: "B", title: "优先劳动力 (老人小孩断粮)", 
                effects: [
                    { type: "set", key: "foodStock", value: 0 }, { type: "add", key: "happiness", value: -25 }, { type: "add", key: "population", value: -2 }, { type: "add", key: "productivity", value: 10 },
                    { type: "achievement", id: "ach_optimal_question", title: "最优解？", description: "你把未来，放在了现在之前。效用最大化原则在极端情况下的冷血体现。" },
                    { type: "log", zh: "事件一：优先劳动力，老人小孩牺牲，幸福度大跌。", en: "Event 1: Prioritize workers — elders and children sacrificed, happiness plummeted." },
                    { type: "goto", nodeId: "event1_ending" },
                ],
            },
            {
                key: "C", title: "不做干预 (由村民自行争抢)", 
                effects: [
                    { type: "set", key: "foodStock", value: 0 }, { type: "add", key: "productivity", value: -10 }, { type: "add", key: "happiness", value: -10 }, { type: "add", key: "population", value: -1 }, 
                    { type: "achievement", id: "ach_free_or_escape", title: "自由 or 逃避", description: "你选择了不替任何人做决定。体会哈耶克式自发秩序的代价吧。" },
                    { type: "log", zh: "事件一：不干预，引发轻度骚乱，结果差强人意。", en: "Event 1: No intervention — minor unrest triggered, results were mediocre." },
                    { type: "goto", nodeId: "event1_ending" },
                ],
            },
        ],
    },

    event1_ending: {
        id: "event1_ending", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "做完决定了？很好。", 
        next: "event1_ending_2",
    },
    event1_ending_2: {
        id: "event1_ending_2", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "请记住刚才的感觉。你做出选择的那一刻，你便永远地放弃了别的某种东西。在经济学里，这叫【机会成本 (Opportunity Cost)】。", 
        next: "idle_main", 
    },


    // ─── 事件二：边际效用递减与资源转化 ───────────────────────────────────────
    event2_start: {
        id: "event2_start", type: "dialogue", speaker: "村民一（母亲）", avatar: "/avatar/poor_mum.png", bg: "village",
        text: "村长，孩子们连着吃了一个月的小麦糊糊，现在一看到麦子就干呕。昨天小女儿看着隔壁家的牛流口水，晚上哭着说梦话想吃口肉。您就行行好，拿些麦子去喂牛吧。",
        next: "event2_dialogue_2",
    },
    event2_dialogue_2: {
        id: "event2_dialogue_2", type: "dialogue", speaker: "村民二（老伯）", avatar: "/avatar/angry_old.png", bg: "village",
        text: "荒唐！这可是救命的粮！现在吃饱了就开始挑剔，要是明年开春遇到旱灾倒春寒，拿什么活命？村长，你们这是在作孽，在糟蹋老天爷的恩赐啊！",
        next: "event2_prophet",
    },
    event2_prophet: {
        id: "event2_prophet", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "你看，对快饿死的人来说，第一口面包是神迹；对吃撑的人来说，第一百口面包连狗都不想看。这就是边际效用递减法则（Law of Diminishing Marginal Utility）。所以村长大人，你是要做一个强迫大家居安思危的独裁者，还是纵容他们眼前的口腹之欲？",
        next: "event2_choice",
    },

    event2_choice: {
        id: "event2_choice", type: "choice", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "（小麦库存：充裕 | 幸福度：停滞不前 | 牧场：新建）",
        choices: [
            {
                key: "A", title: "强制全部存入仓库备荒",
                effects: [
                    { type: "add", key: "happiness", value: -10 }, { type: "add", key: "actionPoints", value: -1 },
                    { type: "achievement", id: "ach_prudent_ruler", title: "未雨绸缪", description: "你强制储粮备荒。村民牢骚满腹，但仓库里堆满了应对灾害的储备。凯恩斯主义式的风险防范，代价是民心的短期流失。" },
                    { type: "log", zh: "事件二：强制储粮，幸福度下滑，行动点被仓库维护占用。", en: "Event 2: Forced grain storage — happiness declined, action points consumed by warehouse maintenance." },
                    { type: "goto", nodeId: "event2_ending" },
                ],
            },
            {
                key: "B", title: "官方补贴，将小麦转化为肉类",
                effects: [
                    { type: "add", key: "foodStock", value: -30 }, { type: "add", key: "happiness", value: 30 }, { type: "add", key: "cpi", value: 15 },
                    { type: "achievement", id: "ach_utility_maximizer", title: "效用最大化", description: "肉类的香气飘遍全村，幸福度暴涨。但小麦储备大幅削减，下一场灾荒的缓冲期已大为缩短。" },
                    { type: "log", zh: "事件二：转化肉类，幸福度暴涨，但粮食储备锐减，推高CPI。", en: "Event 2: Convert to meat — happiness soared, but grain reserves sharply depleted, CPI pushed higher." },
                    { type: "goto", nodeId: "event2_ending" },
                ],
            },
            {
                key: "C", title: "放开管制，允许村民私自酿酒交易",
                effects: [
                    { type: "add", key: "money", value: 500 }, { type: "add", key: "happiness", value: 10 }, { type: "add", key: "productivity", value: -15 }, { type: "add", key: "gdp", value: 40 },
                    { type: "achievement", id: "ach_invisible_hand", title: "看不见的手", description: "黑市自发形成，酒香四溢。金币滚滚而来，但清醒的劳动力却越来越少。奥地利学派的自发秩序，有时候味道像酒。" },
                    { type: "log", zh: "事件二：放开酿酒，收入增加但生产力下滑。", en: "Event 2: Deregulate brewing — income increased but productivity declined." },
                    { type: "goto", nodeId: "event2_ending" },
                ],
            },
        ],
    },

    event2_ending: {
        id: "event2_ending", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "你刚刚经历的，是经济学中最朴素的真理之一。",
        next: "event2_ending_2",
    },
    event2_ending_2: {
        id: "event2_ending_2", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "对快饿死的人来说，第一口面包是神迹；对吃撑的人来说，面包堆成山也无动于衷。每一单位额外消费带来的满足感，都在递减。这叫【边际效用递减法则 (Law of Diminishing Marginal Utility)】。",
        next: "idle_main", 
    },


    // ─── 事件三：公地悲剧与负外部性 ───────────────────────────────────────────
    event3_start: {
        id: "event3_start", type: "dialogue", speaker: "村民一（伐木工）", avatar: "/avatar/wooder.png", bg: "village",
        text: "村长！没木头怎么盖新房子？大家总不能一直挤在漏风的破棚子里吧！我靠自己的力气多砍几棵树，让大家住得更暖和，我到底有什么错？",
        next: "event3_dialogue_2",
    },
    event3_dialogue_2: {
        id: "event3_dialogue_2", type: "dialogue", speaker: "村民二（渔民）", avatar: "/avatar/fisher.png", bg: "village",
        text: "咳咳……你看看这河水！全被木屑和泥巴毁了！我们打不到鱼不说，连喝口水都要闹肚子，村里的老人已经病倒了好几个！你们盖的新房，是用我们的命换的！",
        next: "event3_prophet",
    },
    event3_prophet: {
        id: "event3_prophet", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "伐木工赚了木头的钱，却让全体村民承担了喝泥水的代价。当一块蛋糕属于所有人时，每个人都会想在别人吃完前咬下最大的一口。这就是公地悲剧（Tragedy of the Commons）。市场在负外部性（Negative Externality）面前，瞎了眼。村长，你要去当那个惹人厌的恶人来纠正它吗？",
        next: "event3_choice",
    },

    event3_choice: {
        id: "event3_choice", type: "choice", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "（河畔树木遭到滥伐，水质持续恶化，渔民与伐木工矛盾激化）",
        choices: [
            {
                key: "A", title: "铁腕禁伐令，完全禁止河畔伐木",
                effects: [
                    { type: "add", key: "happiness", value: 10 }, { type: "add", key: "productivity", value: -20 }, { type: "add", key: "gdp", value: -80 }, { type: "set", key: "mineLevel", value: 0 },
                    { type: "achievement", id: "ach_iron_fist", title: "铁腕治河", description: "水质恢复，渔民欢呼雀跃。但木材产量暴跌，建筑升级成本急剧上升，经济发展停滞。公共利益至上，代价是发展的脚步。" },
                    { type: "log", zh: "事件三：颁布禁伐令，水质恢复，但木材断供导致矿场停摆，GDP下滑。", en: "Event 3: Logging ban — water quality restored, but timber shortage shut down mines, GDP declined." },
                    { type: "goto", nodeId: "event3_ending" },
                ],
            },
            {
                key: "B", title: "征收庇古税（Pigouvian Tax），对每单位木材课重税",
                effects: [
                    { type: "add", key: "money", value: 1000 }, { type: "add", key: "happiness", value: -5 }, { type: "add", key: "cpi", value: 10 },
                    { type: "achievement", id: "ach_pigouvian", title: "庇古的算盘", description: "税金充盈财政，伐木速度趋于均衡，水质缓慢恢复。将外部成本内部化——让污染者为自己的代价买单。" },
                    { type: "log", zh: "事件三：征收庇古税，财政收入增加，污染放缓，但木材涨价推高CPI。", en: "Event 3: Pigouvian tax — fiscal revenue increased, pollution slowed, but timber price hike raised CPI." },
                    { type: "goto", nodeId: "event3_ending" },
                ],
            },
            {
                key: "C", title: "将河流产权私有化，卖给渔民",
                effects: [
                    { type: "add", key: "money", value: 400 }, { type: "add", key: "cpi", value: 20 }, { type: "add", key: "gdp", value: 100 }, { type: "add", key: "happiness", value: -10 },
                    { type: "achievement", id: "ach_coase_theorem", title: "科斯的手", description: "渔民获得产权后向伐木工索取污染赔偿，市场在剧烈博弈后自寻均衡。科斯定理：明晰产权，无需政府干预。" },
                    { type: "log", zh: "事件三：河流私有化，市场自发博弈导致物价波动，但长期促进GDP。", en: "Event 3: River privatization — market spontaneous dynamics caused price fluctuations, but promoted GDP long-term." },
                    { type: "goto", nodeId: "event3_ending" },
                ],
            },
        ],
    },

    event3_ending: {
        id: "event3_ending", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "你刚刚触碰到了经济学最令人头痛的问题之一。",
        next: "event3_ending_2",
    },
    event3_ending_2: {
        id: "event3_ending_2", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "当个人的理性行为，累积成集体的灾难，市场便失灵了。这叫【负外部性（Negative Externality）】与【公地悲剧（Tragedy of the Commons）】。解法从来不只一种，但每一种都要有人付出代价。",
        next: "idle_main", 
    },


    // ─── 事件四：技术冲击与结构性失业 ────────────────────────────────────────
    event4_start: {
        id: "event4_start", type: "dialogue", speaker: "村民一（农夫）", avatar: "/avatar/farmer.png", bg: "village",
        text: "村长，我为这个村子种了半辈子地！现在你弄来个不用人力的铁疙瘩，就把我们全赶出去了？我家里还有三个张嘴吃饭的人，你是要逼我们去死吗？",
        next: "event4_dialogue_2",
    },
    event4_dialogue_2: {
        id: "event4_dialogue_2", type: "dialogue", speaker: "村民二（农场主）", avatar: "/avatar/owner.png", bg: "village",
        text: "这是效率！有了新农具，全村的产粮翻倍，以后再也不用担心灾荒了！村长，时代要进步，总得有人做出牺牲吧？他们只会被淘汰！",
        next: "event4_prophet",
    },
    event4_prophet: {
        id: "event4_prophet", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "旧时代的敲钟人，总是死于新时代的齿轮之下，这叫创造性破坏（Creative Destruction）。如果你为了几滴无用的眼泪停下脚步，这个村子就永远是个穷乡僻壤。但问题是，那些代价现在就活生生地站在你面前，你要如何面对他们？",
        next: "event4_choice",
    },

    event4_choice: {
        id: "event4_choice", type: "choice", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "（新农具已引入，失业率从0%飙升至50%，失业者聚集广场抗议）",
        choices: [
            {
                key: "A", title: "砸毁新农具，保住所有人的饭碗",
                effects: [
                    { type: "add", key: "unemploymentRate", value: -25 }, { type: "add", key: "happiness", value: 20 }, { type: "add", key: "techLevel", value: -0.5 }, { type: "set", key: "academyLevel", value: 0 }, { type: "add", key: "gdp", value: -100 },
                    { type: "achievement", id: "ach_luddite", title: "卢德分子", description: "农夫们欢呼雀跃，广场重归平静。但新农具的碎片里，埋葬的是这个村庄本可拥有的未来。技术水平永久回退。" },
                    { type: "log", zh: "事件四：砸毁农具，失业率缓解。但研究院荒废，科技倒退，GDP永久受损。", en: "Event 4: Smashed tools — unemployment eased. But academy abandoned, tech regressed, GDP permanently damaged." },
                    { type: "goto", nodeId: "event4_ending" },
                ],
            },
            {
                key: "B", title: "对农场主征重税，发放失业救济金",
                effects: [
                    { type: "add", key: "money", value: -1500 }, { type: "add", key: "happiness", value: -5 }, { type: "add", key: "unemploymentRate", value: 10 }, { type: "add", key: "gdp", value: -30 }, { type: "add", key: "cpi", value: 10 },
                    { type: "achievement", id: "ach_welfare_state", title: "福利国家", description: "失业者领到了救济金，暂时喘了口气。但财政支出的窟窿越来越大，赤字危机已在暗处蓄势。这是凯恩斯主义的温情，也是它的软肋。" },
                    { type: "log", zh: "事件四：发放救济金，happiness受控，但巨额开支引发轻度通胀。", en: "Event 4: Unemployment benefits — happiness stabilized, but massive spending triggered mild inflation." },
                    { type: "goto", nodeId: "event4_ending" },
                ],
            },
            {
                key: "C", title: "拒绝干预，让失业者自谋生路",
                effects: [
                    { type: "add", key: "happiness", value: -30 }, { type: "add", key: "population", value: -2 }, { type: "add", key: "productivity", value: 30 }, { type: "add", key: "techLevel", value: 0.5 }, { type: "add", key: "gdp", value: 80 },
                    { type: "achievement", id: "ach_creative_destruction", title: "创造性破坏", description: "阵痛是真实的，哭声也是真实的。但熬过这个寒冬，失业者中诞生了铁匠、布匠和厨子——新的服务业就此萌芽。" },
                    { type: "log", zh: "事件四：放任市场清算，人口流失，剧烈痛苦，但换来生产力和科技的大幅跃升。", en: "Event 4: Market clearing — population loss, severe pain, but productivity and tech surged dramatically." },
                    { type: "goto", nodeId: "event4_ending" },
                ],
            },
        ],
    },

    event4_ending: {
        id: "event4_ending", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "技术进步从不会问你的感受。",
        next: "event4_ending_2",
    },
    event4_ending_2: {
        id: "event4_ending_2", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "旧工作消亡，新工作诞生——这个循环叫【创造性破坏（Creative Destruction）】，熊彼特如是说。问题从来不是要不要变，而是谁来承担变的代价。",
        next: "idle_main", 
    },


    // ─── 事件五：法定货币的诞生与通货膨胀 ──────────────────────────────────
    event5_start: {
        id: "event5_start", type: "dialogue", speaker: "商贩", avatar: "/avatar/sad_seller.png", bg: "village",
        text: "河对岸的物资进不来，没有桥，我们迟早要困死在这里！村长，大家都很信任你，只要你拿纸盖个章当钱用，先把造桥的料买回来，以后的日子肯定能好起来的！",
        next: "event5_dialogue_2",
    },
    event5_dialogue_2: {
        id: "event5_dialogue_2", type: "dialogue", speaker: "寡妇", avatar: "/avatar/sad_old.png", bg: "village",
        text: "我攒了一辈子的硬币，就指望老了有个棺材本。你们要是乱印那种破纸头，到处都是钱，我的硬币不就变成废铁了吗？村长，你可不能去偷我们这些苦命人的救命钱啊！",
        next: "event5_prophet",
    },
    event5_prophet: {
        id: "event5_prophet", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "印刷机是权力的魔杖。它能凭空造出雄伟的桥梁，也能悄无声息地偷走寡妇口袋里的最后半块铜板。这就是通货膨胀（Inflation）。村长，你要戴上这枚权力的魔戒吗？",
        next: "event5_choice",
    },

    event5_choice: {
        id: "event5_choice", type: "choice", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "（财政库空虚，桥梁急需修建，村庄亟需贸易通道）",
        choices: [
            {
                key: "A", title: "印钞建桥（量化宽松）",
                effects: [
                    { type: "add", key: "money", value: 5000 }, { type: "add", key: "gdp", value: 200 }, { type: "add", key: "cpi", value: 60 }, { type: "add", key: "happiness", value: -15 },
                    { type: "achievement", id: "ach_money_printer", title: "印钞机轰鸣", description: "桥建好了，货物滚滚而来。但寡妇发现她攒的铜板，买不到以前一半的东西了。通货膨胀——文明最隐秘的税收。" },
                    { type: "log", zh: "事件五：量化宽松，GDP狂飙，但引发严重通货膨胀(CPI飙升)。", en: "Event 5: Quantitative easing — GDP soared, but triggered severe inflation (CPI spiked)." },
                    { type: "goto", nodeId: "event5_ending" },
                ],
            },
            {
                key: "B", title: "坚守硬通货，拒绝印钞",
                effects: [
                    { type: "add", key: "happiness", value: 5 }, { type: "add", key: "cpi", value: -20 }, { type: "add", key: "gdp", value: -50 }, { type: "add", key: "marketLevel", value: -1 },
                    { type: "achievement", id: "ach_gold_standard", title: "硬通货的尊严", description: "寡妇的铜板保住了购买力，村民对货币充满信任。但桥，依然没有建起来，河对岸的繁荣与这座村庄无缘。" },
                    { type: "log", zh: "事件五：坚守硬通货，拒绝放水。流动性枯竭导致市场降级。", en: "Event 5: Hard currency defended — refused to print. Liquidity crunch caused market downgrade." },
                    { type: "goto", nodeId: "event5_ending" },
                ],
            },
            {
                key: "C", title: "强制没收富裕商人的资产建桥",
                effects: [
                    { type: "add", key: "money", value: 2000 }, { type: "add", key: "gdp", value: 100 }, { type: "add", key: "productivity", value: -40 }, { type: "add", key: "happiness", value: -15 }, { type: "set", key: "marketLevel", value: 0 },
                    { type: "achievement", id: "ach_expropriation", title: "征用令", description: "桥建好了，CPI纹丝不动。但商人们的眼神变了——谁还敢在这里积累财富？私人投资意愿跌入冰点。" },
                    { type: "log", zh: "事件五：强没收资产，无通胀，但摧毁了商业信任，市场直接荒废。", en: "Event 5: Asset expropriation — no inflation, but commercial trust destroyed, market collapsed entirely." },
                    { type: "goto", nodeId: "event5_ending" },
                ],
            },
        ],
    },

    event5_ending: {
        id: "event5_ending", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "你刚刚做了一个关于货币本质的决定。",
        next: "event5_ending_2",
    },
    event5_ending_2: {
        id: "event5_ending_2", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "货币，不过是一张大家相信它有价值的纸。当发行者滥用这份信任，每一分钱都在悄悄贬值。这叫【通货膨胀（Inflation）】——权力最隐秘的税收形式。",
        next: "idle_main", 
    },


    // ─── 事件六：垄力量与价格管制 ──────────────────────────────────────────
    event6_start: {
        id: "event6_start", type: "dialogue", speaker: "农夫", avatar: "/avatar/angry_villager.png", bg: "village",
        text: "三倍！一把破铁锄头他居然敢要三倍的价钱！他这是在喝我们的血！村长，你是我们的父母官，你要是再不管管这黑心商人，我们只能拿起石头跟他去拼命了！",
        next: "event6_dialogue_2",
    },
    event6_dialogue_2: {
        id: "event6_dialogue_2", type: "dialogue", speaker: "矿主", avatar: "/avatar/iron_owner.png", bg: "village",
        text: "这是我的矿，我雇人挖的铁，我当然有权定我想要的价。嫌贵？那你们用手去刨地啊。别忘了，村长，上个月村里的治安维护费可是我捐的，谁才是维持村子运转的人？",
        next: "event6_prophet",
    },
    event6_prophet: {
        id: "event6_prophet", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "当市场失去竞争，那只看不见的手就会握成拳头，狠狠砸向消费者的脸。剥夺商人的定价权，还是看着农民流血？权力的天平，你打算往哪边倾斜？",
        next: "event6_choice",
    },

    event6_choice: {
        id: "event6_choice", type: "choice", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "（矿主控制唯一铁矿，工具价格已涨至三倍，农业减产危机迫在眉睫）",
        choices: [
            {
                key: "A", title: "颁布限价令，强行压低工具价格",
                effects: [
                    { type: "add", key: "happiness", value: 20 }, { type: "add", key: "productivity", value: -20 }, { type: "add", key: "actionPoints", value: -1 }, { type: "add", key: "gdp", value: -150 }, { type: "set", key: "mineLevel", value: 0 },
                    { type: "achievement", id: "ach_price_ceiling", title: "限价令", description: "农夫笑了，矿主停工了。价格压下去了，工具却消失了。供需曲线上，那片无谓损失（Deadweight Loss）触目惊心。" },
                    { type: "log", zh: "事件六：强制限价，民粹沸腾但矿场罢工荒废，GDP剧震。", en: "Event 6: Price ceiling — populist cheers but mine strike caused GDP to collapse." },
                    { type: "goto", nodeId: "event6_ending" },
                ],
            },
            {
                key: "B", title: "官方出资勘探新矿，扶持竞争者",
                effects: [
                    { type: "add", key: "money", value: -2000 }, { type: "add", key: "mineLevel", value: 1 }, { type: "add", key: "gdp", value: 150 }, { type: "add", key: "happiness", value: 5 },
                    { type: "achievement", id: "ach_antitrust", title: "反垄断战争", description: "国库大出血，但竞争回来了。新矿山的铁，把垄断者从神坛上拉了下来。市场均衡，用公帑买的。" },
                    { type: "log", zh: "事件六：巨资扶持竞争者新建矿场，打破垄断，GDP健康成长。", en: "Event 6: Funded competitor mine — monopoly broken, GDP grew healthily." },
                    { type: "goto", nodeId: "event6_ending" },
                ],
            },
            {
                key: "C", title: "不加干涉，保护商人的绝对定价权",
                effects: [
                    { type: "add", key: "happiness", value: -30 }, { type: "add", key: "productivity", value: -10 }, { type: "add", key: "money", value: 1000 }, { type: "add", key: "cpi", value: 40 }, { type: "add", key: "gdp", value: 50 },
                    { type: "achievement", id: "ach_trickle_down", title: "涓滴效应", description: "农民在痛苦中熬着，矿主的财富堆成山。终于，他把钱投向了村庄的道路建设——涓滴效应，迟到的正义。" },
                    { type: "log", zh: "事件六：放任垄断剥削，税收暴增，但工具涨价致CPI暴涨，民怨极大。", en: "Event 6: Allowed monopoly — tax revenue surged, but tool price hike caused CPI spike, public anger massive." },
                    { type: "goto", nodeId: "event6_ending" },
                ],
            },
        ],
    },

    event6_ending: {
        id: "event6_ending", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "市场从来不是天然公平的。",
        next: "event6_ending_2",
    },
    event6_ending_2: {
        id: "event6_ending_2", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "当一家企业控制了整个市场，看不见的手就变成了看不见的拳头。这叫【垄断（Monopoly）】。干预它的方式，决定了代价由谁承担。",
        next: "idle_main", 
    },


    // ─── 事件七：宏观冲击与总需求不足 ───────────────────────────────────────
    event7_start: {
        id: "event7_start", type: "dialogue", speaker: "餐厅老板", avatar: "/avatar/helpless.png", bg: "village",
        text: "村长，求求你救救我！大雪封路，连着半个月一个客人都没有，伙计们的工钱根本发不出！如果明天再没有进项，我就只能去跳冰窟窿了！",
        next: "event7_dialogue_2",
    },
    event7_dialogue_2: {
        id: "event7_dialogue_2", type: "dialogue", speaker: "守财奴", avatar: "/avatar/money_saver.png", bg: "village",
        text: "外面冻死人，傻子才去下馆子吃饭？谁知道这暴风雪要刮到什么时候，把钱死死捂在口袋里熬过冬天，难道不是天经地义的做法吗？",
        next: "event7_prophet",
    },
    event7_prophet: {
        id: "event7_prophet", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "对个人而言，危机时存钱是理性的；但当所有人同时存钱时，宏观经济的引擎就彻底熄火了。如果你不去强迫他们花钱，大家就一起在死寂的寒冬里拥抱着破产吧。",
        next: "event7_choice",
    },

    event7_choice: {
        id: "event7_choice", type: "choice", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "（极寒暴风雪封路，全村疯狂存钱，餐厅濒临破产，节俭悖论爆发）",
        choices: [
            {
                key: "A", title: "发放消费券，强制刺激需求",
                effects: [
                    { type: "add", key: "money", value: -1000 }, { type: "add", key: "gdp", value: 100 }, { type: "add", key: "happiness", value: 15 }, { type: "add", key: "cpi", value: 20 }, { type: "add", key: "marketLevel", value: 1 },
                    { type: "achievement", id: "ach_helicopter_money", title: "直升机撒钱", description: "消费券发出去，餐厅活下来了，GDP企稳了。但物价悄悄涨上去了——凯恩斯主义托底总需求，代价是日后的通胀。" },
                    { type: "log", zh: "事件七：花重金发放消费券托市，市场繁荣但引发通胀。", en: "Event 7: Consumer vouchers issued — market boomed but caused inflation." },
                    { type: "goto", nodeId: "event7_ending" },
                ],
            },
            {
                key: "B", title: "任由餐厅破产，等待自然出清",
                effects: [
                    { type: "add", key: "unemploymentRate", value: 30 }, { type: "add", key: "happiness", value: -20 }, { type: "add", key: "cpi", value: -30 }, { type: "add", key: "gdp", value: -150 }, { type: "add", key: "marketLevel", value: -2 },
                    { type: "achievement", id: "ach_liquidationist", title: "清算主义者", description: "餐厅倒了，失业者流落街头。但通货紧缩之后，物价回落，经济结构在剧痛中完成了自我修复。奥地利学派的处方，又苦又烈。" },
                    { type: "log", zh: "事件七：放任市场崩溃出清，市场降级，恶性通缩，失业潮爆发。", en: "Event 7: Market liquidation — market downgraded, deflationary spiral, unemployment surge." },
                    { type: "goto", nodeId: "event7_ending" },
                ],
            },
            {
                key: "C", title: "将餐厅国有化，由村长发工资",
                effects: [
                    { type: "add", key: "money", value: -500 }, { type: "add", key: "actionPoints", value: -1 }, { type: "add", key: "happiness", value: 10 }, { type: "add", key: "productivity", value: -20 }, { type: "add", key: "gdp", value: 30 },
                    { type: "achievement", id: "ach_nationalization", title: "国有化", description: "餐厅没有倒，伙计们的工钱照发。但从今往后，这里每一道菜都要经过村长办公室审批。官僚主义的成本，你还没开始计算。" },
                    { type: "log", zh: "事件七：企业国有化保就业，但生产力大幅下滑，AP永久损耗。", en: "Event 7: Nationalization — employment saved, but productivity sharply declined, AP permanently lost." },
                    { type: "goto", nodeId: "event7_ending" },
                ],
            },
        ],
    },

    event7_ending: {
        id: "event7_ending", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "每个人都做了对自己最理性的事，整个村子却陷入了最不理性的困境。",
        next: "event7_ending_2",
    },
    event7_ending_2: {
        id: "event7_ending_2", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "当所有人同时节省，总需求便坍塌。这叫【节俭悖论（Paradox of Thrift）】——个人理性之和，有时等于集体的灾难。凯恩斯称之为宏观经济学最深的陷阱。",
        next: "idle_main", 
    },


    // ─── 事件八：税收政策与公共产品 ──────────────────────────────────────────
    event8_start: {
        id: "event8_start", type: "dialogue", speaker: "劳工", avatar: "/avatar/hungry_farmer.png", bg: "village",
        text: "瘟疫来了大家都要死！凭什么让我们这些饭都吃不饱的人，去跟那些住大房子的大财主交一样的钱？他们拔一根汗毛都比我们的腰粗！",
        next: "event8_dialogue_2",
    },
    event8_dialogue_2: {
        id: "event8_dialogue_2", type: "dialogue", speaker: "富商", avatar: "/avatar/richman.png", bg: "village",
        text: "我的财富是我辛辛苦苦起早贪黑赚来的，不是大风刮来的！我平时交的钱已经够多了，凭什么我越努力，就越要被你们这些穷鬼吸血去填坑？",
        next: "event8_prophet",
    },
    event8_prophet: {
        id: "event8_prophet", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "税收，是文明的代价，还是合法的抢劫？数学很简单，但背后的伦理能引发战争。谁该为公共利益买单？这考验的不仅仅是你的算术，更是你的道德底线。",
        next: "event8_choice",
    },

    event8_choice: {
        id: "event8_choice", type: "choice", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "（瘟疫逼近，急需修建公共净水井，富商与贫农在税收方案上剑拔弩张）",
        choices: [
            {
                key: "A", title: "实施累进税制，富人多交比例",
                effects: [
                    { type: "add", key: "happiness", value: 30 }, { type: "add", key: "population", value: 1 }, { type: "add", key: "gdp", value: -50 }, { type: "add", key: "productivity", value: -20 }, { type: "add", key: "marketLevel", value: -1 },
                    { type: "achievement", id: "ach_progressive_tax", title: "北欧之梦", description: "水井建成，瘟疫解除。底层村民奔走相告，富商则暗暗心寒。二次分配缩小了贫富差距，但商业投资意愿，已悄然下滑。" },
                    { type: "log", zh: "事件八：累进税制杀富济贫，底层狂欢，但商业资本受惊撤离，市场降级。", en: "Event 8: Progressive tax — lower class rejoiced, but capital fled, market downgraded." },
                    { type: "goto", nodeId: "event8_ending" },
                ],
            },
            {
                key: "B", title: "实施人头税，所有人交同等金额",
                effects: [
                    { type: "add", key: "gdp", value: 50 }, { type: "add", key: "happiness", value: -30 }, { type: "add", key: "productivity", value: 10 }, { type: "add", key: "money", value: 1500 },
                    { type: "achievement", id: "ach_flat_tax", title: "税制中性", description: "水井建成，瘟疫解除。富商对税制满意，资本继续积累。但贫农的负担压垮了腰，阶层的裂缝，又深了一寸。" },
                    { type: "log", zh: "事件八：人头税剥削穷人，国库充盈，但极度加深阶级矛盾。", en: "Event 8: Poll tax — treasury filled, but class conflict severely deepened." },
                    { type: "goto", nodeId: "event8_ending" },
                ],
            },
            {
                key: "C", title: "拒绝强制征税，发起自愿众筹",
                effects: [
                    { type: "add", key: "population", value: -5 }, { type: "add", key: "happiness", value: -40 }, { type: "add", key: "gdp", value: -80 },
                    { type: "achievement", id: "ach_free_rider", title: "搭便车者", description: "众筹失败了。每个人都等着别人先捐。水井没建成，瘟疫来了。财产权得到了捍卫，但代价是死人。这叫搭便车问题（Free Rider Problem）。" },
                    { type: "log", zh: "事件八：众筹修井彻底失败，瘟疫大爆发，人口暴减。", en: "Event 8: Crowdfunding failed — plague erupted, population collapsed." },
                    { type: "goto", nodeId: "event8_ending" },
                ],
            },
        ],
    },

    event8_ending: {
        id: "event8_ending", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "公共产品，是市场永远无法自发提供的东西。",
        next: "event8_ending_2",
    },
    event8_ending_2: {
        id: "event8_ending_2", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "净水、国防、路灯——没有人愿意为自己出钱，却希望别人埋单。这叫【搭便车问题（Free Rider Problem）】。税收，是强制解决这个问题的方式。至于公不公平，每个人心里都有不同的答案。",
        next: "idle_main", 
    },


    // ─── 事件九：国际贸易与比较优势 ──────────────────────────────────────────
    event9_start: {
        id: "event9_start", type: "dialogue", speaker: "铁匠", avatar: "/avatar/sad_ironman.png", bg: "village",
        text: "村长！我祖上三代都在这里打铁！你现在要是让那些外村人的便宜铁器进来，我的炉子就得熄火，老婆孩子都要流落街头啊！你忍心看着本村人饿死在外人手里吗？",
        next: "event9_dialogue_2",
    },
    event9_dialogue_2: {
        id: "event9_dialogue_2", type: "dialogue", speaker: "农民代表", avatar: "/avatar/angry_farmer.png", bg: "village",
        text: "如果用外村的便宜工具，我们多打的粮食能养活全村双倍的人口！为了保住他一家铁匠铺，让全村人继续用烂锄头受穷挨饿，这公平吗？",
        next: "event9_prophet",
    },
    event9_prophet: {
        id: "event9_prophet", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "大卫·李嘉图的比较优势（Comparative Advantage）。贸易的确能让整体变得更富裕，但村长，你该如何看着那个即将破产的铁匠的眼睛，亲口告诉他，他就是这个宏大理论的代价？",
        next: "event9_choice",
    },

    event9_choice: {
        id: "event9_choice", type: "choice", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "（邻村愿以廉价铁器换取我村过剩小麦，本地铁匠铺将面临倒闭）",
        choices: [
            {
                key: "A", title: "颁布贸易禁令，闭关锁国",
                effects: [
                    { type: "add", key: "happiness", value: 10 }, { type: "add", key: "gdp", value: -80 }, { type: "add", key: "productivity", value: -20 }, { type: "add", key: "techLevel", value: -0.3 },
                    { type: "achievement", id: "ach_protectionism", title: "锁国令", description: "铁匠的炉火没有熄灭。但村民们继续用着笨重的旧工具，效率低下，与山外的繁荣渐行渐远。保护，是有代价的温柔。" },
                    { type: "log", zh: "事件九：贸易禁令保护了本地矿场，但科技停滞，全村生产力被拖累。", en: "Event 9: Trade ban — local mine protected, but tech stagnated, village productivity dragged down." },
                    { type: "goto", nodeId: "event9_ending" },
                ],
            },
            {
                key: "B", title: "对进口铁器征收高额关税",
                effects: [
                    { type: "add", key: "money", value: 2000 }, { type: "add", key: "gdp", value: 50 }, { type: "add", key: "cpi", value: 20 }, { type: "add", key: "happiness", value: -5 },
                    { type: "achievement", id: "ach_tariff", title: "关税壁垒", description: "国库丰盈，铁匠铺勉强维持，农民也得到了半价工具。没有人完全满意，没有人彻底受损——这就是妥协的艺术。" },
                    { type: "log", zh: "事件九：征收关税，国库大赚一笔，但抬高了工具成本，推高CPI。", en: "Event 9: Tariffs imposed — treasury profited, but tool costs raised, CPI pushed higher." },
                    { type: "goto", nodeId: "event9_ending" },
                ],
            },
            {
                key: "C", title: "拥抱全面自由贸易",
                effects: [
                    { type: "set", key: "mineLevel", value: 0 }, { type: "add", key: "unemploymentRate", value: 20 }, { type: "add", key: "foodStock", value: 50 }, { type: "add", key: "techLevel", value: 0.5 }, { type: "add", key: "gdp", value: 150 },
                    { type: "achievement", id: "ach_comparative_advantage", title: "比较优势", description: "铁匠铺的炉火熄灭了，村里爆发了一波失业潮。但粮仓满得快溢出来，GDP飙升。李嘉图是对的——但他没有告诉你，该怎么面对那个失业的铁匠。" },
                    { type: "log", zh: "事件九：自由贸易开启，本地矿业全毁(矿场归0)，但换来科技跃迁与海量粮食。", en: "Event 9: Free trade opened — local mining destroyed (mine=0), but tech leaped and food stockpiled." },
                    { type: "goto", nodeId: "event9_ending" },
                ],
            },
        ],
    },

    event9_ending: {
        id: "event9_ending", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "贸易让整体更富裕，却不保证每一个个体都受益。",
        next: "event9_ending_2",
    },
    event9_ending_2: {
        id: "event9_ending_2", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "每个村庄都应该专注于自己最擅长的事，然后与他人交换。这叫【比较优势（Comparative Advantage）】。贸易创造财富，但财富的分配，从来都是另一场战争。",
        next: "idle_main", 
    },


    // ─── 事件十：汇率战与宏观博弈 ────────────────────────────────────────────
    event10_start: {
        id: "event10_start", type: "dialogue", speaker: "出口商", avatar: "/avatar/angry_seller.png", bg: "village",
        text: "村长，隔壁村太不要脸了，把他们钱的价值贬得一文不值！咱们的麦子现在在那边卖得比金子还贵，根本没人买！粮仓都要发霉了，我们只能以牙还牙跟着贬值啊！",
        next: "event10_dialogue_2",
    },
    event10_dialogue_2: {
        id: "event10_dialogue_2", type: "dialogue", speaker: "消费者", avatar: "/avatar/happy_buyer.png", bg: "village",
        text: "别听他的！如果不跟着贬值，虽然麦子卖不出去，但我们拿现在的钱去他们村买东西，简直便宜得像白捡！我才不在乎他的死活，我只关心我手里的钱能买多少肉！",
        next: "event10_prophet",
    },
    event10_prophet: {
        id: "event10_prophet", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "当货币脱钩，国家就开始下沉。欢迎来到宏观经济学的终极战场：汇率战。你是选择随波逐流的底线竞争，还是坚守货币的尊严？决定吧，这就是你作为统治者的最后审判。",
        next: "event10_choice",
    },

    event10_choice: {
        id: "event10_choice", type: "choice", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "（邻村恶意贬值货币，我村小麦出口归零，粮仓滞销，汇率战一触即发）",
        choices: [
            {
                key: "A", title: "针锋相对，主动贬值本村货币",
                effects: [
                    { type: "add", key: "money", value: 3000 }, { type: "add", key: "cpi", value: 80 }, { type: "add", key: "happiness", value: -20 }, { type: "add", key: "gdp", value: 80 }, { type: "add", key: "foodStock", value: -20 },
                    { type: "achievement", id: "ach_currency_war", title: "以牙还牙", description: "出口恢复了，滞销的麦子终于卖出去了。但每个村民口袋里的钱，也悄悄缩水了。竞争性贬值——一场没有赢家的底线竞争。" },
                    { type: "log", zh: "事件十：参与汇率战暴印钞票，保住农场出口，但引发超级通胀。", en: "Event 10: Currency war — printed money to protect farm exports, but triggered hyperinflation." },
                    { type: "goto", nodeId: "event10_ending" },
                ],
            },
            {
                key: "B", title: "保持定力，维持强势汇率",
                effects: [
                    { type: "add", key: "farmLevel", value: -2 }, { type: "add", key: "cpi", value: -30 }, { type: "add", key: "happiness", value: 10 }, { type: "add", key: "gdp", value: -80 },
                    { type: "achievement", id: "ach_strong_currency", title: "货币的尊严", description: "出口行业哀鸿遍野，但每一枚铜板的购买力，都坚挺如初。强势货币，是无声的宣言：我们不参与这场竞相堕落的游戏。" },
                    { type: "log", zh: "事件十：拒绝贬值，出口端惨遭屠杀，农场大面积倒闭，但平民购买力飞升。", en: "Event 10: Refused devaluation — exports devastated, farms collapsed, but civilian purchasing power soared." },
                    { type: "goto", nodeId: "event10_ending" },
                ],
            },
            {
                key: "C", title: "强行建立货币联盟，与邻村统一货币",
                effects: [
                    { type: "add", key: "money", value: -3000 }, { type: "add", key: "techLevel", value: 0.5 }, { type: "add", key: "marketLevel", value: 2 }, { type: "add", key: "actionPoints", value: -2 }, { type: "add", key: "gdp", value: 120 },
                    { type: "achievement", id: "ach_monetary_union", title: "货币同盟", description: "汇率战永久终结，贸易畅通无阻。但代价是，你再也无法用印钞来解决任何国内危机了。权力，有时候需要你亲手交出去，才能换来真正的稳定。" },
                    { type: "log", zh: "事件十：建立货币联盟，丧失货币主权，但换取了超级大市场的终极繁荣。", en: "Event 10: Monetary union — lost currency sovereignty, but gained access to a super-market's ultimate prosperity." },
                    { type: "goto", nodeId: "event10_ending" },
                ],
            },
        ],
    },

    event10_ending: {
        id: "event10_ending", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "你做出了最后一个决定。",
        next: "event10_ending_2",
    },
    event10_ending_2: {
        id: "event10_ending_2", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "village",
        text: "货币的价值，建立在信任之上。当两个国家互相用贬值来争夺优势，最终两败俱伤。这叫【竞争性贬值（Competitive Devaluation）】——一场没有终点的囚徒困境。",
        next: "epilogue_1", // 👈 只有最终决战事件，才会导向游戏大结局！
    },

    // ─── 结局：经济人格档案 ──────────────────────────────────────────────────
    epilogue_1: {
        id: "epilogue_1", type: "dialogue", speaker: "（系统）", bg: "black",
        text: "【第十季 结束】\n\n十个决定。十次审判。\n\n这座村庄，已经走过了人类经济史上最核心的命题。",
        next: "epilogue_2",
    },
    epilogue_2: {
        id: "epilogue_2", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "black",
        text: "你知道吗，我观察过很多村长。有人看见饥荒，第一反应是平均分配；有人看见失业，第一反应是开动印钞机；有人看见垄断，第一反应是让市场自己解决。",
        next: "epilogue_3",
    },
    epilogue_3: {
        id: "epilogue_3", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "black",
        text: "没有一种本能是错的。凯恩斯、哈耶克、马克思——他们都看见了真实的问题，只是开出了不同的药方。而每一剂药，都有它的副作用。",
        next: "epilogue_4",
    },
    epilogue_4: {
        id: "epilogue_4", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "black",
        text: "稀缺性、机会成本、边际效用、外部性、创造性破坏、通胀、垄断、节俭悖论、比较优势、汇率战——你经历的每一件事，都在现实世界中每天上演，规模只是大了几亿倍而已。",
        next: "epilogue_5",
    },
    epilogue_5: {
        id: "epilogue_5", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "black",
        text: "所以，我记下了你的每一个决定。不是为了评判你，而是为了告诉你——你心里，住着一位经济学家。",
        next: "epilogue_6",
    },
    epilogue_6: {
        id: "epilogue_6", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "black",
        text: "也许你是那种相信政府干预能熨平一切波动的宏观架构师。也许你是那种对任何管制都深感厌恶的自由市场信徒。也许你是那种始终把公平置于效率之上的平等守望者。",
        next: "epilogue_7",
    },
    epilogue_7: {
        id: "epilogue_7", type: "dialogue", speaker: "立（Prophet）", avatar: "/avatar/prophet.png", bg: "black",
        text: "也许，你只是一个在不同情境下做出不同选择的普通人。而这，才是经济学真正想研究的对象。",
        next: "epilogue_ach",
    },
    epilogue_profile: { id: "epilogue_profile", type: "profile", bg: "black", next: "epilogue_profile" },
    epilogue_ach: { id: "epilogue_ach", type: "achievement", text: "时代的守望者 (The Watcher of Era)", description: "你经历了饥荒、通胀、垄断与暴动。你没有逃避，也没有被吞噬。你用权衡与妥协，硬生生地趟出了一条文明的活路。", bg: "dawn", next: "epilogue_final" },
    epilogue_final: { 
        id: "epilogue_final", type: "title_secret", bg: "black", 
        speaker: "【真结局：时代的守望者】", 
        text: "你醒来并非为了统治，而是为了抉择。 —— 感谢游玩《Village Economy》",
        next: "epilogue_profile",
    },

    // ─── 💀 坏结局 1：饿死殆尽 ───────────────────
    bad_ending_starved: { id: "bad_ending_starved", type: "narration", bg: "black", autoPlayDuration: 4000, text: "最后一声微弱的喘息也停止了。", next: "bad_ending_starved_2" },
    bad_ending_starved_2: { id: "bad_ending_starved_2", type: "narration", bg: "black", autoPlayDuration: 4000, text: "村子里再也没有活人。", next: "bad_ending_starved_3" },
    // 👇 背景废墟亮起，暂停等待点击
    bad_ending_starved_3: { id: "bad_ending_starved_3", type: "narration", bg: "ruins", autoPlayDuration: 4000, text: "即使是神，也无法统治一片没有人的土地。你的宏观调控，最终以绝对的死寂告终。", next: "bad_ending_starved_ach" },
    // 👇 成就浮现
    bad_ending_starved_ach: { id: "bad_ending_starved_ach", type: "achievement", bg: "ruins", text: "死寂之村 (A Ghost Town)", description: "你没有被推翻，也没有被击败。你只是在冰冷的算计中，失去了所有需要你计算的人。", next: "bad_ending_starved_title" },
    // 👇 背景化为纯黑
    bad_ending_starved_title: { id: "bad_ending_starved_title", type: "title_secret", bg: "black", speaker: "【坏结局：死寂之村】", text: "A Ghost Town." },

    // ─── 💀 坏结局 2：幸福度归零被推翻 ──────────────
    bad_ending_exiled: { id: "bad_ending_exiled", type: "narration", bg: "black", autoPlayDuration: 4000, text: "听到了吗？门外那些愤怒的火把和草叉。", next: "bad_ending_exiled_2" },
    bad_ending_exiled_2: { id: "bad_ending_exiled_2", type: "narration", bg: "black", autoPlayDuration: 4000, text: "你把他们逼到了绝境。", next: "bad_ending_exiled_3" },
    // 👇 背景烈火亮起，暂停等待点击
    bad_ending_exiled_3: { id: "bad_ending_exiled_3", type: "narration", bg: "fire", autoPlayDuration: 4000, text: "他们没收了你的财产，剥夺了你的权力，将你永远流放进了暴风雪中。", next: "bad_ending_exiled_ach" },
    bad_ending_exiled_ach: { id: "bad_ending_exiled_ach", type: "achievement", bg: "fire", text: "独裁者的末日 (The Fall of a Tyrant)", description: "你把效率凌驾于人性之上，最终被忍无可忍的人性反噬。执政者最大的错觉，是以为数字可以替代人心。", next: "bad_ending_exiled_title" },
    bad_ending_exiled_title: { id: "bad_ending_exiled_title", type: "title_secret", bg: "black", speaker: "【坏结局：独裁者的末日】", text: "The Fall of a Tyrant." },
};
