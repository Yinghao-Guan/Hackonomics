// src/components/AvatarPlaceholder.tsx
export default function AvatarPlaceholder({ label, avatar }: { label: string; avatar?: string }) {
    // 如果是旁白（系统）或者没有标签，就不显示立绘
    if (!label || label === "（系统）" || label === "（黑屏）") return null;

    return (
        <div className="h-[350px] w-[250px] animate-[float_4s_ease-in-out_infinite] flex flex-col items-center justify-end pb-8">
            {/* 全局悬浮动画 */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes popIn {
                    0% { transform: scale(0.8) translateY(20px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
            `}</style>
            
            {/* 巨大的 Emoji 立绘 */}
            <div className="text-[140px] drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] animate-[popIn_0.3s_ease-out]">
                {avatar || "👤"} 
            </div>
            
            {/* 悬浮在底部的名字标签 */}
            <div className="mt-4 rounded-xl bg-black/80 px-8 py-2 border border-white/20 text-center text-xl font-bold text-amber-500 shadow-2xl backdrop-blur-sm">
                {label}
            </div>
        </div>
    );
}