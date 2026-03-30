// src/lib/gameState.ts
import { INITIAL_STATS, type ChoiceKey, type GameStats } from "./nodes";

export type Achievement = {
    id: string;
    title: string;
    description: string;
    unlockedAt: number;
};

export type LogItem = {
    ts: number;
    zh: string;
    en: string;
};

export type GameState = {
    currentNodeId: string;
    stats: GameStats;
    choices: Record<string, ChoiceKey>;
    achievements: Achievement[];
    log: LogItem[];
    // 记录已经发生过的事件 ID，发生过的就不再触发了
    completedEvents: string[];
};

export function newGameState(startNodeId: string): GameState {
    return {
        currentNodeId: startNodeId,
        stats: { ...INITIAL_STATS },
        choices: {},
        achievements: [],
        log: [{ ts: Date.now(), zh: "开始新游戏", en: "New Game Started" }],
        completedEvents: [], // 初始化为空
    };
}

export function clampStats(stats: GameStats): GameStats {
    return {
        ...stats,
        // --- 1. 物理与资源限制 ---
        population: Math.max(0, Math.round(stats.population)),
        foodStock: Math.max(0, Math.round(stats.foodStock)),
        money: Math.max(0, Math.round(stats.money)),
        
        // --- 2. 百分比与范围限制 ---
        happiness: Math.max(0, Math.min(100, Math.round(stats.happiness))),
        productivity: Math.max(0, Math.min(200, Math.round(stats.productivity))),
        
        // --- 3. 时间与行动点限制 ---
        actionPoints: Math.max(0, Math.round(stats.actionPoints)),
        season: Math.max(1, Math.round(stats.season)),
        day: Math.max(1, Math.min(20, Math.round(stats.day))),

        // --- 4. 宏观经济指标限制 ---
        gdp: Math.max(0, Math.round(stats.gdp || 0)),
        cpi: Math.max(0, Math.round(stats.cpi || 0)),
        unemploymentRate: Math.max(0, Math.min(100, Math.round(stats.unemploymentRate || 0))),
        techLevel: Math.max(0.1, stats.techLevel || 1.0),

        // --- 5. 【修复点】基建等级限制 (防止变负数或读取 undefined) ---
        farmLevel: Math.max(0, Math.round(stats.farmLevel || 0)),
        pastureLevel: Math.max(0, Math.round(stats.pastureLevel || 0)),
        mineLevel: Math.max(0, Math.round(stats.mineLevel || 0)),
        academyLevel: Math.max(0, Math.round(stats.academyLevel || 0)),
        marketLevel: Math.max(0, Math.round(stats.marketLevel || 0)),
    };
}