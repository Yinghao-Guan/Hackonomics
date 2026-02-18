// src/components/DialogueCard.tsx
import AvatarPlaceholder from "./AvatarPlaceholder";

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
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
            <div className="flex gap-5">
                <AvatarPlaceholder label={speaker} />
                <div className="flex-1">
                    <div className="text-xs text-white/60">Speaker</div>
                    <div className="text-lg font-semibold text-white">{speaker}</div>

                    <div className="mt-4 space-y-2 text-white/85">
                        {lines.map((t, i) => (
                            <p key={i} className="leading-relaxed">
                                {t}
                            </p>
                        ))}
                    </div>

                    <div className="mt-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
