// src/lib/engine.ts
import type { Effect } from "./nodes";
import type { GameState } from "./gameState";
import { clampStats } from "./gameState";

export function applyEffects(state: GameState, effects: Effect[]): { state: GameState; lastAchievementId?: string } {
    let next: GameState = structuredClone(state);
    let lastAchievementId: string | undefined;

    for (const e of effects) {
        switch (e.type) {
            case "add":
                // @ts-expect-error dynamic key
                next.stats[e.key] = (next.stats[e.key] as number) + e.value;
                next.stats = clampStats(next.stats);
                break;

            case "set":
                // @ts-expect-error dynamic key
                next.stats[e.key] = e.value;
                next.stats = clampStats(next.stats);
                break;

            case "log":
                next.log.unshift({ ts: Date.now(), text: e.text });
                break;

            case "achievement": {
                const exists = next.achievements.some((a) => a.id === e.id);
                if (!exists) {
                    next.achievements.unshift({
                        id: e.id,
                        title: e.title,
                        description: e.description,
                        unlockedAt: Date.now(),
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

    return { state: next, lastAchievementId };
}
