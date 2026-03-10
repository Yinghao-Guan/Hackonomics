// src/components/ChoiceOverlay.tsx
type ChoiceOverlayProps = {
    choices: Array<{ key: "A" | "B" | "C"; title: string; description?: string }>;
    onChoose: (key: "A" | "B" | "C") => void;
};

export default function ChoiceOverlay({ choices, onChoose }: ChoiceOverlayProps) {
    return (
        <div className="fixed inset-0 z-30 flex flex-col items-center justify-end pointer-events-none pb-[35vh]">
            <div className="flex flex-col items-center gap-3 w-full max-w-2xl px-6 pointer-events-auto animate-vn-slide-up">
                {choices.map((c) => (
                    <button
                        key={c.key}
                        onClick={() => onChoose(c.key)}
                        className="w-full rounded-xl border border-white/20 bg-black/65 hover:bg-black/85 hover:border-white/40 backdrop-blur-sm px-6 py-4 text-left transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/80 text-xs font-bold text-black flex-shrink-0">
                                {c.key}
                            </span>
                            <span className="text-base font-semibold text-white">{c.title}</span>
                        </div>
                        {c.description && (
                            <div className="mt-2 ml-9 text-sm text-white/70">{c.description}</div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
