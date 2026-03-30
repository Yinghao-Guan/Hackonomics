// src/lib/engine.ts
import type { Effect, GameStats } from "./nodes";
import type { GameState } from "./gameState";
import { clampStats } from "./gameState";
import type { Lang } from "./translations";
import { ENGINE_MSG, CRISIS_EN } from "./translations";

export type DailySummary = {
    day: number; foodProd: number; foodCons: number; starved: number; income: number; messages: string[];
    macro: { population: number; happiness: number; productivity: number; cpi: number; unemploymentRate: number; gdp: number; };
};

export type CrisisAlert = {
    eventId: string; title: string; description: string; shockEffects: Effect[];
};

// Raw crisis definitions in Chinese (source of truth)
const CRISIS_ZH = {
    allStarved:  { title: "全村覆没",  description: "最后一名村民也倒下了。这片土地重新归于死寂。" },
    exiled:      { title: "暴民起义",  description: "彻底绝望的村民冲破了村长办公室！他们剥夺了你的权力，准备将你永远流放！" },
    riot:        { title: "全村暴动",  description: "村民的怒火彻底点燃！他们砸毁了建筑，抢走了金库里的钱！" },
    meatTempt:   { title: "肉食的诱惑", description: "村民对小麦感到厌烦，有人开始觊觎牧场里的牛羊，私自将大量战略储备粮喂给牲畜！" },
    machinery:   { title: "机器的轰鸣", description: "研究院孵化出了全自动农具，大幅提升了生产力，但也瞬间摧毁了大量传统农夫的生计！" },
    bottleneck:  { title: "流通的瓶颈", description: "市场建成了，但以物易物的效率太低，财政库因为前期建设彻底枯竭，桥梁工程被迫停工。" },
    monopoly:    { title: "资本的獠牙", description: "矿产大开发带来了垄断。精明的商人控制了铁矿，瞬间将所有农具价格提高了三倍！" },
    pollution:   { title: "黑色的河流", description: "大规模的基建导致无节制的砍伐。河流被严重污染，渔民和老人开始生病倒下！" },
    blizzard:    { title: "寒冬与死寂", description: "极寒暴风雪突然降临！所有人闭门不出疯狂存钱，市场需求瞬间坍塌！" },
    plague:      { title: "瘟疫的阴影", description: "一场瘟疫逼近村庄，急需巨资修建净水设施。恐慌情绪蔓延！" },
    dumping:     { title: "外来的倾销", description: "邻村用极其廉价的铁器涌入市场，导致本地铁匠铺当场破产！" },
    currencyWar: { title: "货币战争",  description: "邻村恶意大幅贬值货币！我们出口的小麦变得极其昂贵，贸易订单瞬间归零！" },
};

function makeCrisis(
    key: keyof typeof CRISIS_ZH,
    eventId: string,
    shockEffects: Effect[],
    lang: Lang
): CrisisAlert {
    const zh = CRISIS_ZH[key];
    const en = CRISIS_EN[eventId];
    const { title, description } = lang === "en" && en ? en : zh;
    return { eventId, title, description, shockEffects };
}

export function processDailyTick(
    state: GameState,
    lang: Lang = "zh"
): { state: GameState; summary: DailySummary; crisis: CrisisAlert | null } {
    let next = structuredClone(state);
    let s = next.stats;
    const msg = ENGINE_MSG[lang];
    let summary: DailySummary = {
        day: s.day, foodProd: 0, foodCons: 0, starved: 0, income: 0, messages: [],
        macro: { population: 0, happiness: 0, productivity: 0, cpi: 0, unemploymentRate: 0, gdp: 0 },
    };

    // --- 1. Agriculture & survival ---
    const baseForaging = Math.floor(s.population * 0.4);
    const prodMultiplier = Math.max(0.1, s.productivity / 100);
    const farmingOutput = Math.floor(((s.farmLevel * 8) + (s.pastureLevel * 4)) * prodMultiplier);
    summary.foodProd = baseForaging + farmingOutput;
    summary.foodCons = s.population;

    s.foodStock += summary.foodProd;
    s.foodStock -= summary.foodCons;

    if (s.foodStock < 0) {
        summary.starved = Math.ceil(Math.abs(s.foodStock) / 1.5);
        if (summary.starved > 0) {
            s.population -= summary.starved;
            s.happiness -= 10;
            s.productivity -= summary.starved * 5;
            summary.messages.push(msg.famineSpread(summary.starved));
        } else {
            summary.messages.push(msg.foodShortage);
            s.productivity -= 5;
            s.happiness -= 5;
        }
        s.foodStock = 0;
    }

    // --- 2. Economy & tax ---
    let baseIncome = (s.population * 5) + (s.marketLevel * 150) + (s.productivity * 3) + (s.mineLevel * 300 * s.techLevel);

    if (s.happiness <= 20) {
        baseIncome = Math.floor(baseIncome * 0.2);
        s.productivity = Math.max(0, s.productivity - 15);
        summary.messages.push(msg.riotEdge);
    } else if (s.happiness < 40) {
        baseIncome = Math.floor(baseIncome * 0.6);
        s.productivity = Math.max(0, s.productivity - 5);
        summary.messages.push(msg.discontent);
    } else if (s.happiness > 70) {
        baseIncome = Math.floor(baseIncome * 1.3);
    }

    summary.income = Math.floor(baseIncome);
    s.money += summary.income;

    // --- 3. Macro linkage ---
    if (s.gdp > 3000 && s.happiness >= 50 && s.foodStock > s.population * 2) {
        const immigrants = Math.max(1, Math.floor(s.gdp / 2500));
        s.population += immigrants;
        summary.messages.push(msg.immigrants(immigrants));
    }

    if (s.cpi > 200) {
        s.happiness -= 10;
        s.productivity -= 10;
        summary.messages.push(msg.hyperinflation);
    } else if (s.cpi > 120) {
        s.happiness -= 5;
        summary.messages.push(msg.priceSurge);
    }

    if (s.unemploymentRate > 30) {
        s.happiness -= 10;
        summary.messages.push(msg.unemployment);
    }

    if (s.foodStock > s.population * 2 && s.unemploymentRate <= 15 && s.cpi <= 120 && s.happiness < 90) {
        s.happiness += 2;
        summary.messages.push(msg.stability);
    }

    s.actionPoints = 3;
    s.day += 1;

    next.stats = clampStats(s);
    next.stats = recalculateMacroEconomics(next.stats);
    next.stats = clampStats(next.stats);

    let logText = msg.dailyLog(summary.day, summary.foodProd, summary.foodCons, summary.income);
    if (summary.messages.length > 0) logText += ` | ${summary.messages.join(" ")}`;
    next.log.unshift({ ts: Date.now(), text: logText });

    let crisis: CrisisAlert | null = null;
    const h = next.completedEvents || [];
    const isDone = (id: string) => h.includes(id);

    if (next.stats.population <= 0) {
        crisis = makeCrisis("allStarved", "bad_ending_starved", [], lang);
    } else if (next.stats.happiness <= 0) {
        crisis = makeCrisis("exiled", "bad_ending_exiled", [], lang);
    } else if (next.stats.happiness <= 20 && !isDone("event_riot")) {
        crisis = makeCrisis("riot", "idle_main", [
            { type: "add", key: "money", value: -1000 },
            { type: "set", key: "marketLevel", value: 0 },
            { type: "add", key: "population", value: -3 },
        ], lang);
        next.completedEvents.push("event_riot");
    } else {
        if (next.stats.pastureLevel > 0 && !isDone("event2_start")) {
            crisis = makeCrisis("meatTempt", "event2_start", [{ type: "add", key: "foodStock", value: -15 }], lang);
        } else if (next.stats.academyLevel > 0 && !isDone("event4_start")) {
            crisis = makeCrisis("machinery", "event4_start", [
                { type: "add", key: "unemploymentRate", value: 35 },
                { type: "add", key: "productivity", value: 50 },
            ], lang);
        } else if (next.stats.marketLevel > 0 && !isDone("event5_start")) {
            crisis = makeCrisis("bottleneck", "event5_start", [{ type: "add", key: "money", value: -1500 }], lang);
        } else if (next.stats.mineLevel > 0 && !isDone("event6_start")) {
            crisis = makeCrisis("monopoly", "event6_start", [
                { type: "add", key: "cpi", value: 50 },
                { type: "add", key: "happiness", value: -25 },
            ], lang);
        } else if (next.stats.farmLevel > 0 && next.stats.pastureLevel > 0 && next.stats.academyLevel > 0 && !isDone("event3_start")) {
            crisis = makeCrisis("pollution", "event3_start", [
                { type: "add", key: "happiness", value: -30 },
                { type: "add", key: "population", value: -2 },
            ], lang);
        } else if (next.stats.day >= 6 && next.stats.day <= 15 && !isDone("event7_start") && Math.random() < 0.3) {
            crisis = makeCrisis("blizzard", "event7_start", [
                { type: "add", key: "gdp", value: -300 },
                { type: "add", key: "unemploymentRate", value: 20 },
            ], lang);
        } else if (!isDone("event8_start") && ["event1_choice","event2_choice","event3_choice","event4_choice","event5_choice","event6_choice","event7_choice"].every(isDone) && Math.random() < 0.4) {
            crisis = makeCrisis("plague", "event8_start", [{ type: "add", key: "happiness", value: -25 }], lang);
        } else if (isDone("event8_choice") && !isDone("event9_start") && Math.random() < 0.4) {
            crisis = makeCrisis("dumping", "event9_start", [
                { type: "add", key: "unemploymentRate", value: 25 },
                { type: "add", key: "cpi", value: -20 },
            ], lang);
        } else if (isDone("event9_choice") && !isDone("event10_start") && Math.random() < 0.4) {
            crisis = makeCrisis("currencyWar", "event10_start", [
                { type: "add", key: "gdp", value: -200 },
                { type: "add", key: "foodStock", value: 40 },
            ], lang);
        }
    }

    summary.macro = {
        population: next.stats.population,
        happiness: next.stats.happiness,
        productivity: next.stats.productivity,
        cpi: next.stats.cpi,
        unemploymentRate: next.stats.unemploymentRate,
        gdp: next.stats.gdp,
    };

    return { state: next, summary, crisis };
}

function recalculateMacroEconomics(stats: GameStats): GameStats {
    let next = { ...stats };
    const laborForce = Math.floor(next.population * 0.6);
    const jobsAvailable = Math.floor(next.productivity / 10) + (next.mineLevel * 8) + (next.farmLevel * 3) + (next.marketLevel * 4);
    const unemployed = Math.max(0, laborForce - jobsAvailable);
    next.unemploymentRate = laborForce > 0 ? Math.round((unemployed / laborForce) * 100) : 0;

    const consumption = (next.population * 20) + (next.marketLevel * 300) + (next.productivity * 2);
    const investment = (next.techLevel * 500) + (next.academyLevel * 800) + (next.mineLevel * 1200);
    const govtSpending = next.money * 0.1;
    next.gdp = Math.round(consumption + investment + govtSpending);

    const moneySupplyRatio = Math.max(1, next.money) / 5000;
    const productionRatio = Math.max(0.01, next.productivity / 100);
    const inflationFactor = moneySupplyRatio / productionRatio;
    next.cpi = Math.round(100 * inflationFactor);

    return next;
}

export function applyEffects(state: GameState, effects: Effect[], lang: Lang = "zh"): { state: GameState; lastAchievementId?: string } {
    let next: GameState = structuredClone(state);
    let lastAchievementId: string | undefined;
    const msg = ENGINE_MSG[lang];

    for (const e of effects) {
        switch (e.type) {
            case "add": next.stats[e.key] = (next.stats[e.key] as number) + e.value; break;
            case "set": next.stats[e.key] = e.value; break;
            case "log": next.log.unshift({ ts: Date.now(), text: e.text }); break;
            case "achievement": {
                const exists = next.achievements.some((a) => a.id === e.id);
                if (!exists) {
                    next.achievements.unshift({ id: e.id, title: e.title, description: e.description, unlockedAt: Date.now() });
                    lastAchievementId = e.id;
                    next.log.unshift({ ts: Date.now(), text: msg.achievementLog(e.title) });
                }
                break;
            }
            case "goto": next.currentNodeId = e.nodeId; break;
        }
    }

    next.stats = clampStats(next.stats);
    next.stats = recalculateMacroEconomics(next.stats);
    next.stats = clampStats(next.stats);
    return { state: next, lastAchievementId };
}
