// src/components/TopBar.tsx
import type { GameStats } from "@/lib/nodes";

function Pill({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/90">
            <span className="text-white/60">{label}</span> <span className="font-semibold">{value}</span>
        </div>
    );
}

export default function TopBar({ stats }: { stats: GameStats }) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Pill label="💰 Money" value={String(stats.money)} />
            <Pill label="🌾 Food" value={`${stats.foodStock}kg`} />
            <Pill label="👥 Pop" value={String(stats.population)} />
            <Pill label="😊 Happy" value={`${stats.happiness}`} />
            <Pill label="⚙️ Prod" value={`${stats.productivity}`} />
            <Pill label="⏳ AP" value={`${stats.actionPoints}`} />
            <Pill label="🗓️ Season" value={`${stats.season}`} />
            <Pill label="📅 Day" value={`${stats.day}/20`} />
        </div>
    );
}
