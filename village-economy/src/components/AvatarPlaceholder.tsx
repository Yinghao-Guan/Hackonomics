// src/components/AvatarPlaceholder.tsx
export default function AvatarPlaceholder({ label }: { label: string }) {
    return (
        <div className="h-[350px] w-[250px]">
            <div className="w-full h-full rounded-2xl bg-gradient-to-b from-white/15 via-white/8 to-transparent ring-1 ring-white/15 shadow-2xl relative">
                <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl bg-black/50 py-2 text-center text-sm font-semibold text-white/90">
                    {label}
                </div>
            </div>
        </div>
    );
}
