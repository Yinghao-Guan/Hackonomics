// src/app/game/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import TopBar from "@/components/TopBar";
import DialogueCard from "@/components/DialogueCard";
import LogDrawer from "@/components/LogDrawer";
import AchievementToast from "@/components/AchievementToast";
import AvatarPlaceholder from "@/components/AvatarPlaceholder";
import ChoiceOverlay from "@/components/ChoiceOverlay";
import { NODES, START_NODE_ID, type ChoiceNode, type DialogueNode } from "@/lib/nodes";
import { loadFromStorage, saveToStorage, clearStorage } from "@/lib/storage";
import { newGameState, type GameState } from "@/lib/gameState";
import { applyEffects } from "@/lib/engine";

function normalizeLines(text: string | string[]) {
    return Array.isArray(text) ? text : [text];
}

export default function GamePage() {
    const sp = useSearchParams();
    const shouldReset = sp.get("reset") === "1";

    const [logOpen, setLogOpen] = useState(false);
    const [state, setState] = useState<GameState>(() => newGameState(START_NODE_ID));
    const [toastAchId, setToastAchId] = useState<string | null>(null);

    // init: load save or reset
    useEffect(() => {
        if (shouldReset) {
            clearStorage();
            setState(newGameState(START_NODE_ID));
            return;
        }
        const saved = loadFromStorage<GameState>();
        if (saved?.currentNodeId && saved.stats) {
            setState(saved);
        } else {
            setState(newGameState(START_NODE_ID));
        }
    }, [shouldReset]);

    // persist
    useEffect(() => {
        saveToStorage(state);
    }, [state]);

    const node = NODES[state.currentNodeId];
    const latestAchievement = useMemo(() => {
        if (!toastAchId) return null;
        return state.achievements.find((a) => a.id === toastAchId) ?? null;
    }, [toastAchId, state.achievements]);

    if (!node) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white">
                <div className="mx-auto max-w-3xl px-6 py-16">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="text-lg font-semibold">节点不存在</div>
                        <div className="mt-2 text-white/70">currentNodeId: {state.currentNodeId}</div>
                        <button
                            className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
                            onClick={() => setState(newGameState(START_NODE_ID))}
                        >
                            回到开头
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    const onContinue = () => {
        const d = node as DialogueNode;
        setState((s) => ({ ...s, currentNodeId: d.next }));
    };

    const onChoose = (choiceKey: "A" | "B" | "C") => {
        const c = (node as ChoiceNode).choices.find((x) => x.key === choiceKey);
        if (!c) return;

        const withRecord: GameState = {
            ...state,
            choices: { ...state.choices, [node.id]: choiceKey },
        };

        const result = applyEffects(withRecord, c.effects);
        setState(result.state);

        if (result.lastAchievementId) {
            setToastAchId(result.lastAchievementId);
            window.setTimeout(() => setToastAchId(null), 3500);
        }
    };

    return (
        <main className="relative w-full h-screen overflow-hidden bg-zinc-950 text-white">
            {/* Layer 0: Background scene */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900 via-zinc-900 to-zinc-950" />

            {/* Layer 1: Character sprite — centered upper area */}
            <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ paddingBottom: "32vh" }}>
                <AvatarPlaceholder label={node.speaker} />
            </div>

            {/* Layer 4: Stats HUD (self-positions as fixed) */}
            <TopBar
                stats={state.stats}
                logOpen={logOpen}
                onToggleLog={() => setLogOpen((v) => !v)}
                onNewGame={() => setState(newGameState(START_NODE_ID))}
                onClear={() => {
                    clearStorage();
                    setState(newGameState(START_NODE_ID));
                }}
            />

            {/* Layer 2: Dialogue box (self-positions as fixed bottom) */}
            <DialogueCard speaker={node.speaker} lines={normalizeLines(node.text)}>
                {node.type === "dialogue" && (
                    <button
                        onClick={onContinue}
                        className="absolute bottom-4 right-6 text-2xl text-white/60 hover:text-white animate-pulse"
                    >
                        ▶
                    </button>
                )}
            </DialogueCard>

            {/* Layer 3: Choice overlay */}
            {node.type === "choice" && (
                <ChoiceOverlay choices={(node as ChoiceNode).choices} onChoose={onChoose} />
            )}

            {/* Layer 5: Overlays */}
            <LogDrawer open={logOpen} log={state.log} />
            <AchievementToast achievement={latestAchievement} onClose={() => setToastAchId(null)} />
        </main>
    );
}
