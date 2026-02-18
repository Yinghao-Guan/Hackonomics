// src/components/AvatarPlaceholder.tsx
export default function AvatarPlaceholder({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 ring-1 ring-white/10" />
            <div className="text-xs text-white/70">{label}</div>
        </div>
    );
}
