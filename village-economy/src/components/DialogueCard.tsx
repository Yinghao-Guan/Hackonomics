// src/components/DialogueCard.tsx
export default function DialogueCard({
    speaker,
    lines,
    children,
}: {
    speaker: string;
    lines: string[];
    children?: React.ReactNode;
}) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-20 min-h-[32vh] rounded-t-2xl bg-black/80 border-t border-white/15 backdrop-blur-md px-8 py-5">
            <div>
                <span className="inline-block px-4 py-1 mb-3 rounded-t-lg rounded-br-lg bg-gradient-to-r from-amber-500 to-orange-500 text-sm font-bold text-black shadow">
                    {speaker}
                </span>
            </div>

            <div className="space-y-2">
                {lines.map((t, i) => (
                    <p key={i} className="text-base leading-relaxed text-white/95 animate-vn-text-in max-w-[80ch]">
                        {t}
                    </p>
                ))}
            </div>

            {children}
        </div>
    );
}
