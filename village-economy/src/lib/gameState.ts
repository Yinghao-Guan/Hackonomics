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
    text: string;
};

export type GameState = {
    currentNodeId: string;
    stats: GameStats;
    choices: Record<string, ChoiceKey>;
    achievements: Achievement[];
    log: LogItem[];
};

export function newGameState(startNodeId: string): GameState {
    return {
        currentNodeId: startNodeId,
        stats: { ...INITIAL_STATS },
        choices: {},
        achievements: [],
        log: [{ ts: Date.now(), text: "开始新游戏" }],
    };
}

export function clampStats(stats: GameStats): GameStats {
    return {
        ...stats,
        population: Math.max(0, Math.round(stats.population)),
        foodStock: Math.max(0, Math.round(stats.foodStock)),
        money: Math.max(0, Math.round(stats.money)),
        happiness: Math.max(0, Math.min(100, Math.round(stats.happiness))),
        productivity: Math.max(0, Math.min(200, Math.round(stats.productivity))),
        actionPoints: Math.max(0, Math.round(stats.actionPoints)),
        season: Math.max(1, Math.round(stats.season)),
        day: Math.max(1, Math.min(20, Math.round(stats.day))),
    };
}
