// src/components/TopBar.tsx
import type { GameStats } from "@/lib/nodes";

function Pill({ label, value, isDanger = false }: { label: string; value: string; isDanger?: boolean }) {
    return (
        <div className={`rounded-full border px-3 py-1 text-xs transition-colors ${
            isDanger 
            ? "border-red-500/50 bg-red-500/20 text-red-200 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)]" // 危机状态：红色 + 心跳闪烁
            : "border-white/10 bg-white/5 text-white/90" // 正常状态
        }`}>
            <span className="text-white/60 mr-1">{label}</span> 
            <span className="font-bold">{value}</span>
        </div>
    );
}

export default function TopBar({
    stats,
    logOpen,
    onToggleLog,
    onNewGame,
    onClear,
}: {
    stats: GameStats;
    logOpen: boolean;
    onToggleLog: () => void;
    onNewGame: () => void;
    onClear: () => void;
}) {
    return (
        <div className="fixed top-0 left-0 right-0 z-40 flex flex-wrap items-center gap-2 px-4 py-2 backdrop-blur-md bg-black/60 border-b border-white/10 shadow-lg">
            {/* 基础资源 */}
            <Pill label="💰 Money" value={`¥${stats.money}`} />
            <Pill label="🌾 Food" value={`${stats.foodStock}kg`} isDanger={stats.foodStock < stats.population} />
            <Pill label="👥 Population" value={String(stats.population)} />
            
            {/* 宏观经济指标 (Derived Stats) */}
            <Pill label="📈 GDP" value={`${stats.gdp}`} />
            <Pill label="🛒 CPI" value={`${stats.cpi}`} isDanger={stats.cpi > 120} />
            <Pill label="📉 Unemployment" value={`${stats.unemploymentRate}%`} isDanger={stats.unemploymentRate > 20} />
            <Pill label="😊 Happiness" value={`${stats.happiness}`} isDanger={stats.happiness < 40} />
            
            <div className="ml-auto flex gap-2">
                <button
                    onClick={onToggleLog}
                    className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium text-white/80 hover:bg-white/10 transition-colors"
                >
                    {logOpen ? "关闭日志" : "事件日志"}
                </button>
                <button
                    onClick={onNewGame}
                    className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                >
                    New Game
                </button>
            </div>
        </div>
    );
}
