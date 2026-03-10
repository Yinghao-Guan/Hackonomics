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
            <div className="w-[min(420px,90vw)] rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur">
                <div className="mb-2 text-sm font-semibold text-white">事件日志</div>
                <div className="max-h-[60vh] space-y-2 overflow-auto pr-1">
                    {log.map((item) => (
                        <div key={item.ts} className="rounded-xl bg-white/5 p-3 text-sm text-white/80">
                            <div className="text-xs text-white/50">{new Date(item.ts).toLocaleString()}</div>
                            <div className="mt-1">{item.text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
