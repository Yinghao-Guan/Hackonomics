// src/components/TopBar.tsx
import type { GameStats } from "@/lib/nodes";

function Pill({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/90">
            <span className="text-white/60">{label}</span> <span className="font-semibold">{value}</span>
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
        <div className="fixed top-0 left-0 right-0 z-40 flex flex-wrap items-center gap-2 px-4 py-2 backdrop-blur-sm bg-black/50 border-b border-white/10">
            <Pill label="💰 Money" value={String(stats.money)} />
            <Pill label="🌾 Food" value={`${stats.foodStock}kg`} />
            <Pill label="👥 Pop" value={String(stats.population)} />
            <Pill label="😊 Happy" value={`${stats.happiness}`} />
            <Pill label="⚙️ Prod" value={`${stats.productivity}`} />
            <Pill label="⏳ AP" value={`${stats.actionPoints}`} />
            <Pill label="🗓️ Season" value={`${stats.season}`} />
            <Pill label="📅 Day" value={`${stats.day}/20`} />

            <div className="ml-auto flex gap-2">
                <button
                    onClick={onToggleLog}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/80 hover:bg-white/10"
                >
                    {logOpen ? "关闭日志" : "打开日志"}
                </button>
                <button
                    onClick={onNewGame}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/80 hover:bg-white/10"
                >
                    New Game
                </button>
                <button
                    onClick={onClear}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/80 hover:bg-white/10"
                >
                    Clear Save
                </button>
            </div>
        </div>
    );
}
