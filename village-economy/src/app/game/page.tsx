// src/app/game/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; 
import TopBar from "@/components/TopBar";
import LogDrawer from "@/components/LogDrawer";
import AchievementToast from "@/components/AchievementToast";
import AvatarPlaceholder from "@/components/AvatarPlaceholder";
import { NODES, START_NODE_ID, type ChoiceNode, type DialogueNode, type Effect, type NarrationNode, type AchievementNode } from "@/lib/nodes";
import { loadFromStorage, saveToStorage, clearStorage } from "@/lib/storage";
import { newGameState, clampStats, type GameState } from "@/lib/gameState";
import { applyEffects, type DailySummary, type CrisisAlert } from "@/lib/engine";
import VillagerSwarm from '@/components/VillagerSwarm';

function normalizeLines(text: string | string[]) { return Array.isArray(text) ? text : [text]; }

type GenshinDialogueCardProps = { speaker?: string; lines: string[]; children?: React.ReactNode; isChoice?: boolean; prevNodeText?: string; };
function GenshinDialogueCard({ speaker, lines, children, isChoice = false, prevNodeText }: GenshinDialogueCardProps) {
    return (
        <div className="w-full max-w-4xl px-4 pb-8 md:pb-12 animate-[slideUp_0.3s_ease-out]">
            {speaker && <div className="inline-block bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-2 rounded-t-xl text-black font-bold text-lg md:text-xl shadow-md border border-b-0 border-amber-400/50">{speaker}</div>}
            <div className="bg-zinc-900/90 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-b-xl rounded-tr-xl min-h-[140px] shadow-2xl relative">
                {isChoice && prevNodeText && <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed max-w-[80ch]">{prevNodeText}</p>}
                {(!isChoice || !prevNodeText) && lines.map((t, i) => <p key={i} className="text-lg md:text-xl leading-relaxed text-white/95 animate-vn-text-in max-w-[80ch]">{t}</p>)}
                {children}
            </div>
        </div>
    );
}

type GenshinChoiceOverlayProps = { choices: Array<{ key: "A" | "B" | "C"; title: string; description?: string }>; onChoose: (key: "A" | "B" | "C") => void; };
function GenshinChoiceOverlay({ choices, onChoose }: GenshinChoiceOverlayProps) {
    return (
        <div className="absolute right-8 md:right-24 top-1/2 -translate-y-1/2 flex flex-col gap-4 w-[80%] max-w-sm z-30 pointer-events-auto">
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

export default function GamePage() {
    const sp = useSearchParams();
    const router = useRouter(); 
    const shouldReset = sp.get("reset") === "1";

    const [logOpen, setLogOpen] = useState(false);
    const [state, setState] = useState<GameState>(() => newGameState(START_NODE_ID));
    const [toastAchId, setToastAchId] = useState<string | null>(null);

    // 弹窗状态
    const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
    const [crisisAlert, setCrisisAlert] = useState<CrisisAlert | null>(null);

    useEffect(() => {
        if (shouldReset) { clearStorage(); setState(newGameState(START_NODE_ID)); router.replace("/game"); return; }
        const saved = loadFromStorage<GameState>();
        if (saved?.currentNodeId && saved.stats) { setState(saved); } else { setState(newGameState(START_NODE_ID)); }
    }, [shouldReset, router]);

    useEffect(() => { saveToStorage(state); }, [state]);

    const node = NODES[state.currentNodeId];

    useEffect(() => {
        if (node && 'autoPlayDuration' in node && node.autoPlayDuration) {
            const timer = setTimeout(() => {
                onContinue();
            }, node.autoPlayDuration);
            return () => clearTimeout(timer);
        }
    }, [state.currentNodeId]);
    
    const prevNode = useMemo(() => {
        if (node?.type !== 'choice') return null;
        const saved = loadFromStorage<GameState>();
        if (saved?.currentNodeId) { const p = NODES[saved.currentNodeId]; if (p?.type === 'dialogue') return p; }
        return null;
    }, [node]);

    const latestAchievement = useMemo(() => {
        if (!toastAchId) return null;
        return state.achievements.find((a) => a.id === toastAchId) ?? null;
    }, [toastAchId, state.achievements]);

    if (!node) return <div className="text-white text-center mt-20">节点崩溃</div>;

    const onContinue = () => { if ('next' in node) setState((s) => ({ ...s, currentNodeId: node.next as string })); };

    const onChoose = (choiceKey: "A" | "B" | "C") => {
        const c = (node as ChoiceNode).choices.find((x) => x.key === choiceKey);
        if (!c) return;
        const withRecord: GameState = { ...state, choices: { ...state.choices, [node.id]: choiceKey } };
        const result = applyEffects(withRecord, c.effects);
        if (!result.state.completedEvents) result.state.completedEvents = [];
        if (!result.state.completedEvents.includes(node.id)) result.state.completedEvents.push(node.id);
        setState(result.state);
        if (result.lastAchievementId) { setToastAchId(result.lastAchievementId); window.setTimeout(() => setToastAchId(null), 3500); }
    };

    const onAction = (actionName: string, effects: Effect[], apCost: number = 1) => {
        if (state.stats.actionPoints < apCost) return;
        let next: GameState = structuredClone(state);
        next.stats.actionPoints -= apCost;
        next.log.unshift({ ts: Date.now(), text: `【施政】${actionName}` });
        const result = applyEffects(next, effects);
        setState(result.state);
        if (result.lastAchievementId) { setToastAchId(result.lastAchievementId); window.setTimeout(() => setToastAchId(null), 3500); }
    };

    const handleScreenClick = () => { 
        if (dailySummary || crisisAlert) return;
        // 如果有自动播放时长，锁定点击，强制玩家看完
        if ('autoPlayDuration' in node && (node as NarrationNode).autoPlayDuration) return;
        
        if (node.type === "dialogue" || node.type === "achievement" || node.type === "narration") {
            onContinue(); 
        }
    };

    const getBgStyle = () => {
        if (node.bg === "room") return "bg-[url('/room.png')]";
        if (node.bg === "village") return "bg-[url('/village.png')]";
        if (node.bg === "ruins") return "bg-[url('/ruins.png')]"; // 饥荒废墟
        if (node.bg === "fire") return "bg-[url('/fire.png')]";   // 暴乱烈火
        if (node.bg === "dawn") return "bg-[url('/dawn.png')]";   // 真结局破晓
        return "bg-black"; 
    };

    const isMoneyPrinterUnlocked = state.completedEvents?.includes("event5_choice");
    const isEndingPhase = node.type === "narration" || node.type === "achievement" || node.type === "title_secret";

    return (
        <main className="relative w-full h-screen overflow-hidden bg-black text-white" onClick={handleScreenClick}>
            {/*  动态背景层：结局时高亮展现 */}
            <div 
                className={`absolute inset-0 transition-all duration-[3000ms] ease-in-out z-0 bg-cover bg-center ${getBgStyle()} ${
                    isEndingPhase && node.bg !== "black" ? "opacity-90 blur-none scale-100" : "opacity-100"
                }`} 
            />
            <div className={`absolute inset-0 transition-opacity duration-[3000ms] bg-gradient-to-t from-black via-black/40 to-transparent z-0 ${
                isEndingPhase ? "opacity-40" : (node.type === "idle" ? "opacity-0" : "opacity-100")
            }`} />

            {/* 隐藏头像：只有在非闲置、且非结局的情况下才显示 */}
            {node.type !== "idle" && node.type !== "title_secret" && (
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none pb-[20vh]">
                    <AvatarPlaceholder label={('speaker' in node && node.speaker) ? node.speaker : ''} avatar={'avatar' in node ? node.avatar : undefined} />
                </div>
            )}

            {/* 隐藏顶部状态栏：进入大结局后，一切数据皆为虚无 */}
            {node.type !== "title_secret" && (
                <TopBar stats={state.stats} logOpen={logOpen} onToggleLog={() => setLogOpen((v) => !v)} onNewGame={() => { clearStorage(); router.push("/"); }} onClear={() => { clearStorage(); router.push("/"); }} />
            )}

            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pointer-events-none">
                {node.type === "narration" && (
                    <div className="w-full flex-1 flex items-center justify-center p-8 pointer-events-auto">
                        <p className="text-xl md:text-3xl text-zinc-200 italic text-center leading-relaxed animate-[fadeIn_1.5s_ease-in] drop-shadow-lg whitespace-pre-wrap">
                            {('text' in node) ? node.text : ""}
                        </p>
                    </div>
                )}
                {node.type === "choice" && <GenshinChoiceOverlay choices={(node as ChoiceNode).choices} onChoose={onChoose} />}
                {node.type === "dialogue" && (
                    <div className="pointer-events-auto w-full flex justify-center">
                        <GenshinDialogueCard speaker={(node as DialogueNode).speaker} lines={normalizeLines((node as DialogueNode).text)} isChoice={false} prevNodeText={normalizeLines(prevNode?.text || "")[0]}>
                            <button onClick={onContinue} className="absolute bottom-4 right-6 text-2xl text-amber-500 hover:text-amber-400 animate-pulse cursor-pointer">▼</button>
                        </GenshinDialogueCard>
                    </div>
                )}

                {/* 沙盒面板... (此处保持原样) */}
                {node.type === "idle" && (
                    <div className="absolute inset-0 z-30 pointer-events-none flex justify-between p-8 pt-24">
                        <div className="w-80 bg-black/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 pointer-events-auto flex flex-col gap-4 overflow-y-auto max-h-[80vh] custom-scrollbar animate-[slideInLeft_0.4s_ease-out]">
                            <div className="mb-2">
                                <h2 className="text-xl font-bold text-blue-400 mb-1">日常指令 (1 AP)</h2>
                                <p className="text-zinc-400 text-xs leading-relaxed">提示：高生产力可提升每日税收。幸福度低于40会导致怠工减产，高于80会吸引流民加入。</p>
                            </div>
                            <button disabled={state.stats.actionPoints < 1} onClick={() => onAction("强制动员", [{ type: "add", key: "productivity", value: 20 }, { type: "add", key: "happiness", value: -10 }], 1)} className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                                <div className="font-bold text-white mb-1">⛏️ 强制动员</div><div className="text-xs text-zinc-400">+20生产力 (拉动次日税收)，但 -10幸福度。</div>
                            </button>
                            <button disabled={state.stats.actionPoints < 1} onClick={() => onAction("全村蹦迪", [{ type: "add", key: "happiness", value: 20 }, { type: "add", key: "productivity", value: -20 }], 1)} className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                                <div className="font-bold text-white mb-1">🪩 全村蹦迪</div><div className="text-xs text-zinc-400">举办狂欢。+20幸福度，但全体宿醉导致 -20生产力。</div>
                            </button>
                            <button disabled={state.stats.actionPoints < 1 || !isMoneyPrinterUnlocked} onClick={() => onAction("印钞发钱", [{ type: "add", key: "money", value: 2000 }, { type: "add", key: "happiness", value: 5 }], 1)} className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all relative overflow-hidden">
                                {!isMoneyPrinterUnlocked && <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-xs text-red-400 font-bold backdrop-blur-sm z-10">完成事件五解锁</div>}
                                <div className="font-bold text-white mb-1">🖨️ 印钞发钱</div><div className="text-xs text-zinc-400">凭空+¥2000，+5幸福。注意：资金远超生产力会引发CPI暴涨。</div>
                            </button>
                        </div>

                        <div className="w-80 bg-black/80 backdrop-blur-md p-6 rounded-3xl border border-amber-500/30 pointer-events-auto flex flex-col gap-3 overflow-y-auto max-h-[80vh] custom-scrollbar animate-[slideInRight_0.4s_ease-out]">
                            <div className="mb-2 flex justify-between items-end">
                                <h2 className="text-xl font-bold text-amber-500">基建工程</h2><span className="text-white font-bold text-lg">{state.stats.actionPoints}/3 AP</span>
                            </div>
                            <button disabled={state.stats.actionPoints < 3 || state.stats.money < 500} onClick={() => onAction("建造农场", [{ type: "add", key: "money", value: -500 }, { type: "add", key: "farmLevel", value: 1 }], 3)} className="w-full text-left p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-30 transition-all">
                                <div className="font-bold text-amber-400 mb-1 flex justify-between"><span>🌾 农场 ({state.stats.farmLevel}级)</span><span>¥500</span></div><div className="text-xs text-amber-200/70">每日产粮 +8。解决温饱的基础。</div>
                            </button>
                            <button disabled={state.stats.actionPoints < 3 || state.stats.money < 800} onClick={() => onAction("建造牧场", [{ type: "add", key: "money", value: -800 }, { type: "add", key: "pastureLevel", value: 1 }], 3)} className="w-full text-left p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-30 transition-all">
                                <div className="font-bold text-amber-400 mb-1 flex justify-between"><span>🐄 牧场 ({state.stats.pastureLevel}级)</span><span>¥800</span></div><div className="text-xs text-amber-200/70">每日产粮 +4。可能触发特定经济事件。</div>
                            </button>
                            <button disabled={state.stats.actionPoints < 3 || state.stats.money < 1200} onClick={() => onAction("建造研究院", [{ type: "add", key: "money", value: -1200 }, { type: "add", key: "academyLevel", value: 1 }, { type: "add", key: "techLevel", value: 0.2 }], 3)} className="w-full text-left p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-30 transition-all">
                                <div className="font-bold text-amber-400 mb-1 flex justify-between"><span>📜 研究院 ({state.stats.academyLevel}级)</span><span>¥1200</span></div><div className="text-xs text-amber-200/70">科技倍率 +0.2。指数级放大矿场收益与GDP。</div>
                            </button>
                            <button disabled={state.stats.actionPoints < 3 || state.stats.money < 1500} onClick={() => onAction("建造市场", [{ type: "add", key: "money", value: -1500 }, { type: "add", key: "marketLevel", value: 1 }], 3)} className="w-full text-left p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-30 transition-all">
                                <div className="font-bold text-amber-400 mb-1 flex justify-between"><span>🛒 市场 ({state.stats.marketLevel}级)</span><span>¥1500</span></div><div className="text-xs text-amber-200/70">每日额外入账 +¥150，大幅拉动消费。</div>
                            </button>
                            <button disabled={state.stats.actionPoints < 3 || state.stats.money < 2000} onClick={() => onAction("开凿矿场", [{ type: "add", key: "money", value: -2000 }, { type: "add", key: "mineLevel", value: 1 }], 3)} className="w-full text-left p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-30 transition-all">
                                <div className="font-bold text-amber-400 mb-1 flex justify-between"><span>⚒️ 矿场 ({state.stats.mineLevel}级)</span><span>¥2000</span></div><div className="text-xs text-amber-200/70">每日巨额税收。受科技水平乘数加成。</div>
                            </button>

                            <div className="mt-4 pt-4 border-t border-white/10 relative">
                                {state.stats.actionPoints > 0 && <div className="absolute -top-6 right-0 w-full text-center text-sm text-amber-500 font-bold animate-bounce">尚有 AP 未消耗</div>}
                                <button
                                    onClick={async () => {
                                        const { processDailyTick } = await import("@/lib/engine");
                                        const { state: nextState, summary, crisis } = processDailyTick(state); 
                                        setState(nextState); 
                                        setDailySummary(summary); 
                                        setCrisisAlert(crisis); 
                                    }}
                                    className="w-full group relative overflow-hidden rounded-xl px-6 py-4 text-lg font-bold transition-all active:scale-95 bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"
                                >
                                    进入下一天 🌙
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 全屏史诗成就弹窗 (与 app/page.tsx 完全一致) */}
                {node.type === "achievement" && (
                <div className="flex-1 flex flex-col items-center justify-start p-8 pt-[20vh] w-full animate-[fadeIn_2s_ease-in]">
                    <div className="max-w-lg w-full rounded-2xl border border-yellow-500/50 bg-black/80 p-6 shadow-[0_0_60px_rgba(234,179,8,0.2)] backdrop-blur-md animate-[bounceIn_1s_ease-out]">
                    <div className="flex items-start gap-6">
                        <div className="text-5xl drop-shadow-lg mt-2">🏆</div>
                        <div className="flex-1">
                        <div className="text-sm text-yellow-500/80 font-bold uppercase tracking-widest mb-1">Achievement Unlocked</div>
                        <div className="text-2xl text-yellow-400 font-bold mb-2">{node.text}</div>
                        {('description' in node && node.description) && (
                            <div className="text-sm text-zinc-300 leading-relaxed border-t border-yellow-500/30 pt-3 mt-2 font-serif">
                                {node.description}
                            </div>
                        )}
                        </div>
                    </div>
                    </div>
                    <p className="mt-12 text-zinc-200 animate-pulse">(点击进入结局)</p>
                </div>
                )}

                {/* 游戏内的所有电影级大结局！ */}
                {node.type === "title_secret" && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center w-full bg-black animate-[fadeIn_3s_ease-in] pointer-events-auto">
                        <h1 className="text-4xl md:text-6xl font-serif tracking-widest text-white mb-6 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] text-center px-4">
                            {('speaker' in node && node.speaker) ? node.speaker : "【游戏结束】"}
                        </h1>
                        <p className="text-xl text-zinc-300 italic mb-16 tracking-widest drop-shadow-md text-center px-4 max-w-2xl leading-relaxed">
                            {('text' in node && node.text) ? node.text : ""}
                        </p>
                        <button
                            onClick={() => {
                                clearStorage();
                                router.push("/");
                            }}
                            className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-10 py-4 text-lg font-medium text-white transition-all hover:bg-white/20 hover:scale-105 cursor-pointer"
                        >
                            <span className="relative z-10">重新轮回 (Restart)</span>
                        </button>
                    </div>
                )}
            </div>

            {/* OVERLAYS (结算与警报保持不变) */}
            {dailySummary && !crisisAlert && (
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-zinc-900 border border-white/20 p-8 rounded-3xl w-96 shadow-2xl animate-[slideUp_0.4s_ease-out]">
                        <h2 className="text-2xl font-bold text-center text-white mb-6 border-b border-white/10 pb-4">第 {dailySummary.day} 天结算单</h2>
                        <div className="space-y-4 text-lg">
                            <div className="flex justify-between text-green-400"><span>💰 财政入账:</span> <span>+¥{dailySummary.income}</span></div>
                            <div className="flex justify-between text-amber-400"><span>🌾 基础采摘与产出:</span> <span>+{dailySummary.foodProd} kg</span></div>
                            <div className="flex justify-between text-red-400"><span>口 消耗储备:</span> <span>-{dailySummary.foodCons} kg</span></div>
                            
                            {dailySummary.starved > 0 && (
                                <div className="text-center bg-red-500/20 text-red-400 p-2 rounded-lg font-bold animate-pulse mt-4">💀 饿死 {dailySummary.starved} 人</div>
                            )}

                            {/* 👇 新增：每日宏观指数收盘大盘！ */}
                            <div className="border-t border-white/10 pt-4 mt-4 space-y-2 text-sm font-mono bg-black/40 p-4 rounded-xl shadow-inner">
                                <div className="text-zinc-500 mb-2 text-xs font-bold tracking-widest text-center">📊 宏观指数收盘价</div>
                                <div className="flex justify-between text-white border-b border-white/5 pb-1"><span>人口 (POP):</span> <span>{dailySummary.macro.population}</span></div>
                                <div className="flex justify-between text-white border-b border-white/5 pb-1"><span>总值 (GDP):</span> <span className="text-yellow-400">¥{dailySummary.macro.gdp}</span></div>
                                <div className="flex justify-between text-white border-b border-white/5 pb-1"><span>幸福 (HAP):</span> <span className={dailySummary.macro.happiness < 40 ? "text-red-400 font-bold" : "text-green-400"}>{dailySummary.macro.happiness} / 100</span></div>
                                <div className="flex justify-between text-white border-b border-white/5 pb-1"><span>生产 (PROD):</span> <span className={dailySummary.macro.productivity < 80 ? "text-red-400 font-bold" : "text-blue-400"}>{dailySummary.macro.productivity}</span></div>
                                <div className="flex justify-between text-white border-b border-white/5 pb-1"><span>物价 (CPI):</span> <span className={dailySummary.macro.cpi > 120 ? "text-red-400 font-bold" : ""}>{dailySummary.macro.cpi}</span></div>
                                <div className="flex justify-between text-white pb-1"><span>失业 (UNEMP):</span> <span className={dailySummary.macro.unemploymentRate > 20 ? "text-red-400 font-bold" : ""}>{dailySummary.macro.unemploymentRate}%</span></div>
                            </div>

                            {/* 事件触发时的提示语 */}
                            {dailySummary.messages.length > 0 && (
                                <div className="pt-2">
                                    {dailySummary.messages.map((m, i) => (
                                        <div key={i} className="text-sm text-amber-500 mt-1 text-center leading-relaxed font-bold">{m}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={() => setDailySummary(null)} className="mt-8 w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all">确认</button>
                    </div>
                </div>
            )}

            {crisisAlert && (
                <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center bg-red-950/95 backdrop-blur-md animate-[flashRed_1.5s_infinite]">
                    <div className="text-[100px] animate-[bounce_1s_infinite]">🚨</div>
                    <h1 className="text-4xl font-black tracking-widest text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] mt-2 mb-2">突 发 危 机</h1>
                    <h2 className="text-3xl text-white font-bold mb-4">{crisisAlert.title}</h2>
                    <p className="max-w-xl text-center text-red-200 mb-8 leading-relaxed text-lg">{crisisAlert.description}</p>
                    
                    {crisisAlert.shockEffects.length > 0 && (
                        <div className="bg-black/50 border border-red-500/50 rounded-xl p-6 mb-8 w-96 shadow-2xl">
                            <div className="text-sm text-red-400 font-bold mb-4 border-b border-red-500/30 pb-2">⚠️ 局势剧变，系统受到冲击：</div>
                            {crisisAlert.shockEffects.map((e, i) => {
                                if (e.type !== "add" && e.type !== "set") return null;
                                return (
                                    <div key={i} className="text-white text-xl flex justify-between font-mono my-2">
                                        <span>{e.key.toUpperCase()}</span>
                                        <span className={e.value < 0 || e.key === 'unemploymentRate' || e.key === 'cpi' ? "text-red-400 font-bold" : "text-blue-400 font-bold"}>
                                            {e.value > 0 ? `+${e.value}` : e.value}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <button 
                        onClick={() => {
                            let next = applyEffects(state, crisisAlert.shockEffects).state;
                            next.currentNodeId = crisisAlert.eventId;
                            if (!next.completedEvents) next.completedEvents = [];
                            next.completedEvents.push(crisisAlert.eventId);
                            setState(next); setDailySummary(null); setCrisisAlert(null);
                        }}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold text-2xl px-12 py-4 rounded-full shadow-[0_0_40px_rgba(239,68,68,0.5)] transition-all hover:scale-110 active:scale-95"
                    >继续</button>
                </div>
            )}

            <LogDrawer open={logOpen} log={state.log} />
            <AchievementToast achievement={latestAchievement} onClose={() => setToastAchId(null)} />
            {node.bg === "village" && node.type !== "title_secret" && <div className="absolute inset-0 z-0 pointer-events-none"><VillagerSwarm currentNodeId={state.currentNodeId} population={state.stats.population} /></div>}

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes flashRed { 0%, 100% { background-color: rgba(69, 10, 10, 0.95); } 50% { background-color: rgba(127, 29, 29, 0.95); } }
            `}} />
        </main>
    );
}