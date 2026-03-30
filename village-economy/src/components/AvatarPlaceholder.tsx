// src/components/AvatarPlaceholder.tsx
"use client";

interface AvatarPlaceholderProps {
  label?: string; // 备用标签（如人物名字）
  avatar?: string; // 这里现在接受图片的完整路径，例如 "/avatars/prophet.png"
}

export default function AvatarPlaceholder({ label, avatar }: AvatarPlaceholderProps) {
  // 如果没有传入头像路径，则不渲染任何内容
  if (!avatar) return null;

  return (
    <div className="relative animate-[fadeIn_0.5s_ease-out]">
      {/* Genshin 风格的头像底座/外部光晕 
        Genshin-style avatar base/outer glow
      */}
      <div className="absolute inset-0 rounded-full bg-white/5 blur-xl transform scale-110" />

      {/* 头像容器：圆形，带有金色边框和深色背景 
        Avatar container: circular, with gold border and dark background
      */}
      <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-amber-400/70 bg-zinc-900 shadow-[0_0_30px_rgba(251,191,36,0.3)] overflow-hidden">
        {/* 实际图片渲染 
          Actual image rendering
        */}
        <img 
          src={avatar} 
          alt={label || "Character Avatar"} 
          className="w-full h-full object-cover object-center transform scale-105"
          // 如果图片加载失败，可以这里做降级处理，目前保持空白
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        
        {/* 底部的渐变遮罩，让头像底部平滑融入对话框 
          Bottom gradient mask for smooth blending
        */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* 可选：在头像下方显示名字（如果需要）
        Optional: Display name below avatar (if needed)
      */}
      {/* {label && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
          {label}
        </div>
      )} */}
    </div>
  );
}