// src/lib/engine.ts
import type { Effect, GameStats } from "./nodes";
import type { GameState } from "./gameState";
import { clampStats } from "./gameState";

export type DailySummary = {
    day: number; foodProd: number; foodCons: number; starved: number; income: number; messages: string[];
};

export type CrisisAlert = {
    eventId: string; title: string; description: string; shockEffects: Effect[];
};

// ==========================================
// 核心：每日结算引擎 (Daily Tick Engine)
// ==========================================
export function processDailyTick(state: GameState): { state: GameState, summary: DailySummary, crisis: CrisisAlert | null } {
    let next = structuredClone(state);
    let s = next.stats;
    let summary: DailySummary = { day: s.day, foodProd: 0, foodCons: 0, starved: 0, income: 0, messages: [] };

    // --- 1. 农业与生存结算 ---
    const baseForaging = Math.floor(s.population * 0.4); // 村民会自己去采摘野果打猎
    summary.foodProd = baseForaging + (s.farmLevel * 8) + (s.pastureLevel * 4); 
    summary.foodCons = s.population; 
    
    s.foodStock += summary.foodProd;
    s.foodStock -= summary.foodCons;

    if (s.foodStock < 0) {
        // 饥荒不会瞬间死绝，而是按比例饿死 (人能扛几天)
        summary.starved = Math.floor(Math.abs(s.foodStock) / 3); 
        if (summary.starved > 0) {
            s.population -= summary.starved;
            s.happiness -= summary.starved * 10; 
            s.productivity -= summary.starved * 5; 
            summary.messages.push(`⚠️ 饥荒蔓延：储备耗尽，饿死 ${summary.starved} 人！`);
        } else {
            summary.messages.push(`⚠️ 粮食短缺：村民正在挨饿，生产力下降。`);
            s.productivity -= 2;
        }
        s.foodStock = 0;
    }

    // --- 2. 经济与税收结算 ---
    let baseIncome = (s.population * 5) + (s.marketLevel * 150) + (s.productivity * 2) + (s.mineLevel * 300 * s.techLevel);
    
    if (s.happiness < 40) {
        baseIncome = Math.floor(baseIncome * 0.6); 
        s.productivity = Math.max(0, s.productivity - 5); 
        summary.messages.push(`😡 民怨沸腾：村民消极怠工，税收锐减，生产力流失！`);
    } else if (s.happiness > 80) {
        baseIncome = Math.floor(baseIncome * 1.2); 
    }

    summary.income = Math.floor(baseIncome);
    s.money += summary.income;

    // --- 3. 宏观指标的深度连动 (Interconnectivity) ---
    // 连动A：GDP 与幸福度高时，吸引人口增长
    if (s.gdp > 2000 && s.happiness > 70 && s.foodStock > s.population * 2) {
        const immigrants = Math.max(1, Math.floor(s.gdp / 2000));
        s.population += immigrants;
        summary.messages.push(`🌟 经济繁荣：吸引 ${immigrants} 名流民加入村庄！`);
    }
    // 连动B：高失业率刺痛幸福度
    if (s.unemploymentRate > 20) {
        s.happiness -= 5;
        summary.messages.push(`📉 岗少人多：高失业率导致社会动荡，幸福度 -5。`);
    }
    // 连动C：恶性通胀刺痛幸福度
    if (s.cpi > 130) {
        s.happiness -= 8;
        summary.messages.push(`🛒 物价飞涨：村民买不起必需品，幸福度 -8。`);
    }

    s.actionPoints = 3;
    s.day += 1;

    next.stats = clampStats(s);
    next.stats = recalculateMacroEconomics(next.stats);
    next.stats = clampStats(next.stats); 

    let logText = `【第${summary.day}天结账】产粮+${summary.foodProd} 消耗-${summary.foodCons} | 资金+${summary.income}`;
    if (summary.messages.length > 0) logText += ` | ${summary.messages.join(" ")}`;
    next.log.unshift({ ts: Date.now(), text: logText });

    // --- 4. 终极沙盒巡逻犬 (Event Dispatcher with Shock) ---
    let crisis: CrisisAlert | null = null;
    const h = next.completedEvents || [];
    const isDone = (id: string) => h.includes(id);

    if (next.stats.pastureLevel > 0 && !isDone("event2_start")) {
        crisis = {
            eventId: "event2_start", title: "肉食的诱惑", description: "村民对小麦感到厌烦，有人开始觊觎牧场里的牛羊，私自将大量战略储备粮喂给牲畜！",
            shockEffects: [{ type: "add", key: "foodStock", value: -10 }]
        };
    } else if (next.stats.academyLevel > 0 && !isDone("event4_start")) {
        crisis = {
            eventId: "event4_start", title: "机器的轰鸣", description: "研究院孵化出了全自动农具，大幅提升了生产力，但也瞬间摧毁了大量传统农夫的生计！",
            shockEffects: [{ type: "add", key: "unemploymentRate", value: 30 }, { type: "add", key: "productivity", value: 40 }]
        };
    } else if (next.stats.marketLevel > 0 && !isDone("event5_start")) {
        crisis = {
            eventId: "event5_start", title: "流通的瓶颈", description: "市场建成了，但以物易物的效率太低，财政库因为前期建设彻底枯竭，桥梁工程被迫停工。",
            shockEffects: [{ type: "add", key: "money", value: -1000 }]
        };
    } else if (next.stats.mineLevel > 0 && !isDone("event6_start")) {
        crisis = {
            eventId: "event6_start", title: "资本的獠牙", description: "矿产大开发带来了垄断。精明的商人控制了铁矿，瞬间将所有农具价格提高了三倍！",
            shockEffects: [{ type: "add", key: "cpi", value: 40 }, { type: "add", key: "happiness", value: -15 }]
        };
    } else if (next.stats.farmLevel > 0 && next.stats.pastureLevel > 0 && next.stats.academyLevel > 0 && !isDone("event3_start")) {
        crisis = {
            eventId: "event3_start", title: "黑色的河流", description: "大规模的基建导致无节制的砍伐。河流被严重污染，渔民和老人开始生病倒下！",
            shockEffects: [{ type: "add", key: "happiness", value: -20 }, { type: "add", key: "population", value: -1 }]
        };
    } else if (next.stats.day >= 6 && next.stats.day <= 15 && !isDone("event7_start") && Math.random() < 0.3) {
        crisis = {
            eventId: "event7_start", title: "寒冬与死寂", description: "极寒暴风雪突然降临！所有人闭门不出疯狂存钱，市场需求瞬间坍塌！",
            shockEffects: [{ type: "add", key: "gdp", value: -200 }, { type: "add", key: "unemploymentRate", value: 15 }]
        };
    } else if (!isDone("event8_start") && ["event1_choice","event2_choice","event3_choice","event4_choice","event5_choice","event6_choice","event7_choice"].every(isDone) && Math.random() < 0.3) {
        crisis = {
            eventId: "event8_start", title: "瘟疫的阴影", description: "一场瘟疫逼近村庄，急需巨资修建净水设施。恐慌情绪蔓延！",
            shockEffects: [{ type: "add", key: "happiness", value: -15 }]
        };
    } else if (isDone("event8_choice") && !isDone("event9_start") && Math.random() < 0.3) {
        crisis = {
            eventId: "event9_start", title: "外来的倾销", description: "邻村用极其廉价的铁器涌入市场，导致本地铁匠铺当场破产！",
            shockEffects: [{ type: "add", key: "unemploymentRate", value: 20 }, { type: "add", key: "cpi", value: -10 }]
        };
    } else if (isDone("event9_choice") && !isDone("event10_start") && Math.random() < 0.3) {
        crisis = {
            eventId: "event10_start", title: "货币战争", description: "邻村恶意大幅贬值货币！我们出口的小麦变得极其昂贵，贸易订单瞬间归零！",
            shockEffects: [{ type: "add", key: "gdp", value: -150 }, { type: "add", key: "foodStock", value: 30 }]
        };
    }

    return { state: next, summary, crisis };
}

// ==========================================
// 宏观经济动态联立方程组
// ==========================================
function recalculateMacroEconomics(stats: GameStats): GameStats {
    let next = { ...stats };
    const laborForce = Math.floor(next.population * 0.6);
    const jobsAvailable = Math.floor(next.productivity / 10) + (next.mineLevel * 5) + (next.farmLevel * 2) + (next.marketLevel * 3);
    const unemployed = Math.max(0, laborForce - jobsAvailable);
    next.unemploymentRate = laborForce > 0 ? Math.round((unemployed / laborForce) * 100) : 0;

    const consumption = next.population * 20 + (next.marketLevel * 200); 
    const investment = next.techLevel * 500 + (next.academyLevel * 800) + (next.mineLevel * 1000);  
    const govtSpending = next.money * 0.1;    
    next.gdp = Math.round(consumption + investment + govtSpending);

    const moneySupplyRatio = Math.max(1, next.money) / 5000; 
    const productionRatio = Math.max(0.1, next.productivity / 100); 
    const inflationFactor = moneySupplyRatio / productionRatio;
    next.cpi = Math.round(100 * inflationFactor);

    return next;
}

export function applyEffects(state: GameState, effects: Effect[]): { state: GameState; lastAchievementId?: string } {
    let next: GameState = structuredClone(state);
    let lastAchievementId: string | undefined;

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
                    next.log.unshift({ ts: Date.now(), text: `成就解锁：${e.title}` });
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