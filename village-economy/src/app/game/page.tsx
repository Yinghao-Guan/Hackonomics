// src/app/game/page.tsx
"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import LogDrawer from "@/components/LogDrawer";
import AchievementToast from "@/components/AchievementToast";
// import AvatarPlaceholder from "@/components/AvatarPlaceholder";
import { NODES, START_NODE_ID, type ChoiceNode, type DialogueNode, type NarrationNode } from "@/lib/nodes";
import EconomicProfile from "@/components/EconomicProfile";
import { loadFromStorage, saveToStorage, clearStorage } from "@/lib/storage";
import { newGameState, clampStats, type Achievement, type GameState } from "@/lib/gameState";
import { applyEffects, type DailySummary, type CrisisAlert } from "@/lib/engine";
import VillagerSwarm from "@/components/VillagerSwarm";
import { useLanguage } from "@/lib/language";
import { UI, localizeNode, localizeAchievement, localizeCrisis, type Lang } from "@/lib/translations";
import type { Effect } from "@/lib/nodes";

function normalizeLines(text: string | string[]) { return Array.isArray(text) ? text : [text]; }

type GenshinDialogueCardProps = { speaker?: string; lines: string[]; children?: React.ReactNode; isChoice?: boolean; prevNodeText?: string; avatar?: string; };
function GenshinDialogueCard({ speaker, lines, children, isChoice = false, prevNodeText, avatar }: GenshinDialogueCardProps) {
    const isImage = avatar && (avatar.includes('/') || avatar.includes('.'));
    return (
        <div className="w-full max-w-4xl px-4 pb-8 md:pb-12 animate-[slideUp_0.3s_ease-out]">
            {speaker && (
                <div className="relative z-30 inline-block bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-2 rounded-t-xl text-black font-bold text-lg md:text-xl shadow-md border border-b-0 border-amber-400/50">
                    {speaker}
                </div>
            )}
            {/* 对话框主面板 */}
            <div className="bg-zinc-900/90 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-b-xl rounded-tr-xl min-h-[140px] shadow-2xl relative z-20">
                
                {/* 👇 右上方极致透明的头像渲染区域 */}
                {avatar && (
                    <div className="absolute -top-20 right-4 md:-top-48 md:right-1 z-40 pointer-events-none drop-shadow-2xl">
                        <div className="relative w-40 h-40 md:w-64 md:h-64 rounded-full bg-transparent overflow-hidden flex items-center justify-center text-[80px] md:text-[140px]">
                            {isImage ? (
                                <img 
                                    src={avatar} 
                                    alt={speaker || "Avatar"} 
                                    className="w-full h-full object-cover object-center"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            ) : (
                                <span>{avatar}</span>
                            )}
                        </div>
                    </div>
                )}

                {/* 文本内容：增加了 pr-24 / md:pr-40 确保文字不会钻到头像下面去 */}
                {isChoice && prevNodeText && (
                    <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed max-w-[80ch] pr-24 md:pr-40">{prevNodeText}</p>
                )}
                {(!isChoice || !prevNodeText) && lines.map((t, i) => (
                    <p key={i} className="text-lg md:text-xl leading-relaxed text-white/95 animate-vn-text-in max-w-[80ch] pr-24 md:pr-40">{t}</p>
                ))}
                {children}
            </div>
        </div>
    );
}

type GenshinChoiceOverlayProps = { choices: Array<{ key: "A" | "B" | "C"; title: string; description?: string }>; onChoose: (key: "A" | "B" | "C") => void; };
function GenshinChoiceOverlay({ choices, onChoose }: GenshinChoiceOverlayProps) {
    return (
        <div className="absolute right-8 md:right-24 top-1/2 -translate-y-1/2 flex flex-col gap-4 w-[80%] max-w-sm z-50 pointer-events-auto">
            {choices.map((c) => (
                <button key={c.key} onClick={(e) => { e.stopPropagation(); onChoose(c.key); }} className="group relative text-left bg-zinc-900/80 hover:bg-white border border-zinc-600 hover:border-white backdrop-blur-md px-6 py-4 rounded-tl-2xl rounded-bl-2xl rounded-tr-sm rounded-br-2xl shadow-lg transition-all duration-300 animate-[slideInRight_0.4s_ease-out] pointer-events-auto">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/80 text-xs font-bold text-black flex-shrink-0 group-hover:bg-amber-600">{c.key}</span>
                        <span className="text-zinc-300 group-hover:text-black font-medium text-lg pr-6">{c.title}</span>
                    </div>
                    {c.description && <div className="mt-2 ml-9 text-sm text-zinc-400 group-hover:text-black/70">{c.description}</div>}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 group-hover:text-black opacity-0 group-hover:opacity-100 transition-opacity">▶</div>
                </button>
            ))}
        </div>
    );
}

function GamePageInner() {
    const sp = useSearchParams();
    const router = useRouter();
    const shouldReset = sp.get("reset") === "1";
    const { lang } = useLanguage();
    const t = UI[lang];

    const [logOpen, setLogOpen] = useState(false);
    const [state, setState] = useState<GameState>(() => newGameState(START_NODE_ID));
    const [toastAchId, setToastAchId] = useState<string | null>(null);
    const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
    const [crisisAlert, setCrisisAlert] = useState<CrisisAlert | null>(null);

    useEffect(() => {
        if (shouldReset) { clearStorage(); setState(newGameState(START_NODE_ID)); router.replace("/game"); return; }
        const saved = loadFromStorage<GameState>();
        if (saved?.currentNodeId && saved.stats) { setState(saved); } else { setState(newGameState(START_NODE_ID)); }
    }, [shouldReset, router]);

    useEffect(() => { saveToStorage(state); }, [state]);

    const rawNode = NODES[state.currentNodeId];
    // Apply localization on top of the raw node
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const node = useMemo(() => rawNode ? localizeNode(rawNode as unknown as Record<string, unknown>, lang) as typeof rawNode : rawNode, [rawNode, lang]);

    useEffect(() => {
        if (rawNode && "autoPlayDuration" in rawNode && rawNode.autoPlayDuration) {
            const timer = setTimeout(() => { onContinue(); }, rawNode.autoPlayDuration);
            return () => clearTimeout(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.currentNodeId]);

    const prevNode = useMemo(() => {
        if (rawNode?.type !== "choice") return null;
        const saved = loadFromStorage<GameState>();
        if (saved?.currentNodeId) {
            const p = NODES[saved.currentNodeId];
            if (p?.type === "dialogue") return localizeNode(p as unknown as Record<string, unknown>, lang) as typeof p;
        }
        return null;
    }, [rawNode, lang]);

    const latestAchievement = useMemo(() => {
        if (!toastAchId) return null;
        return state.achievements.find((a) => a.id === toastAchId) ?? null;
    }, [toastAchId, state.achievements]);

    const profileExtraAchievements: Record<string, Achievement[]> = {
        epilogue_profile: [
            {
                id: "ending_watcher_of_era",
                title: "时代的守望者",
                description: "你经历了饥荒、通胀、垄断与暴动。你没有逃避，也没有被吞噬。你用权衡与妥协，硬生生地趟出了一条文明的活路。",
                unlockedAt: 0,
            },
        ],
        bad_ending_starved_profile: [
            {
                id: "ending_ghost_town",
                title: "死寂之村",
                description: "你没有被推翻，也没有被击败。你只是在冰冷的算计中，失去了所有需要你计算的人。",
                unlockedAt: 0,
            },
        ],
        bad_ending_exiled_profile: [
            {
                id: "ending_fall_of_tyrant",
                title: "独裁者的末日",
                description: "你把效率凌驾于人性之上，最终被忍无可忍的人性反噬。执政者最大的错觉，是以为数字可以替代人心。",
                unlockedAt: 0,
            },
        ],
    };

    if (!node) return <div className="text-white text-center mt-20">{t.nodeError}</div>;

    const onContinue = () => { if ("next" in node) setState((s) => ({ ...s, currentNodeId: (node as { next: string }).next })); };

    const onChoose = (choiceKey: "A" | "B" | "C") => {
        const rawChoiceNode = rawNode as ChoiceNode;
        const c = rawChoiceNode.choices.find((x) => x.key === choiceKey);
        if (!c) return;
        const withRecord: GameState = { ...state, choices: { ...state.choices, [node.id]: choiceKey } };
        const result = applyEffects(withRecord, c.effects, lang);
        if (!result.state.completedEvents) result.state.completedEvents = [];
        if (!result.state.completedEvents.includes(node.id)) result.state.completedEvents.push(node.id);
        setState(result.state);
        if (result.lastAchievementId) { setToastAchId(result.lastAchievementId); window.setTimeout(() => setToastAchId(null), 3500); }
    };

    const onAction = (actionNameZh: string, actionNameEn: string, effects: Effect[], apCost: number = 1) => {
        if (state.stats.actionPoints < apCost) return;
        const next: GameState = structuredClone(state);
        next.stats.actionPoints -= apCost;
        next.log.unshift({ ts: Date.now(), zh: `${UI.zh.actionPrefix}${actionNameZh}`, en: `${UI.en.actionPrefix}${actionNameEn}` });
        const result = applyEffects(next, effects, lang);
        setState(result.state);
        if (result.lastAchievementId) { setToastAchId(result.lastAchievementId); window.setTimeout(() => setToastAchId(null), 3500); }
    };

    const handleScreenClick = () => {
        if (dailySummary || crisisAlert) return;
        if ("autoPlayDuration" in node && (node as unknown as NarrationNode).autoPlayDuration) return;
        if (node.type === "dialogue" || node.type === "achievement" || node.type === "narration") { onContinue(); }
    };

    const getBgStyle = () => {
        if (node.bg === "room") return "bg-[url('/room.png')]";
        if (node.bg === "village") return "bg-[url('/village.png')]";
        if (node.bg === "ruins") return "bg-[url('/ruins.png')]";
        if (node.bg === "fire") return "bg-[url('/fire.png')]";
        if (node.bg === "dawn") return "bg-[url('/dawn.png')]";
        return "bg-black";
    };

    const isMoneyPrinterUnlocked = state.completedEvents?.includes("event5_choice");
    const isEndingPhase = node.type === "narration" || node.type === "achievement" || node.type === "title_secret" || node.type === "profile";

    // For localized display of crisis/summary
    const displayCrisis = crisisAlert ? localizeCrisis(crisisAlert, lang) : null;

    return (
        <main className="relative w-full h-screen overflow-hidden bg-black text-white" onClick={handleScreenClick}>
            <div className={`absolute inset-0 transition-all duration-[3000ms] ease-in-out z-0 bg-cover bg-center ${getBgStyle()} ${
                isEndingPhase && node.bg !== "black" ? "opacity-90 blur-none scale-100" : "opacity-100"
            }`} />
            <div className={`absolute inset-0 transition-opacity duration-[3000ms] bg-gradient-to-t from-black via-black/40 to-transparent z-0 ${
                isEndingPhase ? "opacity-40" : (node.type === "idle" ? "opacity-0" : "opacity-100")
            }`} />

            {node.type !== "title_secret" && (
                <TopBar stats={state.stats} logOpen={logOpen} onToggleLog={() => setLogOpen((v) => !v)} onNewGame={() => { clearStorage(); router.push("/"); }} onClear={() => { clearStorage(); router.push("/"); }} />
            )}

            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pointer-events-none">
                {node.type === "narration" && (
                    <div className="w-full flex-1 flex items-center justify-center p-8 pointer-events-auto">
                        <p className="text-xl md:text-3xl text-zinc-200 italic text-center leading-relaxed animate-[fadeIn_1.5s_ease-in] drop-shadow-lg whitespace-pre-wrap">
                            {"text" in node ? (node as { text: string }).text : ""}
                        </p>
                    </div>
                )}
                {node.type === "choice" && (
                    <GenshinChoiceOverlay
                        choices={(node as unknown as ChoiceNode).choices}
                        onChoose={onChoose}
                    />
                )}
                {node.type === "dialogue" && (
                    <div className="pointer-events-auto w-full flex justify-center">
                        <GenshinDialogueCard
                            speaker={(node as unknown as DialogueNode).speaker}
                            lines={normalizeLines((node as unknown as DialogueNode).text)}
                            isChoice={false}
                            prevNodeText={normalizeLines((prevNode as unknown as DialogueNode | null)?.text || "")[0]}
                            avatar={"avatar" in node ? (node as { avatar?: string }).avatar : undefined}
                        >
                            <button onClick={onContinue} className="absolute bottom-4 right-6 text-2xl text-amber-500 hover:text-amber-400 animate-pulse cursor-pointer">▼</button>
                        </GenshinDialogueCard>
                    </div>
                )}

                {/* Idle sandbox panels */}
                {node.type === "idle" && (
                    <div className="absolute inset-0 z-30 pointer-events-none flex justify-between p-8 pt-24">
                        {/* Left panel: Daily Actions */}
                        <div className="w-80 bg-black/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 pointer-events-auto flex flex-col gap-4 overflow-y-auto max-h-[80vh] custom-scrollbar animate-[slideInLeft_0.4s_ease-out]">
                            <div className="mb-2">
                                <h2 className="text-xl font-bold text-blue-400 mb-1">{t.dailyActionsTitle}</h2>
                                <p className="text-zinc-400 text-xs leading-relaxed">{t.dailyActionsHint}</p>
                            </div>
                            <button
                                disabled={state.stats.actionPoints < 1}
                                onClick={() => onAction("强制动员", "Forced Mobilization", [{ type: "add", key: "productivity", value: 20 }, { type: "add", key: "happiness", value: -10 }], 1)}
                                className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <div className="font-bold text-white mb-1">{t.mobilizeName}</div>
                                <div className="text-xs text-zinc-400">{t.mobilizeDesc}</div>
                            </button>
                            <button
                                disabled={state.stats.actionPoints < 1}
                                onClick={() => onAction("全村蹦迪", "Village Rave", [{ type: "add", key: "happiness", value: 20 }, { type: "add", key: "productivity", value: -20 }], 1)}
                                className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <div className="font-bold text-white mb-1">{t.raveName}</div>
                                <div className="text-xs text-zinc-400">{t.raveDesc}</div>
                            </button>
                            <button
                                disabled={state.stats.actionPoints < 1 || !isMoneyPrinterUnlocked}
                                onClick={() => onAction("印钞发钱", "Print Money", [{ type: "add", key: "money", value: 2000 }, { type: "add", key: "happiness", value: 5 }], 1)}
                                className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all relative overflow-hidden"
                            >
                                {!isMoneyPrinterUnlocked && (
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-xs text-red-400 font-bold backdrop-blur-sm z-10">
                                        {t.printMoneyLocked}
                                    </div>
                                )}
                                <div className="font-bold text-white mb-1">{t.printMoneyName}</div>
                                <div className="text-xs text-zinc-400">{t.printMoneyDesc}</div>
                            </button>
                        </div>

                        {/* Right panel: Construction */}
                        <div className="w-80 bg-black/80 backdrop-blur-md p-6 rounded-3xl border border-amber-500/30 pointer-events-auto flex flex-col gap-3 overflow-y-auto max-h-[80vh] custom-scrollbar animate-[slideInRight_0.4s_ease-out]">
                            <div className="mb-2 flex justify-between items-end">
                                <h2 className="text-xl font-bold text-amber-500">{t.constructionTitle}</h2>
                                <span className="text-white font-bold text-lg">{state.stats.actionPoints}/3 AP</span>
                            </div>
                            <button
                                disabled={state.stats.actionPoints < 3 || state.stats.money < 500}
                                onClick={() => onAction("建造农场", "Build Farm", [{ type: "add", key: "money", value: -500 }, { type: "add", key: "farmLevel", value: 1 }], 3)}
                                className="w-full text-left p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-30 transition-all"
                            >
                                <div className="font-bold text-amber-400 mb-1 flex justify-between">
                                    <span>{t.farmName} (Lv.{state.stats.farmLevel})</span><span>¥500</span>
                                </div>
                                <div className="text-xs text-amber-200/70">{t.farmDesc}</div>
                            </button>
                            <button
                                disabled={state.stats.actionPoints < 3 || state.stats.money < 800}
                                onClick={() => onAction("建造牧场", "Build Pasture", [{ type: "add", key: "money", value: -800 }, { type: "add", key: "pastureLevel", value: 1 }], 3)}
                                className="w-full text-left p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-30 transition-all"
                            >
                                <div className="font-bold text-amber-400 mb-1 flex justify-between">
                                    <span>{t.pastureName} (Lv.{state.stats.pastureLevel})</span><span>¥800</span>
                                </div>
                                <div className="text-xs text-amber-200/70">{t.pastureDesc}</div>
                            </button>
                            <button
                                disabled={state.stats.actionPoints < 3 || state.stats.money < 1200}
                                onClick={() => onAction("建造研究院", "Build Academy", [{ type: "add", key: "money", value: -1200 }, { type: "add", key: "academyLevel", value: 1 }, { type: "add", key: "techLevel", value: 0.2 }], 3)}
                                className="w-full text-left p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-30 transition-all"
                            >
                                <div className="font-bold text-amber-400 mb-1 flex justify-between">
                                    <span>{t.academyName} (Lv.{state.stats.academyLevel})</span><span>¥1200</span>
                                </div>
                                <div className="text-xs text-amber-200/70">{t.academyDesc}</div>
                            </button>
                            <button
                                disabled={state.stats.actionPoints < 3 || state.stats.money < 1500}
                                onClick={() => onAction("建造市场", "Build Market", [{ type: "add", key: "money", value: -1500 }, { type: "add", key: "marketLevel", value: 1 }], 3)}
                                className="w-full text-left p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-30 transition-all"
                            >
                                <div className="font-bold text-amber-400 mb-1 flex justify-between">
                                    <span>{t.marketName} (Lv.{state.stats.marketLevel})</span><span>¥1500</span>
                                </div>
                                <div className="text-xs text-amber-200/70">{t.marketDesc}</div>
                            </button>
                            <button
                                disabled={state.stats.actionPoints < 3 || state.stats.money < 2000}
                                onClick={() => onAction("开凿矿场", "Build Mine", [{ type: "add", key: "money", value: -2000 }, { type: "add", key: "mineLevel", value: 1 }], 3)}
                                className="w-full text-left p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-30 transition-all"
                            >
                                <div className="font-bold text-amber-400 mb-1 flex justify-between">
                                    <span>{t.mineName} (Lv.{state.stats.mineLevel})</span><span>¥2000</span>
                                </div>
                                <div className="text-xs text-amber-200/70">{t.mineDesc}</div>
                            </button>

                            <div className="mt-4 pt-4 border-t border-white/10 relative">
                                {state.stats.actionPoints > 0 && (
                                    <div className="absolute -top-6 right-0 w-full text-center text-sm text-amber-500 font-bold animate-bounce">
                                        {t.apRemaining}
                                    </div>
                                )}
                                <button
                                    onClick={async () => {
                                        const { processDailyTick } = await import("@/lib/engine");
                                        const { state: nextState, summary, crisis } = processDailyTick(state, lang);
                                        setState(nextState);
                                        setDailySummary(summary);
                                        setCrisisAlert(crisis);
                                    }}
                                    className="w-full group relative overflow-hidden rounded-xl px-6 py-4 text-lg font-bold transition-all active:scale-95 bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"
                                >
                                    {t.nextDay}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Achievement full-screen display */}
                {node.type === "achievement" && (
                    <div className="flex-1 flex flex-col items-center justify-start p-8 pt-[20vh] w-full animate-[fadeIn_2s_ease-in]">
                        <div className="max-w-lg w-full rounded-2xl border border-yellow-500/50 bg-black/80 p-6 shadow-[0_0_60px_rgba(234,179,8,0.2)] backdrop-blur-md animate-[bounceIn_1s_ease-out]">
                            <div className="flex items-start gap-6">
                                <div className="text-5xl drop-shadow-lg mt-2">🏆</div>
                                <div className="flex-1">
                                    <div className="text-sm text-yellow-500/80 font-bold uppercase tracking-widest mb-1">Achievement Unlocked</div>
                                    <div className="text-2xl text-yellow-400 font-bold mb-2">{"text" in node ? (node as { text: string }).text : ""}</div>
                                    {"description" in node && (node as { description?: string }).description && (
                                        <div className="text-sm text-zinc-300 leading-relaxed border-t border-yellow-500/30 pt-3 mt-2 font-serif">
                                            {(node as { description: string }).description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <p className="mt-12 text-zinc-200 animate-pulse">{t.clickToProceed}</p>
                    </div>
                )}

                {/* Ending title screen */}
                {node.type === "title_secret" && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center w-full bg-black animate-[fadeIn_3s_ease-in] pointer-events-auto">
                        <h1 className="text-4xl md:text-6xl font-serif tracking-widest text-white mb-6 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] text-center px-4">
                            {"speaker" in node && (node as { speaker?: string }).speaker
                                ? (node as { speaker: string }).speaker
                                : lang === "en" ? "[Game Over]" : "【游戏结束】"}
                        </h1>
                        <p className="text-xl text-zinc-300 italic mb-16 tracking-widest drop-shadow-md text-center px-4 max-w-2xl leading-relaxed">
                            {"text" in node && (node as { text?: string }).text ? (node as { text: string }).text : ""}
                        </p>
                        {"next" in node && (node as { next?: string }).next ? (
                            <button
                                onClick={() => { onContinue(); }}
                                className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-10 py-4 text-lg font-medium text-white transition-all hover:bg-white/20 hover:scale-105 cursor-pointer"
                            >
                                <span className="relative z-10">{lang === "en" ? "View Profile" : "查看人格档案"}</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => { clearStorage(); router.push("/"); }}
                                className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-10 py-4 text-lg font-medium text-white transition-all hover:bg-white/20 hover:scale-105 cursor-pointer"
                            >
                                <span className="relative z-10">{t.restart}</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Daily Summary Overlay */}
            {dailySummary && !crisisAlert && (
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-zinc-900 border border-white/20 p-8 rounded-3xl w-96 shadow-2xl animate-[slideUp_0.4s_ease-out]">
                        <h2 className="text-2xl font-bold text-center text-white mb-6 border-b border-white/10 pb-4">
                            {t.summaryTitle(dailySummary.day)}
                        </h2>
                        <div className="space-y-4 text-lg">
                            <div className="flex justify-between text-green-400"><span>{t.summaryRevenue}</span><span>+¥{dailySummary.income}</span></div>
                            <div className="flex justify-between text-amber-400"><span>{t.summaryFoodProd}</span><span>+{dailySummary.foodProd} kg</span></div>
                            <div className="flex justify-between text-red-400"><span>{t.summaryFoodCons}</span><span>-{dailySummary.foodCons} kg</span></div>

                            {dailySummary.starved > 0 && (
                                <div className="text-center bg-red-500/20 text-red-400 p-2 rounded-lg font-bold animate-pulse mt-4">
                                    {t.summaryStarved(dailySummary.starved)}
                                </div>
                            )}

                            <div className="border-t border-white/10 pt-4 mt-4 space-y-2 text-sm font-mono bg-black/40 p-4 rounded-xl shadow-inner">
                                <div className="text-zinc-500 mb-2 text-xs font-bold tracking-widest text-center">{t.macroTitle}</div>
                                <div className="flex justify-between text-white border-b border-white/5 pb-1"><span>{t.macroPopulation}</span><span>{dailySummary.macro.population}</span></div>
                                <div className="flex justify-between text-white border-b border-white/5 pb-1"><span>{t.macroGdp}</span><span className="text-yellow-400">¥{dailySummary.macro.gdp}</span></div>
                                <div className="flex justify-between text-white border-b border-white/5 pb-1"><span>{t.macroHappiness}</span><span className={dailySummary.macro.happiness < 40 ? "text-red-400 font-bold" : "text-green-400"}>{dailySummary.macro.happiness} / 100</span></div>
                                <div className="flex justify-between text-white border-b border-white/5 pb-1"><span>{t.macroProductivity}</span><span className={dailySummary.macro.productivity < 80 ? "text-red-400 font-bold" : "text-blue-400"}>{dailySummary.macro.productivity}</span></div>
                                <div className="flex justify-between text-white border-b border-white/5 pb-1"><span>{t.macroCpi}</span><span className={dailySummary.macro.cpi > 120 ? "text-red-400 font-bold" : ""}>{dailySummary.macro.cpi}</span></div>
                                <div className="flex justify-between text-white pb-1"><span>{t.macroUnemployment}</span><span className={dailySummary.macro.unemploymentRate > 20 ? "text-red-400 font-bold" : ""}>{dailySummary.macro.unemploymentRate}%</span></div>
                            </div>

                            {dailySummary.messages.length > 0 && (
                                <div className="pt-2">
                                    {dailySummary.messages.map((m, i) => (
                                        <div key={i} className="text-sm text-amber-500 mt-1 text-center leading-relaxed font-bold">{m}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={() => setDailySummary(null)} className="mt-8 w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all">
                            {t.summaryConfirm}
                        </button>
                    </div>
                </div>
            )}

            {/* Crisis Alert Overlay */}
            {crisisAlert && (
                <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center bg-red-950/95 backdrop-blur-md animate-[flashRed_1.5s_infinite]">
                    <div className="text-[100px] animate-[bounce_1s_infinite]">🚨</div>
                    <h1 className="text-4xl font-black tracking-widest text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] mt-2 mb-2">{t.crisisTitle}</h1>
                    <h2 className="text-3xl text-white font-bold mb-4">{displayCrisis?.title ?? crisisAlert.title}</h2>
                    <p className="max-w-xl text-center text-red-200 mb-8 leading-relaxed text-lg">{displayCrisis?.description ?? crisisAlert.description}</p>

                    {crisisAlert.shockEffects.length > 0 && (
                        <div className="bg-black/50 border border-red-500/50 rounded-xl p-6 mb-8 w-96 shadow-2xl">
                            <div className="text-sm text-red-400 font-bold mb-4 border-b border-red-500/30 pb-2">{t.crisisShockLabel}</div>
                            {crisisAlert.shockEffects.map((e, i) => {
                                if (e.type !== "add" && e.type !== "set") return null;
                                return (
                                    <div key={i} className="text-white text-xl flex justify-between font-mono my-2">
                                        <span>{e.key.toUpperCase()}</span>
                                        <span className={e.value < 0 || e.key === "unemploymentRate" || e.key === "cpi" ? "text-red-400 font-bold" : "text-blue-400 font-bold"}>
                                            {e.value > 0 ? `+${e.value}` : e.value}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <button
                        onClick={() => {
                            const next = applyEffects(state, crisisAlert.shockEffects, lang).state;
                            next.currentNodeId = crisisAlert.eventId;
                            if (!next.completedEvents) next.completedEvents = [];
                            next.completedEvents.push(crisisAlert.eventId);
                            setState(next); setDailySummary(null); setCrisisAlert(null);
                        }}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold text-2xl px-12 py-4 rounded-full shadow-[0_0_40px_rgba(239,68,68,0.5)] transition-all hover:scale-110 active:scale-95"
                    >
                        {t.crisisContinue}
                    </button>
                </div>
            )}

            {node.type === "profile" && (
                <EconomicProfile
                    choices={state.choices}
                    achievements={state.achievements}
                    lang={lang}
                    revealPersonality={node.id === "epilogue_profile"}
                    extraAchievements={profileExtraAchievements[node.id] ?? []}
                />
            )}
            <LogDrawer open={logOpen} log={state.log} />
            <AchievementToast achievement={latestAchievement} onClose={() => setToastAchId(null)} />
            {node.bg === "village" && node.type !== "title_secret" && (
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <VillagerSwarm currentNodeId={state.currentNodeId} population={state.stats.population} />
                </div>
            )}

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes flashRed { 0%, 100% { background-color: rgba(69, 10, 10, 0.95); } 50% { background-color: rgba(127, 29, 29, 0.95); } }
                @keyframes slideInLeft { from { transform: translateX(-50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes slideInRight { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes bounceIn { 0% { transform: scale(0.9); opacity: 0; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
                @keyframes profileCardRise { 0% { transform: translateY(40px) scale(0.92); opacity: 0; } 70% { transform: translateY(-4px) scale(1.02); opacity: 1; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
                @keyframes cardFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
            `}} />
        </main>
    );
}

export default function GamePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
            <GamePageInner />
        </Suspense>
    );
}
