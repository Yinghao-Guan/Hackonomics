// src/app/game/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import TopBar from "@/components/TopBar";
import DialogueCard from "@/components/DialogueCard";
import LogDrawer from "@/components/LogDrawer";
import AchievementToast from "@/components/AchievementToast";
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
            // auto hide
            window.setTimeout(() => setToastAchId(null), 3500);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-white">
            <LogDrawer open={logOpen} onToggle={() => setLogOpen((v) => !v)} log={state.log} />
            <AchievementToast achievement={latestAchievement} onClose={() => setToastAchId(null)} />

            <div className="mx-auto max-w-5xl px-6 py-10">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <div className="text-sm text-white/60">Village Economy</div>
                        <div className="text-2xl font-bold tracking-tight">Chapter: Awakening</div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setState(newGameState(START_NODE_ID))}
                            className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                        >
                            New Game
                        </button>
                        <button
                            onClick={() => {
                                clearStorage();
                                setState(newGameState(START_NODE_ID));
                            }}
                            className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                        >
                            Clear Save
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <TopBar stats={state.stats} />
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr,340px]">
                    <div>
                        <DialogueCard speaker={node.speaker} lines={normalizeLines(node.text)}>
                            {node.type === "dialogue" ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={onContinue}
                                        className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
                                    >
                                        继续
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {(node as ChoiceNode).choices.map((c) => (
                                        <button
                                            key={c.key}
                                            onClick={() => onChoose(c.key)}
                                            className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="text-base font-semibold text-white">
                                                    {c.key}. {c.title}
                                                </div>
                                                <div className="text-xs text-white/50">点击选择</div>
                                            </div>
                                            {c.description && <div className="mt-2 text-sm text-white/70">{c.description}</div>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </DialogueCard>
                    </div>

                    <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                        <div className="text-sm font-semibold text-white">本局记录</div>

                        <div className="mt-4 space-y-3">
                            <div className="rounded-2xl bg-black/30 p-4">
                                <div className="text-xs text-white/60">已解锁成就</div>
                                <div className="mt-1 text-2xl font-bold">{state.achievements.length}</div>
                            </div>

                            <div className="rounded-2xl bg-black/30 p-4">
                                <div className="text-xs text-white/60">已做选择</div>
                                <div className="mt-1 text-2xl font-bold">{Object.keys(state.choices).length}</div>
                            </div>

                            <div className="rounded-2xl bg-black/30 p-4">
                                <div className="text-xs text-white/60">当前节点</div>
                                <div className="mt-1 break-all font-mono text-xs text-white/80">{state.currentNodeId}</div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                                <div className="font-semibold text-white">占位提示</div>
                                <div className="mt-1">
                                    没有美术
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
