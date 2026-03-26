// src/components/TopBar.tsx
"use client";
import type { GameStats } from "@/lib/nodes";
import { useLanguage } from "@/lib/language";
import { UI } from "@/lib/translations";

function Pill({ label, value, isDanger = false }: { label: string; value: string; isDanger?: boolean }) {
    return (
        <div className={`rounded-full border px-3 py-1 text-xs transition-colors ${
            isDanger
            ? "border-red-500/50 bg-red-500/20 text-red-200 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)]"
            : "border-white/10 bg-white/5 text-white/90"
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
    const { lang, setLang } = useLanguage();
    const t = UI[lang];

    return (
        <div className="fixed top-0 left-0 right-0 z-40 flex flex-wrap items-center gap-2 px-4 py-2 backdrop-blur-md bg-black/60 border-b border-white/10 shadow-lg">
            {/* Base resources */}
            <Pill label="💰 Money" value={`¥${stats.money}`} />
            <Pill label="🌾 Food" value={`${stats.foodStock}kg`} isDanger={stats.foodStock < stats.population} />
            <Pill label="👥 Pop" value={String(stats.population)} />

            {/* Macro indicators */}
            <Pill label="📈 GDP" value={`${stats.gdp}`} />
            <Pill label="🛒 CPI" value={`${stats.cpi}`} isDanger={stats.cpi > 120} />
            <Pill label="📉 Unemp" value={`${stats.unemploymentRate}%`} isDanger={stats.unemploymentRate > 20} />
            <Pill label="😊 Hap" value={`${stats.happiness}`} isDanger={stats.happiness < 40} />

            <div className="ml-auto flex gap-2">
                <button
                    onClick={() => setLang(lang === "zh" ? "en" : "zh")}
                    className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-colors"
                >
                    {t.langToggle}
                </button>
                <button
                    onClick={onToggleLog}
                    className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium text-white/80 hover:bg-white/10 transition-colors"
                >
                    {logOpen ? t.logOpen : t.logClosed}
                </button>
                <button
                    onClick={onNewGame}
                    className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                >
                    {t.newGame}
                </button>
            </div>
        </div>
    );
}
