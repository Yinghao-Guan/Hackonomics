// src/components/LogDrawer.tsx
import type { LogItem } from "@/lib/gameState";

export default function LogDrawer({
    open,
    log,
}: {
    open: boolean;
    log: LogItem[];
}) {
    if (!open) return null;

    return (
        <div className="fixed right-4 top-12 z-40">
            <div className="w-[min(420px,90vw)] rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur shadow-2xl">
                <div className="mb-2 text-sm font-bold text-amber-500">村庄大事记 (Event Log)</div>
                <div className="max-h-[60vh] space-y-2 overflow-auto pr-1 custom-scrollbar">
                    {log.map((item, index) => (
                        <div key={`${item.ts}-${index}`} className="rounded-xl bg-white/5 p-3 text-sm text-white/90 border border-white/5">
                            <div className="text-xs text-amber-500/50 mb-1">{new Date(item.ts).toLocaleString()}</div>
                            <div className="leading-relaxed">{item.text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}