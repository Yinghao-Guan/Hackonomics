// src/app/game/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; 
import TopBar from "@/components/TopBar";
import LogDrawer from "@/components/LogDrawer";
import AchievementToast from "@/components/AchievementToast";
import AvatarPlaceholder from "@/components/AvatarPlaceholder";
import { NODES, START_NODE_ID, type ChoiceNode, type DialogueNode } from "@/lib/nodes";
import { loadFromStorage, saveToStorage, clearStorage } from "@/lib/storage";
import { newGameState, type GameState } from "@/lib/gameState";
import { applyEffects } from "@/lib/engine";
import WanderingVillager from '@/components/Villager';

function normalizeLines(text: string | string[]) {
    return Array.isArray(text) ? text : [text];
}

type GenshinDialogueCardProps = {
    speaker?: string;
    lines: string[];
    children?: React.ReactNode;
    isChoice?: boolean;
    prevNodeText?: string;
};

function GenshinDialogueCard({
    speaker,
    lines,
    children,
    isChoice = false,
    prevNodeText,
}: GenshinDialogueCardProps) {
    return (
        <div className="w-full max-w-4xl px-4 pb-8 md:pb-12 animate-[slideUp_0.3s_ease-out]">
            {/* 名字标签 */}
            {speaker && (
                <div className="inline-block bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-2 rounded-t-xl text-black font-bold text-lg md:text-xl shadow-md border border-b-0 border-amber-400/50">
                    {speaker}
                </div>
            )}
            {/* 文本框 */}
            <div className="bg-zinc-900/90 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-b-xl rounded-tr-xl min-h-[140px] shadow-2xl relative">
                {/* 如果当前是选项，底部对话框显示上一句台词 */}
                {isChoice && prevNodeText && (
                    <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed max-w-[80ch]">
                        {prevNodeText}
                    </p>
                )}
                {/* 正常对话行 */}
                {(!isChoice || !prevNodeText) && lines.map((t, i) => (
                    <p key={i} className="text-lg md:text-xl leading-relaxed text-white/95 animate-vn-text-in max-w-[80ch]">
                        {t}
                    </p>
                ))}
                
                {children}
            </div>
        </div>
    );
}

type GenshinChoiceOverlayProps = {
    choices: Array<{ key: "A" | "B" | "C"; title: string; description?: string }>;
    onChoose: (key: "A" | "B" | "C") => void;
};

function GenshinChoiceOverlay({ choices, onChoose }: GenshinChoiceOverlayProps) {
    return (
        <div className="absolute right-8 md:right-24 top-1/2 -translate-y-1/2 flex flex-col gap-4 w-[80%] max-w-sm z-30 pointer-events-auto">
            {choices.map((c, idx) => (
                <button
                    key={c.key}
                    onClick={(e) => {
                        e.stopPropagation(); 
                        onChoose(c.key);
                    }}
                    className="group relative text-left bg-zinc-900/80 hover:bg-white border border-zinc-600 hover:border-white backdrop-blur-md px-6 py-4 rounded-tl-2xl rounded-bl-2xl rounded-tr-sm rounded-br-2xl shadow-lg transition-all duration-300 animate-[slideInRight_0.4s_ease-out] pointer-events-auto"
                >
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/80 text-xs font-bold text-black flex-shrink-0 group-hover:bg-amber-600">
                            {c.key}
                        </span>
                        <span className="text-zinc-300 group-hover:text-black font-medium text-lg pr-6">
                            {c.title}
                        </span>
                    </div>
                    {c.description && (
                        <div className="mt-2 ml-9 text-sm text-zinc-400 group-hover:text-black/70">{c.description}</div>
                    )}
                    {/* 指示器 */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 group-hover:text-black opacity-0 group-hover:opacity-100 transition-opacity">
                        ▶
                    </div>
                </button>
            ))}
        </div>
    );
}


export default function GamePage() {
    const sp = useSearchParams();
    const router = useRouter(); 
    const shouldReset = sp.get("reset") === "1";

    const [logOpen, setLogOpen] = useState(false);
    const [state, setState] = useState<GameState>(() => newGameState(START_NODE_ID));
    const [toastAchId, setToastAchId] = useState<string | null>(null);

    // init: load save or reset
    useEffect(() => {
        if (shouldReset) {
            clearStorage();
            setState(newGameState(START_NODE_ID));
            router.replace("/game"); 
            return;
        }
        const saved = loadFromStorage<GameState>();
        if (saved?.currentNodeId && saved.stats) {
            setState(saved);
        } else {
            setState(newGameState(START_NODE_ID));
        }
    }, [shouldReset, router]);

    // persist
    useEffect(() => {
        saveToStorage(state);
    }, [state]);

    const node = NODES[state.currentNodeId];
    // 用于在选项节点显示上一句对话
    const prevNode = useMemo(() => {
        if (node.type !== 'choice') return null;
        // 如果是从 dialogue 跳转到 choice，记录对话内容
        const saved = loadFromStorage<GameState>();
        if (saved?.currentNodeId) {
            const p = NODES[saved.currentNodeId];
            if (p.type === 'dialogue') return p;
        }
        return null;
    }, [node]);

    const latestAchievement = useMemo(() => {
        if (!toastAchId) return null;
        return state.achievements.find((a) => a.id === toastAchId) ?? null;
    }, [toastAchId, state.achievements]);

    if (!node) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
                    <div className="text-xl font-bold text-red-400 drop-shadow-lg">时间线崩溃 (节点不存在)</div>
                    <div className="mt-2 text-zinc-500">Node ID: {state.currentNodeId}</div>
                    <button
                        className="mt-8 rounded-xl bg-white px-8 py-4 text-base font-semibold text-black hover:bg-zinc-200 transition-all active:scale-95"
                        onClick={() => {
                            clearStorage();
                            router.push("/"); 
                        }}
                    >
                        重启世界
                    </button>
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

    const handleScreenClick = () => {
        // 只有当前是“普通对话”时，点击屏幕任意位置才能继续
        // 如果是“选项(choice)”节点，必须点泡泡，禁止点屏幕跳过
        if (node.type === "dialogue") {
            onContinue();
        }
    };

    // 动态计算背景图样式
    const getBgStyle = () => {
        if (node.bg === "room") return "bg-[url('/room.png')] bg-cover bg-center opacity-40";

        if (node.bg === "village") return "bg-[url('/village.png')] bg-cover bg-center opacity-40";
        return "bg-black opacity-100"; // 默认黑屏
    };

    return (
        <main 
            className="relative w-full h-screen overflow-hidden bg-black text-white"
            onClick={handleScreenClick}
        >
            {/* Layer 0: 动态背景层 (像素风村庄) */}
            <div className={`absolute inset-0 z-0 transition-all duration-[1500ms] ease-in-out ${getBgStyle()}`} />
            {/* 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0" />

            {/* Layer 1: 角色立绘层 */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none pb-[20vh]">
                <AvatarPlaceholder label={node.speaker} avatar={node.avatar} />
            </div>

            {/* Layer 4: 顶部状态栏 */}
            <TopBar
                stats={state.stats}
                logOpen={logOpen}
                onToggleLog={() => setLogOpen((v) => !v)}
                onNewGame={() => {
                    clearStorage();
                    router.push("/"); 
                }}
                onClear={() => {
                    clearStorage();
                    router.push("/"); 
                }}
            />

            {/* Layer 3 & 2: 视觉小说内容层 (Genshin style) */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end">
                {/* 选项泡泡 */}
                {node.type === "choice" && (
                    <GenshinChoiceOverlay choices={(node as ChoiceNode).choices} onChoose={onChoose} />
                )}

                {/* 底部对话框 */}
                <GenshinDialogueCard 
                    speaker={node.speaker} 
                    lines={normalizeLines(node.text)}
                    isChoice={node.type === "choice"}
                    prevNodeText={normalizeLines(prevNode?.text || "")[0]}
                >
                    {node.type === "dialogue" && (
                        <button
                            onClick={onContinue}
                            className="absolute bottom-4 right-6 text-2xl text-amber-500 hover:text-amber-400 animate-pulse"
                        >
                            ▼
                        </button>
                    )}
                </GenshinDialogueCard>
            </div>

            {/* Layer 5: 弹窗与村民叠加层 */}
            <LogDrawer open={logOpen} log={state.log} />
            <AchievementToast achievement={latestAchievement} onClose={() => setToastAchId(null)} />
            
            {node.bg === "village" && (
                <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
                    <WanderingVillager />
                    <WanderingVillager />
                    <WanderingVillager />
                    <WanderingVillager />
                    <WanderingVillager />
                </div>
            )}
        </main>
    );
}