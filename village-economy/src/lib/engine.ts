// src/lib/engine.ts
import type { Effect } from "./nodes";
import type { GameState } from "./gameState";
import { clampStats } from "./gameState";
import { GameStats } from "./nodes";

// ==========================================
// 核心：宏观经济动态联立方程组 (The Invisible Hand)
// ==========================================
function recalculateMacroEconomics(stats: GameStats): GameStats {
    let next = { ...stats };

    // 1. 失业率计算 (Unemployment Rate)
    // 假设总人口的 60% 是适龄劳动力 [cite: 29, 30]
    const laborForce = Math.floor(next.population * 0.6);
    // 假设当前生产力需要的工作岗位数量 (10点productivity需要1个人)
    const jobsAvailable = Math.floor(next.productivity / 10);
    const unemployed = Math.max(0, laborForce - jobsAvailable);
    next.unemploymentRate = laborForce > 0 ? Math.round((unemployed / laborForce) * 100) : 0;

    // 2. 幸福度计算 (Happiness / Marginal Utility)
    // 基于边际效用理论：吃饱涨幅大，吃撑了没感觉 [cite: 32]
    const foodPerCapita = next.population > 0 ? next.foodStock / next.population : 0;
    let targetHappiness = 50; 
    
    if (foodPerCapita >= 1) targetHappiness += 20; // 满足温饱生存线 [cite: 32]
    if (foodPerCapita >= 2) targetHappiness += 10; // 边际效用递减 [cite: 32]
    if (foodPerCapita < 1) targetHappiness -= 40;  // 饥饿导致幸福度断崖下跌 [cite: 31, 32]

    // 失业率的负外部性惩罚 [cite: 31]
    targetHappiness -= Math.floor(next.unemploymentRate * 0.5); 
    
    // 让幸福度平滑过渡，而不是瞬间暴涨暴跌
    next.happiness = Math.round((next.happiness * 0.7) + (targetHappiness * 0.3));

    // GDP calculation ( C + I + G) 
    const consumption = next.population * 20; // C: 
    const investment = next.techLevel * 500;  // I: 
    const govtSpending = next.money * 0.1;    // G: 
    next.gdp = Math.round(consumption + investment + govtSpending);

    // 4. CPI 与通货膨胀 (Laspeyres Index 简化版)
    // 如果市场上钱太多 (Money)，但生产力 (Productivity) 不足，物价就会飙升 
    const moneySupplyRatio = next.money / 5000; // 初始钱是5000
    const productionRatio = next.productivity / 100; // 初始生产力是100
    // 如果钱比生产的物资多，通胀就会发生
    const inflationFactor = moneySupplyRatio / (productionRatio > 0 ? productionRatio : 0.1);
    next.cpi = Math.round(100 * inflationFactor);

    return next;
}

// ==========================================
// 选项执行器
// ==========================================
export function applyEffects(state: GameState, effects: Effect[]): { state: GameState; lastAchievementId?: string } {
    let next: GameState = structuredClone(state);
    let lastAchievementId: string | undefined;

    // 1. 依次执行玩家选项带来的基础数值改变
    for (const e of effects) {
        switch (e.type) {
            case "add":
                // @ts-expect-error dynamic key
                next.stats[e.key] = (next.stats[e.key] as number) + e.value;
                break;
            case "set":
                // @ts-expect-error dynamic key
                next.stats[e.key] = e.value;
                break;
            case "log":
                next.log.unshift({ ts: Date.now(), text: e.text });
                break;
            case "achievement": {
                const exists = next.achievements.some((a) => a.id === e.id);
                if (!exists) {
                    next.achievements.unshift({
                        id: e.id, title: e.title, description: e.description, unlockedAt: Date.now(),
                    });
                    lastAchievementId = e.id;
                    next.log.unshift({ ts: Date.now(), text: `成就解锁：${e.title}` });
                }
                break;
            }
            case "goto":
                next.currentNodeId = e.nodeId;
                break;
        }
    }

    // 2. 基础数值改变后，防止出现负数或超出上限
    next.stats = clampStats(next.stats);

    // 3. 核心：强制调用宏观经济引擎，计算出最新的 GDP、CPI 和失业率！
    next.stats = recalculateMacroEconomics(next.stats);
    
    // 4. 计算完派生数据后，再 clamp 一次，防止 GDP 或幸福度越界
    next.stats = clampStats(next.stats);

    return { state: next, lastAchievementId };
}