// src/components/AchievementToast.tsx
import type { Achievement } from "@/lib/gameState";

export default function AchievementToast({
                                             achievement,
                                             onClose,
                                         }: {
    achievement: Achievement | null;
    onClose: () => void;
}) {
    if (!achievement) return null;

    return (
        <div className="fixed bottom-5 left-1/2 z-50 w-[min(520px,92vw)] -translate-x-1/2">
            <div className="rounded-2xl border border-white/10 bg-black/70 p-4 shadow-xl backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-sm text-white/70">Achievement unlocked</div>
                        <div className="mt-1 text-lg font-semibold text-white">{achievement.title}</div>
                        <div className="mt-1 text-sm text-white/80">{achievement.description}</div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                    >
                        关闭
                    </button>
                </div>
            </div>
        </div>
    );
}
