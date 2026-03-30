// src/lib/translations.ts
// All bilingual text for the game

export type Lang = "zh" | "en";

// ─── UI Strings ───────────────────────────────────────────────────────────────
export const UI = {
    zh: {
        // TopBar
        logOpen: "关闭日志",
        logClosed: "事件日志",
        newGame: "新游戏",
        langToggle: "EN",

        // LogDrawer
        logTitle: "村庄大事记 (Event Log)",

        // AchievementToast
        achievementUnlocked: "成就解锁",
        close: "关闭",

        // game/page.tsx – idle panel left
        dailyActionsTitle: "日常指令 (1 AP)",
        dailyActionsHint: "提示：高生产力可提升每日税收。幸福度低于40会导致怠工减产，高于80会吸引流民加入。",
        mobilizeName: "⛏️ 强制动员",
        mobilizeDesc: "+20生产力 (拉动次日税收)，但 -10幸福度。",
        raveName: "🪩 全村蹦迪",
        raveDesc: "举办狂欢。+20幸福度，但全体宿醉导致 -20生产力。",
        printMoneyName: "🖨️ 印钞发钱",
        printMoneyDesc: "凭空+¥2000，+5幸福。注意：资金远超生产力会引发CPI暴涨。",
        printMoneyLocked: "完成事件五解锁",

        // game/page.tsx – idle panel right
        constructionTitle: "基建工程",
        apRemaining: "尚有 AP 未消耗",
        nextDay: "进入下一天 🌙",
        farmName: "🌾 农场",
        farmDesc: "每日产粮 +8。解决温饱的基础。",
        pastureName: "🐄 牧场",
        pastureDesc: "每日产粮 +4。可能触发特定经济事件。",
        academyName: "📜 研究院",
        academyDesc: "科技倍率 +0.2。指数级放大矿场收益与GDP。",
        marketName: "🛒 市场",
        marketDesc: "每日额外入账 +¥150，大幅拉动消费。",
        mineName: "⚒️ 矿场",
        mineDesc: "每日巨额税收。受科技水平乘数加成。",

        // Daily summary
        summaryTitle: (day: number) => `第 ${day} 天结算单`,
        summaryRevenue: "💰 财政入账:",
        summaryFoodProd: "🌾 基础采摘与产出:",
        summaryFoodCons: "口 消耗储备:",
        summaryStarved: (n: number) => `💀 饿死 ${n} 人`,
        macroTitle: "📊 宏观指数收盘价",
        macroPopulation: "人口 (POP):",
        macroGdp: "总值 (GDP):",
        macroHappiness: "幸福 (HAP):",
        macroProductivity: "生产 (PROD):",
        macroCpi: "物价 (CPI):",
        macroUnemployment: "失业 (UNEMP):",
        summaryConfirm: "确认",

        // Crisis alert
        crisisTitle: "突 发 危 机",
        crisisShockLabel: "⚠️ 局势剧变，系统受到冲击：",
        crisisContinue: "继续",

        // Endings
        clickToProceed: "(点击进入结局)",
        restart: "重新轮回 (Restart)",
        nodeError: "节点崩溃",

        // Action log prefix
        actionPrefix: "【施政】",

        // page.tsx – title screen
        titleTagline: "\"You didn't wake up to rule, you woke up to decide.\"",
        startGame: "接受任命 (Start Game)",
        resetSave: "清除记忆 (Reset Save)",
        secretEndingTitle: "【结局：平庸之赐】",
    },
    en: {
        // TopBar
        logOpen: "Close Log",
        logClosed: "Event Log",
        newGame: "New Game",
        langToggle: "中文",

        // LogDrawer
        logTitle: "Event Log",

        // AchievementToast
        achievementUnlocked: "Achievement Unlocked",
        close: "Close",

        // game/page.tsx – idle panel left
        dailyActionsTitle: "Daily Actions (1 AP)",
        dailyActionsHint: "Tip: High productivity boosts daily tax. Happiness below 40 causes work slowdowns; above 80 attracts migrants.",
        mobilizeName: "⛏️ Forced Mobilization",
        mobilizeDesc: "+20 Productivity (boosts next day tax), but -10 Happiness.",
        raveName: "🪩 Village Rave",
        raveDesc: "Host a celebration. +20 Happiness, but everyone's hangover causes -20 Productivity.",
        printMoneyName: "🖨️ Print Money",
        printMoneyDesc: "Creates +¥2000 out of thin air, +5 Happiness. Warning: Excess money vs productivity causes CPI spikes.",
        printMoneyLocked: "Unlocked after Event 5",

        // game/page.tsx – idle panel right
        constructionTitle: "Construction",
        apRemaining: "AP remaining unused",
        nextDay: "Next Day 🌙",
        farmName: "🌾 Farm",
        farmDesc: "Daily food +8. The foundation of food security.",
        pastureName: "🐄 Pasture",
        pastureDesc: "Daily food +4. May trigger specific economic events.",
        academyName: "📜 Academy",
        academyDesc: "Tech multiplier +0.2. Exponentially amplifies mine income and GDP.",
        marketName: "🛒 Market",
        marketDesc: "Daily income +¥150, greatly stimulates consumption.",
        mineName: "⚒️ Mine",
        mineDesc: "Massive daily tax revenue. Amplified by tech level multiplier.",

        // Daily summary
        summaryTitle: (day: number) => `Day ${day} Report`,
        summaryRevenue: "💰 Revenue:",
        summaryFoodProd: "🌾 Foraging & Output:",
        summaryFoodCons: "🍽 Consumed:",
        summaryStarved: (n: number) => `💀 ${n} people starved`,
        macroTitle: "📊 Daily Macro Index",
        macroPopulation: "Population (POP):",
        macroGdp: "Total (GDP):",
        macroHappiness: "Happiness (HAP):",
        macroProductivity: "Production (PROD):",
        macroCpi: "Price Level (CPI):",
        macroUnemployment: "Unemployment (UNEMP):",
        summaryConfirm: "Confirm",

        // Crisis alert
        crisisTitle: "CRISIS ALERT",
        crisisShockLabel: "⚠️ Crisis shock effects:",
        crisisContinue: "Continue",

        // Endings
        clickToProceed: "(Click to proceed)",
        restart: "Restart",
        nodeError: "Node Error",

        // Action log prefix
        actionPrefix: "[Policy] ",

        // page.tsx – title screen
        titleTagline: "\"You didn't wake up to rule, you woke up to decide.\"",
        startGame: "Accept Appointment (Start Game)",
        resetSave: "Clear Memory (Reset Save)",
        secretEndingTitle: "[Ending: The Gift of Being Unremarkable]",
    },
};

// ─── Node Translations (English) ─────────────────────────────────────────────
// Only fields that differ from the Chinese original in nodes.ts
type NodeTranslation = {
    speaker?: string;
    text?: string | string[];
    choices?: Record<string, string>; // choiceKey -> localized title
    achievementText?: string;         // for achievement nodes: the title
    description?: string;             // for achievement nodes: the description
};

export const NODES_EN: Record<string, NodeTranslation> = {
    // ─── Event 1 ───────────────────────────────────────────────────────────
    event1_start: {
        speaker: "Villager A",
        text: "(The door bursts open) Chief! The granary... there isn't enough food for everyone!",
    },
    event1_prophet: {
        speaker: "Li (Prophet)",
        text: "Welcome, Chief. By the way — winter is coming.",
    },
    event1_dialogue_1: {
        speaker: "Villager 1 (Elder)",
        text: "We're old, we can manage with less. Save the food for the young ones...",
    },
    event1_dialogue_2: {
        speaker: "Villager 2 (Adult)",
        text: "If we don't have strength to work, the whole village will starve next season! We must protect the workers!",
    },
    event1_dialogue_3: {
        speaker: "Villager 3 (Child)",
        text: "Mama... are we going to go hungry?",
    },
    event1_prophet_2: {
        speaker: "Li (Prophet)",
        text: "Sometimes, refusing to choose is itself a choice. Current stock is only 18kg — enough for exactly 18 people. But you have 20 mouths to feed. Choose, Chief.",
    },
    event1_choice: {
        speaker: "Li (Prophet)",
        text: "(Current wheat: 18kg | Population: 20 | Minimum survival: 1kg/person)",
        choices: {
            A: "Equal Distribution (everyone gets 0.9kg)",
            B: "Prioritize Workers (elders and children get nothing)",
            C: "No Intervention (villagers fight for themselves)",
        },
    },
    event1_ending: {
        speaker: "Li (Prophet)",
        text: "Decision made? Good.",
    },
    event1_ending_2: {
        speaker: "Li (Prophet)",
        text: "Remember that feeling. The moment you made your choice, you permanently gave up something else. In economics, this is called [Opportunity Cost].",
    },

    // ─── Event 2 ───────────────────────────────────────────────────────────
    event2_start: {
        speaker: "Villager 1 (Mother)",
        text: "Chief, the children have eaten wheat porridge for a whole month — now they gag at the sight of it. My youngest was drooling watching the neighbor's cow yesterday, crying in her sleep wanting meat. Please, take some wheat to feed the cattle.",
    },
    event2_dialogue_2: {
        speaker: "Villager 2 (Old Man)",
        text: "Outrageous! This is life-saving grain! Full bellies and now they're picky? If spring brings drought or frost, what will you live on? Chief, this is a sin — wasting Heaven's blessing!",
    },
    event2_prophet: {
        speaker: "Li (Prophet)",
        text: "You see — for someone near starvation, the first bite of bread is a miracle; for someone full, the hundredth bite isn't even worth a dog's glance. This is the Law of Diminishing Marginal Utility. So, Chief — will you be the dictator who forces everyone to prepare for hardship, or the one who indulges their present appetites?",
    },
    event2_choice: {
        speaker: "Li (Prophet)",
        text: "(Wheat stock: Abundant | Happiness: Stagnant | Pasture: Newly built)",
        choices: {
            A: "Force all grain into storage reserves",
            B: "Official subsidy — convert wheat to meat",
            C: "Deregulate — allow villagers to brew and trade alcohol",
        },
    },
    event2_ending: {
        speaker: "Li (Prophet)",
        text: "What you just experienced is one of the most fundamental truths in economics.",
    },
    event2_ending_2: {
        speaker: "Li (Prophet)",
        text: "For someone near starvation, the first bite of bread is a miracle; for someone full, a mountain of bread doesn't move them. Every additional unit of consumption brings diminishing satisfaction. This is the [Law of Diminishing Marginal Utility].",
    },

    // ─── Event 3 ───────────────────────────────────────────────────────────
    event3_start: {
        speaker: "Villager 1 (Lumberjack)",
        text: "Chief! How do we build houses without wood? We can't keep living in drafty shacks! I'm just using my own strength to chop more trees so everyone can live warmer — what's wrong with that?",
    },
    event3_dialogue_2: {
        speaker: "Villager 2 (Fisherman)",
        text: "Cough... look at this river! Ruined by wood chips and mud! We can't catch fish, we can't even drink the water without getting sick — several elders have already fallen ill! Your new houses are built on our lives!",
    },
    event3_prophet: {
        speaker: "Li (Prophet)",
        text: "The lumberjack profits from wood while the whole village pays the price of drinking muddy water. When a piece of cake belongs to everyone, each person wants to bite the biggest piece before others finish. This is the Tragedy of the Commons. The market is blind to Negative Externality. Chief, will you be the unpopular villain who corrects it?",
    },
    event3_choice: {
        speaker: "Li (Prophet)",
        text: "(Riverside trees recklessly logged, water quality deteriorating, fishermen and lumberjacks at odds)",
        choices: {
            A: "Iron-fist logging ban — completely prohibit riverside logging",
            B: "Impose Pigouvian Tax — heavy levy on each unit of timber",
            C: "Privatize river rights — sell them to the fishermen",
        },
    },
    event3_ending: {
        speaker: "Li (Prophet)",
        text: "You just touched on one of the most troublesome problems in economics.",
    },
    event3_ending_2: {
        speaker: "Li (Prophet)",
        text: "When individually rational behavior accumulates into collective disaster, the market fails. This is [Negative Externality] and the [Tragedy of the Commons]. There is never just one solution, but every solution requires someone to pay the price.",
    },

    // ─── Event 4 ───────────────────────────────────────────────────────────
    event4_start: {
        speaker: "Villager 1 (Farmer)",
        text: "Chief, I've farmed this village for half my life! Now you bring in some iron machine that needs no labor, and we're all out? I have three mouths to feed at home — are you trying to push us to our deaths?",
    },
    event4_dialogue_2: {
        speaker: "Villager 2 (Farm Owner)",
        text: "This is efficiency! With the new tools, the village's food production doubles — no more famine worries! Chief, progress requires sacrifice. They'll just be left behind!",
    },
    event4_prophet: {
        speaker: "Li (Prophet)",
        text: "The bell-ringers of the old era always die under the gears of the new — this is Creative Destruction. If you stop for a few useless tears, this village will always remain a backwater. But the cost is standing right in front of you, alive. How will you face them?",
    },
    event4_choice: {
        speaker: "Li (Prophet)",
        text: "(New tools introduced, unemployment surged from 0% to 50%, unemployed gather in the square protesting)",
        choices: {
            A: "Smash the new tools — protect everyone's livelihood",
            B: "Heavy tax on farm owners — provide unemployment benefits",
            C: "Refuse to intervene — let the unemployed fend for themselves",
        },
    },
    event4_ending: {
        speaker: "Li (Prophet)",
        text: "Technological progress never asks how you feel.",
    },
    event4_ending_2: {
        speaker: "Li (Prophet)",
        text: "Old jobs die, new jobs are born — this cycle is called [Creative Destruction], as Schumpeter said. The question is never whether to change, but who bears the cost of change.",
    },

    // ─── Event 5 ───────────────────────────────────────────────────────────
    event5_start: {
        speaker: "Merchant",
        text: "Supplies from across the river can't get here — without a bridge, we'll be trapped! Chief, everyone trusts you. Just stamp some paper to use as money, buy the bridge materials first, and things will surely improve!",
    },
    event5_dialogue_2: {
        speaker: "Widow",
        text: "I've saved coins my whole life, hoping for something to bury me when I'm old. If you print that worthless paper and flood the market, my coins become scrap metal! Chief, you can't steal the last savings of us poor folk!",
    },
    event5_prophet: {
        speaker: "Li (Prophet)",
        text: "The printing press is the wand of power. It can conjure magnificent bridges out of thin air, and silently steal the last copper coin from a widow's pocket. This is Inflation. Chief, will you put on this ring of power?",
    },
    event5_choice: {
        speaker: "Li (Prophet)",
        text: "(Treasury empty, bridge urgently needed, village desperately needs a trade route)",
        choices: {
            A: "Print money to build the bridge (Quantitative Easing)",
            B: "Hold firm to hard currency — refuse to print",
            C: "Forcibly seize wealthy merchants' assets to build the bridge",
        },
    },
    event5_ending: {
        speaker: "Li (Prophet)",
        text: "You just made a decision about the nature of money.",
    },
    event5_ending_2: {
        speaker: "Li (Prophet)",
        text: "Money is nothing but paper that everyone believes has value. When the issuer abuses this trust, every coin quietly loses value. This is [Inflation] — the most covert form of taxation by power.",
    },

    // ─── Event 6 ───────────────────────────────────────────────────────────
    event6_start: {
        speaker: "Farmer",
        text: "Triple price! He dares charge triple for a lousy iron hoe! He's drinking our blood! Chief, you're our official — if you don't control this corrupt merchant, we'll have no choice but to fight him with stones!",
    },
    event6_dialogue_2: {
        speaker: "Mine Owner",
        text: "It's my mine, I paid people to dig the iron — I have every right to set any price I want. Too expensive? Then dig with your hands. Don't forget, Chief, I was the one who donated for last month's village security. Who's actually keeping this village running?",
    },
    event6_prophet: {
        speaker: "Li (Prophet)",
        text: "When the market loses competition, the invisible hand clenches into a fist and punches consumers in the face. Strip the merchant's pricing power, or watch the farmers bleed? Which side of the scale of power will you tilt?",
    },
    event6_choice: {
        speaker: "Li (Prophet)",
        text: "(Mine owner controls the only iron mine, tool prices have tripled, agricultural crisis imminent)",
        choices: {
            A: "Issue price ceiling order — forcibly lower tool prices",
            B: "Government-funded new mine exploration — support competitors",
            C: "No interference — protect the merchant's absolute pricing rights",
        },
    },
    event6_ending: {
        speaker: "Li (Prophet)",
        text: "The market has never been naturally fair.",
    },
    event6_ending_2: {
        speaker: "Li (Prophet)",
        text: "When one company controls the entire market, the invisible hand becomes an invisible fist. This is [Monopoly]. How you intervene determines who bears the cost.",
    },

    // ─── Event 7 ───────────────────────────────────────────────────────────
    event7_start: {
        speaker: "Restaurant Owner",
        text: "Chief, please save me! Snow has blocked the roads for two weeks — not a single customer, I can't pay my workers! If there's no income tomorrow, I'll have to jump into an ice hole!",
    },
    event7_dialogue_2: {
        speaker: "Miser",
        text: "It's freezing outside — only a fool would go out to eat? Who knows when this blizzard will end? Holding money tight until winter passes — isn't that the most natural thing to do?",
    },
    event7_prophet: {
        speaker: "Li (Prophet)",
        text: "For an individual, saving during a crisis is rational; but when everyone saves at the same time, the macroeconomic engine completely stalls. If you don't force them to spend, everyone can embrace bankruptcy together in this dead winter silence.",
    },
    event7_choice: {
        speaker: "Li (Prophet)",
        text: "(Extreme blizzard blocking roads, entire village hoarding money, restaurant on the verge of bankruptcy, Paradox of Thrift in full effect)",
        choices: {
            A: "Issue consumption vouchers — forcibly stimulate demand",
            B: "Let the restaurant go bankrupt — wait for natural clearing",
            C: "Nationalize the restaurant — Chief pays the wages",
        },
    },
    event7_ending: {
        speaker: "Li (Prophet)",
        text: "Everyone did the most rational thing for themselves, yet the whole village fell into the most irrational predicament.",
    },
    event7_ending_2: {
        speaker: "Li (Prophet)",
        text: "When everyone saves at once, aggregate demand collapses. This is the [Paradox of Thrift] — the sum of individual rationality sometimes equals collective disaster. Keynes called it macroeconomics' deepest trap.",
    },

    // ─── Event 8 ───────────────────────────────────────────────────────────
    event8_start: {
        speaker: "Laborer",
        text: "The plague is coming and we'll all die! Why should we starving poor folk pay the same as those rich landowners in big houses? Even one of their hairs is thicker than our waist!",
    },
    event8_dialogue_2: {
        speaker: "Rich Merchant",
        text: "My wealth was earned through hard work, early mornings and late nights — not blown in by the wind! I already pay plenty. Why should I work harder just to be bled dry by you poor folk to fill your pit?",
    },
    event8_prophet: {
        speaker: "Li (Prophet)",
        text: "Is taxation the price of civilization, or legalized robbery? The math is simple, but the ethics behind it can start wars. Who should pay for the public good? This tests not just your arithmetic, but your moral foundation.",
    },
    event8_choice: {
        speaker: "Li (Prophet)",
        text: "(Plague approaching, public water well urgently needed, rich merchant and poor farmers at each other's throats over tax policy)",
        choices: {
            A: "Progressive taxation — wealthy pay a higher percentage",
            B: "Poll tax — everyone pays the same flat amount",
            C: "Refuse mandatory taxation — launch voluntary crowdfunding",
        },
    },
    event8_ending: {
        speaker: "Li (Prophet)",
        text: "Public goods are what the market can never spontaneously provide.",
    },
    event8_ending_2: {
        speaker: "Li (Prophet)",
        text: "Clean water, national defense, street lights — no one wants to pay for themselves, yet everyone hopes others foot the bill. This is the [Free Rider Problem]. Taxation is the coercive solution. As for fairness — everyone has a different answer in their heart.",
    },

    // ─── Event 9 ───────────────────────────────────────────────────────────
    event9_start: {
        speaker: "Blacksmith",
        text: "Chief! Three generations of my family have worked iron here! If you let those outsiders' cheap tools in, my forge must go cold, my wife and children will be on the streets! Can you bear to watch your own village folk starve at the hands of outsiders?",
    },
    event9_dialogue_2: {
        speaker: "Farmers' Representative",
        text: "With the outsiders' cheap tools, we could grow enough food to feed double the village! For the sake of one blacksmith's shop, the whole village suffers with bad hoes — is that fair?",
    },
    event9_prophet: {
        speaker: "Li (Prophet)",
        text: "David Ricardo's Comparative Advantage. Trade can indeed make the whole richer — but Chief, how will you look the soon-to-be-bankrupt blacksmith in the eye and tell him he is the cost of this grand theory?",
    },
    event9_choice: {
        speaker: "Li (Prophet)",
        text: "(Neighboring village willing to trade cheap iron tools for our surplus wheat, local blacksmith shop faces closure)",
        choices: {
            A: "Issue trade ban — close the borders",
            B: "Impose heavy tariffs on imported iron tools",
            C: "Embrace full free trade",
        },
    },
    event9_ending: {
        speaker: "Li (Prophet)",
        text: "Trade makes the whole richer, but guarantees no individual will benefit.",
    },
    event9_ending_2: {
        speaker: "Li (Prophet)",
        text: "Every village should focus on what it does best, then trade with others. This is [Comparative Advantage]. Trade creates wealth, but distributing that wealth is always another war.",
    },

    // ─── Event 10 ──────────────────────────────────────────────────────────
    event10_start: {
        speaker: "Exporter",
        text: "Chief, the neighboring village has no shame — they've devalued their currency to nothing! Our wheat costs more than gold over there, nobody buys it! The granary will rot. We must retaliate and devalue too!",
    },
    event10_dialogue_2: {
        speaker: "Consumer",
        text: "Don't listen to him! If we don't devalue, sure we can't sell wheat — but with our current currency buying their goods is like getting it free! I don't care about his livelihood, I only care about how much meat my money can buy!",
    },
    event10_prophet: {
        speaker: "Li (Prophet)",
        text: "When currencies decouple, nations begin to sink. Welcome to the ultimate battlefield of macroeconomics: the currency war. Will you choose the race to the bottom, or hold firm to monetary dignity? Decide — this is your final judgment as a ruler.",
    },
    event10_choice: {
        speaker: "Li (Prophet)",
        text: "(Neighboring village maliciously devalued currency, our wheat exports dropped to zero, granary unsold, currency war on the verge of eruption)",
        choices: {
            A: "Fight fire with fire — actively devalue our currency",
            B: "Hold steady — maintain strong exchange rate",
            C: "Forcibly establish a monetary union — unify currency with neighboring village",
        },
    },
    event10_ending: {
        speaker: "Li (Prophet)",
        text: "You made the final decision.",
    },
    event10_ending_2: {
        speaker: "Li (Prophet)",
        text: "The value of currency is built on trust. When two nations use devaluation to compete for advantage, both ultimately lose. This is [Competitive Devaluation] — a Prisoner's Dilemma with no end.",
    },

    // ─── Epilogue ──────────────────────────────────────────────────────────
    epilogue_1: {
        speaker: "(System)",
        text: "[Season 10 Complete]\n\nTen decisions. Ten judgments.\n\nThis village has traversed the most fundamental questions in human economic history.",
    },
    epilogue_2: {
        speaker: "Li (Prophet)",
        text: "You know, I've observed many chiefs. Some see famine and instinctively distribute equally; some see unemployment and instinctively start the printing press; some see monopoly and instinctively let the market sort it out.",
    },
    epilogue_3: {
        speaker: "Li (Prophet)",
        text: "None of these instincts is wrong. Keynes, Hayek, Marx — they all saw real problems, just prescribed different remedies. And every remedy has its side effects.",
    },
    epilogue_4: {
        speaker: "Li (Prophet)",
        text: "Scarcity, opportunity cost, marginal utility, externalities, creative destruction, inflation, monopoly, paradox of thrift, comparative advantage, currency wars — everything you experienced plays out in the real world every day, just scaled up by hundreds of millions.",
    },
    epilogue_5: {
        speaker: "Li (Prophet)",
        text: "So, I recorded your every decision. Not to judge you, but to tell you — inside you lives an economist.",
    },
    epilogue_6: {
        speaker: "Li (Prophet)",
        text: "Perhaps you are the macro-architect who believes government intervention can smooth all volatility. Perhaps you are the free-market believer who abhors any regulation. Perhaps you are the equality guardian who always places fairness above efficiency.",
    },
    epilogue_7: {
        speaker: "Li (Prophet)",
        text: "Or perhaps you are simply an ordinary person making different choices in different situations. And that — is exactly what economics truly wants to study.",
    },
    epilogue_ach: {
        achievementText: "The Watcher of Era (时代的守望者)",
        description: "You experienced famine, inflation, monopoly, and riots. You neither fled nor were consumed. Through weighing and compromise, you forged a path for civilization to survive.",
    },
    epilogue_final: {
        speaker: "[True Ending: The Watcher of Era]",
        text: "You didn't wake up to rule — but to decide. — Thank you for playing Village Economy",
    },

    // ─── Bad Endings ───────────────────────────────────────────────────────
    bad_ending_starved: {
        text: "The last faint breath has ceased.",
    },
    bad_ending_starved_2: {
        text: "There are no more living souls in the village.",
    },
    bad_ending_starved_3: {
        text: "Even a god cannot rule a land with no people. Your macroeconomic management ended in absolute silence.",
    },
    bad_ending_starved_ach: {
        achievementText: "A Ghost Town (死寂之村)",
        description: "You were neither overthrown nor defeated. You simply lost, in cold calculation, everyone you needed to calculate for.",
    },
    bad_ending_starved_title: {
        speaker: "[Bad Ending: A Ghost Town]",
        text: "A Ghost Town.",
    },
    bad_ending_exiled: {
        text: "Do you hear them? The angry torches and pitchforks outside your door.",
    },
    bad_ending_exiled_2: {
        text: "You pushed them to the brink.",
    },
    bad_ending_exiled_3: {
        text: "They confiscated your property, stripped your power, and exiled you forever into the blizzard.",
    },
    bad_ending_exiled_ach: {
        achievementText: "The Fall of a Tyrant (独裁者的末日)",
        description: "You placed efficiency above humanity, and were ultimately devoured by the humanity you pushed too far. A ruler's greatest delusion is thinking numbers can replace the human heart.",
    },
    bad_ending_exiled_title: {
        speaker: "[Bad Ending: The Fall of a Tyrant]",
        text: "The Fall of a Tyrant.",
    },
};

// ─── Achievement Translations (English) ──────────────────────────────────────
// For achievements stored in game state (effect-triggered, id-keyed)
export const ACHIEVEMENT_EN: Record<string, { title: string; description: string }> = {
    ach_shared_hardship: {
        title: "Shared Hardship",
        description: "You chose to let everyone struggle through together. But under absolute scarcity, equal distribution led to an overall decline in efficiency.",
    },
    ach_optimal_question: {
        title: "Optimal Solution?",
        description: "You put the future before the present. The cold-blooded embodiment of utility maximization in extreme conditions.",
    },
    ach_free_or_escape: {
        title: "Freedom or Evasion",
        description: "You chose not to decide for anyone. Experience the cost of Hayekian spontaneous order.",
    },
    ach_prudent_ruler: {
        title: "Prepared for the Worst",
        description: "You forced grain into storage. Villagers grumble endlessly, but the warehouse is full of disaster reserves. Keynesian risk prevention — at the cost of short-term public trust.",
    },
    ach_utility_maximizer: {
        title: "Utility Maximization",
        description: "The aroma of meat fills the village, happiness soars. But wheat reserves are drastically reduced, shortening the buffer for the next disaster.",
    },
    ach_invisible_hand: {
        title: "The Invisible Hand",
        description: "A black market spontaneously formed, filled with the scent of alcohol. Gold flows in, but the sober workforce shrinks. Austrian School spontaneous order — sometimes it smells like booze.",
    },
    ach_iron_fist: {
        title: "Iron Fist for the River",
        description: "Water quality restored, fishermen rejoice. But timber output plummeted, construction costs skyrocketed, economic growth stalled. Public interest above all — the cost is development itself.",
    },
    ach_pigouvian: {
        title: "Pigou's Abacus",
        description: "Tax revenue fills the treasury, logging rate approaches equilibrium, water quality slowly recovers. Internalizing external costs — making polluters pay for their damage.",
    },
    ach_coase_theorem: {
        title: "Coase's Hand",
        description: "Fishermen gained property rights and sought pollution compensation from lumberjacks; the market found equilibrium after fierce negotiation. Coase Theorem: clear property rights, no government intervention needed.",
    },
    ach_luddite: {
        title: "Luddite",
        description: "Farmers cheer, the square returns to calm. But in the broken pieces of new tools lies the future this village could have had. Tech level permanently set back.",
    },
    ach_welfare_state: {
        title: "Welfare State",
        description: "The unemployed received benefits, catching a brief breath. But the fiscal hole grows larger, a deficit crisis brews in the shadows. This is Keynesianism's warmth — and its weakness.",
    },
    ach_creative_destruction: {
        title: "Creative Destruction",
        description: "The pain is real, the crying is real. But surviving this winter, blacksmiths, weavers, and cooks emerged from the unemployed — a new service industry took root.",
    },
    ach_money_printer: {
        title: "The Money Printer Roars",
        description: "The bridge is built, goods flow freely. But the widow finds her saved coins can buy less than half what they used to. Inflation — civilization's most hidden tax.",
    },
    ach_gold_standard: {
        title: "Dignity of Hard Currency",
        description: "The widow's coins maintained purchasing power, villagers trust the currency. But the bridge was never built, and prosperity across the river remains out of reach.",
    },
    ach_expropriation: {
        title: "Expropriation Order",
        description: "The bridge is built, CPI unchanged. But the merchants' eyes changed — who would dare accumulate wealth here? Private investment intent fell to absolute zero.",
    },
    ach_price_ceiling: {
        title: "Price Ceiling",
        description: "Farmers smiled, mine owner stopped working. Prices fell, but tools disappeared. On the supply-demand curve, the Deadweight Loss is staggering.",
    },
    ach_antitrust: {
        title: "Antitrust War",
        description: "The treasury bled heavily, but competition returned. Iron from the new mine pulled the monopolist off the pedestal. Market equilibrium — purchased with public funds.",
    },
    ach_trickle_down: {
        title: "Trickle-down Effect",
        description: "Farmers suffer while the mine owner's wealth piles up. Finally, he invested in village road construction — trickle-down effect, justice delayed.",
    },
    ach_helicopter_money: {
        title: "Helicopter Money",
        description: "Vouchers issued, restaurant survived, GDP stabilized. But prices quietly rose — Keynesianism propping up aggregate demand, at the cost of future inflation.",
    },
    ach_liquidationist: {
        title: "Liquidationist",
        description: "The restaurant failed, unemployed roam the streets. But after deflation, prices fell and the economic structure repaired itself in agony. The Austrian School prescription — bitter and potent.",
    },
    ach_nationalization: {
        title: "Nationalization",
        description: "The restaurant didn't fail, workers get paid. But from now on, every dish requires approval from the Chief's office. The cost of bureaucracy — you haven't even started calculating it.",
    },
    ach_progressive_tax: {
        title: "Nordic Dream",
        description: "Well built, plague averted. Lower-class villagers spread the good news, rich merchant silently chilled. Redistribution narrowed wealth gap, but commercial investment intent quietly declined.",
    },
    ach_flat_tax: {
        title: "Tax Neutrality",
        description: "Well built, plague averted. Rich merchant satisfied with the tax system, capital continues to accumulate. But the burden crushed poor farmers' backs, the class divide deepened another inch.",
    },
    ach_free_rider: {
        title: "Free Rider",
        description: "Crowdfunding failed. Everyone waited for others to donate first. The well was never built, the plague came. Property rights were defended — but the cost was death. This is the Free Rider Problem.",
    },
    ach_protectionism: {
        title: "Isolation Decree",
        description: "The blacksmith's forge stayed lit. But villagers continue with cumbersome old tools, inefficiency growing, drifting further from prosperity beyond the mountains. Protection is tenderness with a cost.",
    },
    ach_tariff: {
        title: "Tariff Barrier",
        description: "Treasury filled, blacksmith barely maintained, farmers got half-price tools. No one completely satisfied, no one completely devastated — this is the art of compromise.",
    },
    ach_comparative_advantage: {
        title: "Comparative Advantage",
        description: "The blacksmith's forge went cold, an unemployment wave hit the village. But the granary overflows, GDP soared. Ricardo was right — but he didn't tell you how to face that unemployed blacksmith.",
    },
    ach_currency_war: {
        title: "Tit for Tat",
        description: "Exports recovered, unsold wheat finally sold. But every villager's pocket money quietly shrank. Competitive devaluation — a race to the bottom with no winners.",
    },
    ach_strong_currency: {
        title: "Monetary Dignity",
        description: "The export industry cries out in misery, but every coin's purchasing power remains as strong as ever. Strong currency is a silent declaration: we refuse to participate in this race to the bottom.",
    },
    ach_monetary_union: {
        title: "Monetary Union",
        description: "The currency war is permanently ended, trade flows freely. But the cost is, you can no longer use money printing to solve any domestic crisis. Power sometimes requires you to hand it over yourself to achieve true stability.",
    },
    ending_watcher_of_era: {
        title: "The Watcher of Era",
        description: "You endured famine, inflation, monopoly, and revolt. You were neither consumed nor defeated, and carved a path for civilization through tradeoffs and compromise.",
    },
    ending_ghost_town: {
        title: "A Ghost Town",
        description: "You were not overthrown or defeated. You simply lost everyone for whom you were doing the calculations.",
    },
    ending_fall_of_tyrant: {
        title: "The Fall of a Tyrant",
        description: "You placed efficiency above humanity and were ultimately devoured by the backlash of people pushed too far.",
    },
    ending_unremarkable: {
        title: "The Gift of Being Unremarkable",
        description: "You gave up the power to understand and shape the world. In a world built from choices, you chose to stop choosing.",
    },
};

// ─── Crisis Translations (English) ───────────────────────────────────────────
export const CRISIS_EN: Record<string, { title: string; description: string }> = {
    bad_ending_starved: {
        title: "Village Annihilated",
        description: "The last villager has fallen. This land returns to absolute silence.",
    },
    bad_ending_exiled: {
        title: "Peasant Uprising",
        description: "The completely desperate villagers stormed the Chief's office! They stripped your power and are ready to exile you forever!",
    },
    event_riot: {
        title: "Full Village Riot",
        description: "The villagers' fury ignited! They smashed buildings and raided the treasury!",
    },
    event2_start: {
        title: "The Temptation of Meat",
        description: "Villagers are bored of wheat and someone secretly fed large amounts of strategic grain reserves to the livestock!",
    },
    event4_start: {
        title: "The Roar of Machines",
        description: "The academy incubated fully automated farm tools, massively boosting productivity — but instantly destroying the livelihoods of many traditional farmers!",
    },
    event5_start: {
        title: "The Bottleneck of Commerce",
        description: "The market is built, but barter is too inefficient. The treasury was completely drained by early construction, and the bridge project was forced to halt.",
    },
    event6_start: {
        title: "The Fangs of Capital",
        description: "Mining development led to monopoly. A savvy merchant seized the iron mine and instantly tripled all farm tool prices!",
    },
    event3_start: {
        title: "The Blackened River",
        description: "Massive construction led to unrestrained logging. The river is severely polluted, fishermen and elders are falling ill!",
    },
    event7_start: {
        title: "Winter and Silence",
        description: "An extreme blizzard has struck! Everyone locked indoors is hoarding money, and market demand has instantly collapsed!",
    },
    event8_start: {
        title: "The Shadow of Plague",
        description: "A plague approaches the village, urgently requiring massive funds to build clean water facilities. Panic is spreading!",
    },
    event9_start: {
        title: "The Foreign Dumping",
        description: "The neighboring village flooded the market with extremely cheap iron tools, instantly bankrupting the local blacksmith's shop!",
    },
    event10_start: {
        title: "Currency War",
        description: "The neighboring village maliciously devalued their currency! Our exported wheat became extremely expensive, and trade orders instantly dropped to zero!",
    },
};

// ─── Engine Message Templates ─────────────────────────────────────────────────
export const ENGINE_MSG = {
    zh: {
        famineSpread: (n: number) => `⚠️ 饥荒蔓延：储备耗尽，惨死 ${n} 人！`,
        foodShortage: `⚠️ 粮食短缺：全村陷入饥饿，虚弱导致生产力骤降。`,
        riotEdge: `😡 暴乱边缘：村民罢工抗议，税收枯竭，设施遭到破坏！`,
        discontent: `😤 民怨沸腾：村民消极怠工，税收大减。`,
        immigrants: (n: number) => `🌟 繁荣之城：丰衣足食吸引了 ${n} 名流民定居！`,
        hyperinflation: `💸 恶性通胀：手中的钱变成废纸，民不聊生！`,
        priceSurge: `🛒 物价飞涨：生活成本攀升，引发不满。`,
        unemployment: `📉 绝望蔓延：遍地无业游民，社会治安恶化！`,
        stability: `🍞 仓廪实而知礼节：生活安定，幸福度自然回升。`,
        dailyLog: (day: number, foodProd: number, foodCons: number, income: number) =>
            `【第${day}天结账】产粮+${foodProd} 消耗-${foodCons} | 资金+${income}`,
        achievementLog: (title: string) => `成就解锁：${title}`,
    },
    en: {
        famineSpread: (n: number) => `⚠️ Famine Spreads: Reserves depleted, ${n} people starved to death!`,
        foodShortage: `⚠️ Food Shortage: The whole village is starving, weakness causing productivity to plummet.`,
        riotEdge: `😡 On the Edge of Riots: Villagers strike in protest, tax revenues collapse, facilities are damaged!`,
        discontent: `😤 Public Anger Rising: Villagers work half-heartedly, tax revenues sharply reduced.`,
        immigrants: (n: number) => `🌟 Prosperous Village: Abundance attracted ${n} migrants to settle!`,
        hyperinflation: `💸 Hyperinflation: Money becomes worthless, the people suffer!`,
        priceSurge: `🛒 Soaring Prices: Cost of living rises, discontent brewing.`,
        unemployment: `📉 Despair Spreading: Unemployed everywhere, public order deteriorates!`,
        stability: `🍞 Full Granaries Breed Civility: Life is stable, happiness naturally rises.`,
        dailyLog: (day: number, foodProd: number, foodCons: number, income: number) =>
            `[Day ${day} Report] Food+${foodProd} Consumed-${foodCons} | Income+${income}`,
        achievementLog: (title: string) => `Achievement Unlocked: ${title}`,
    },
};

// ─── Title Screen Script (English overrides) ──────────────────────────────────
// Indexed to match the SCRIPT array in src/app/page.tsx
type ScriptOverride = {
    speaker?: string;
    text?: string;
    choices?: string[];
    description?: string;
};

export const SCRIPT_TEXT_EN: Record<number, ScriptOverride> = {
    0:  { text: "You wake up in an unfamiliar room, surrounded by darkness..." },
    1:  { speaker: "Auntie 1", text: "Wasn't he fine just yesterday?" },
    2:  { speaker: "Auntie 2", text: "Indeed." },
    3:  { speaker: "Auntie 3", text: "Could it be... brain damage?" },
    4:  { text: "(Slowly opening your eyes, the scene brightens — a donkey's large face appears before you)" },
    5:  { text: "(Two seconds later, it spoke.)" },
    6:  { speaker: "Him", text: "(sighs) You're finally awake." },
    7:  { text: "(The scene darkens again, you slowly close your eyes)" },
    8:  { text: "\"Where am I? Did I eat something bad? Wait — how can a donkey talk!\"" },
    9:  { text: "(You open your eyes again; the donkey is still there, watching quietly)" },
    10: { choices: ["Did... did you just speak?"] },
    11: { speaker: "You", text: "Did... did you just speak?" },
    12: { speaker: "Donkey", text: "More importantly, you should worry about where you are." },
    13: { speaker: "Auntie 1", text: "(whispering) He's talking to himself again." },
    14: { speaker: "Auntie 3", text: "I told you — brain damage." },
    15: { speaker: "Auntie 2", text: "So... is he still going to be the village chief?" },
    16: { choices: ["Village chief? What are... they saying?"] },
    17: { speaker: "You", text: "You blink: \"Village chief?\" You turn to the donkey: \"What... are they saying?\"" },
    18: { speaker: "Donkey", text: "Simply put, this village is on the verge of collapse, and the people here can't even do the most basic arithmetic..." },
    19: { speaker: "Donkey", text: "And you, the outsider, have become their hope — they're discussing making you the village chief." },
    20: { text: "On Becoming Village Chief After Reincarnation", description: "Unknowingly inherited a micro-economy on the verge of collapse." },
    // 21 = title screen (no text override needed, buttons handled in UI)
    22: { text: "The moment your memories were taken away, you felt something unfamiliar for the first time. Not the lightness of victory — but the relief of no longer needing to choose." },
    23: { text: "No more weighing hunger against fairness. No more answering to a future you cannot see." },
    24: { text: "You became one of them — someone who no longer needs to understand how the world works." },
    25: { text: "You rise with the sun and rest with it. The world is no longer a system — just a piece of land beneath your feet." },
    26: { speaker: "Wandering Merchant", text: "Inflation is out of control! Marginal utility has collapsed! You people don't even understand macroeconomics!" },
    27: { text: "You don't understand. And you no longer want to." },
    28: { text: "You look at your calloused hands. The wheat is growing well this year. Tonight you can cook the children an extra bowl of porridge." },
    29: { text: "You marry, have children, and grow old in the small details of daily life." },
    30: { text: "You no longer try to explain the world. You simply live in it." },
    31: { text: "Perhaps this is another kind of freedom." },
    32: { text: "As the ancient saying goes: with much wisdom comes much sorrow." },
    33: { text: "And you chose a life that does not need to be justified." },
    34: { text: "The Gift of Being Unremarkable (平庸之赐)", description: "You gave up the power to understand and shape the world. In a system built on choices, you chose to stop choosing." },
    // 35 = title_secret (no text, handled as fallback in UI)
};

// ─── Localization helpers ─────────────────────────────────────────────────────
export function localizeNode(node: Record<string, unknown>, lang: Lang): Record<string, unknown> {
    if (lang === "zh") return node;
    const t = NODES_EN[node.id as string];
    if (!t) return node;

    const result = { ...node };
    if (t.speaker !== undefined) result.speaker = t.speaker;
    if (t.text !== undefined) result.text = t.text;
    if (t.description !== undefined) result.description = t.description;
    if (t.achievementText !== undefined) result.text = t.achievementText;
    if (t.choices && Array.isArray(node.choices)) {
        result.choices = (node.choices as Array<Record<string, unknown>>).map((c) => ({
            ...c,
            title: t.choices?.[c.key as string] ?? c.title,
        }));
    }
    return result;
}

export function localizeAchievement(
    achievement: { id: string; title: string; description: string },
    lang: Lang
): { title: string; description: string } {
    if (lang === "zh") return achievement;
    return ACHIEVEMENT_EN[achievement.id] ?? achievement;
}

export function localizeCrisis(
    crisis: { eventId: string; title: string; description: string },
    lang: Lang
): { title: string; description: string } {
    if (lang === "zh") return crisis;
    return CRISIS_EN[crisis.eventId] ?? crisis;
}
