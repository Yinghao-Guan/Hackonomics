// src/app/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import WanderingVillager from '@/components/Villager';

// 定义剧本的数据结构
type SceneNode = {
  type: "narration" | "dialogue" | "choice" | "achievement" | "title";
  speaker?: string;
  text?: string;
  avatar?: string;
  bg: "black" | "room";
  choices?: string[];
};

// 完整的 RPG 剧本流
const SCRIPT: SceneNode[] = [
  { type: "narration", text: "你在一个陌生的房间醒来，四周一片漆黑...", bg: "black" },
  { type: "dialogue", speaker: "大妈一", text: "昨天不是还好好的？", avatar: "👵", bg: "black" },
  { type: "dialogue", speaker: "大妈二", text: "可不是嘛。", avatar: "🧓", bg: "black" },
  { type: "dialogue", speaker: "大妈三", text: "会不会...脑子坏了？", avatar: "👵", bg: "black" },
  { type: "narration", text: "（慢慢睁开眼睛，画面亮起，一头驴的大脸出现在你面前）", avatar: "🐴", bg: "room" },
  { type: "narration", text: "两秒后，他开口说话了。", avatar: "🐴", bg: "room" },
  { type: "dialogue", speaker: "他", text: "（叹了口气）你终于醒了。", avatar: "🐴", bg: "room" },
  { type: "narration", text: "（画面继续变暗，你缓缓闭上了眼睛）", bg: "black" },
  { type: "narration", text: "“这是哪里？我是不是吃坏东西了？不对！驴怎么会说话！”", bg: "black" },
  { type: "narration", text: "（你又睁开了眼睛，那头驴还在静静看着你）", avatar: "🐴", bg: "room" },
  
  // 玩家选项：类似星铁/原神的对话泡泡
  { type: "choice", choices: ["你..刚刚是说话了？"], avatar: "🐴", bg: "room" },
  // 玩家说出台词
  { type: "dialogue", speaker: "你", text: "你..刚刚是说话了？", avatar: "👤", bg: "room" },
  
  { type: "dialogue", speaker: "驴", text: "比起这个，你还是关心下自己在哪吧。", avatar: "🐴", bg: "room" },
  { type: "dialogue", speaker: "大妈一", text: "（小声）他又开始自言自语了。", avatar: "👵", bg: "room" },
  { type: "dialogue", speaker: "大妈三", text: "我就说吧，脑子坏了。", avatar: "👵", bg: "room" },
  { type: "dialogue", speaker: "大妈二", text: "那还当不当村长了？", avatar: "🧓", bg: "room" },
  
  // 玩家选项
  { type: "choice", choices: ["一愣：“村长？” 你看向驴问：“她们....在说什么？”"], avatar: "🐴", bg: "room" },
  { type: "dialogue", speaker: "你", text: "一愣：“村长？” 你看向驴问：“她们....在说什么？”", avatar: "👤", bg: "room" },
  
  { type: "dialogue", speaker: "驴", text: "简单来说，这个村子快撑不下去了，这里的人连最简单的算术都算不明白...", avatar: "🐴", bg: "room" },
  { type: "dialogue", speaker: "驴", text: "而你这个外来者便成了他们的希望，他们在讨论让你当村长。", avatar: "🐴", bg: "room" },
  
  { type: "achievement", text: "关于我转生后变成村长这件事", bg: "room" },
  { type: "title", bg: "room" }
];

export default function Home() {
  const [step, setStep] = useState(0);

  const currentNode = SCRIPT[step];
  const isFinished = step >= SCRIPT.length - 1;

  // 点击屏幕推进剧情
  const handleScreenClick = () => {
    if (isFinished) return;
    // 如果当前是“玩家选项”节点，禁止点击屏幕背景推进，必须点选项泡泡
    if (currentNode.type === "choice") return;
    
    setStep(step + 1);
  };

  // 玩家点击对话泡泡
  const handleChoiceClick = () => {
    setStep(step + 1);
  };

  return (
    <main 
      className="relative min-h-screen w-full overflow-hidden bg-black text-white"
      onClick={handleScreenClick}
    >
      {/* 动态背景层：黑屏 或 木屋房间 */}
      <div 
        className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out z-0 bg-cover bg-center ${
          currentNode.bg === "room" ? "opacity-40" : "opacity-0"
        }`}
        style={{ 
          // 找了一张很有质感的木屋内部的图作为占位背景
          backgroundImage: "url('/room.png')" 
        }}
      />
      
      {/* 渐变遮罩，让底部的对话框文字更清晰 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0" />

      {/* --- 立绘 / 头像层 --- */}
      {currentNode.avatar && currentNode.type !== "title" && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none pb-20">
          <div className="text-[120px] md:text-[160px] animate-[popIn_0.3s_ease-out,float_4s_ease-in-out_infinite] drop-shadow-2xl">
            {currentNode.avatar}
          </div>
        </div>
      )}

      {/* --- UI 交互层 --- */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end">
        
        {/* 1. 旁白 (Narration) */}
        {currentNode.type === "narration" && (
          <div className="w-full flex-1 flex items-center justify-center p-8">
            <p className="text-xl md:text-2xl text-zinc-300 italic text-center leading-relaxed animate-[fadeIn_1s_ease-in]">
              {currentNode.text}
            </p>
          </div>
        )}

        {/* 2. 原神/星铁风格：玩家对话选项泡泡 (Choice) */}
        {currentNode.type === "choice" && (
          <div className="absolute right-8 md:right-24 top-1/2 -translate-y-1/2 flex flex-col gap-4 w-[80%] max-w-sm">
            {currentNode.choices?.map((choiceText, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation(); // 阻止事件冒泡到父级背景
                  handleChoiceClick();
                }}
                className="group relative text-left bg-zinc-900/80 hover:bg-white border border-zinc-600 hover:border-white backdrop-blur-md px-6 py-4 rounded-tl-2xl rounded-bl-2xl rounded-tr-sm rounded-br-2xl shadow-lg transition-all duration-300 animate-[slideInRight_0.4s_ease-out]"
              >
                <div className="text-zinc-300 group-hover:text-black font-medium text-lg pr-6">
                  {choiceText}
                </div>
                {/* 选项右侧的小箭头指示器 */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 group-hover:text-black opacity-0 group-hover:opacity-100 transition-opacity">
                  ▶
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 3. 底部对话框 (Dialogue) */}
        {(currentNode.type === "dialogue" || (currentNode.type === "choice" && step > 0 && SCRIPT[step-1].type === "dialogue")) && (
          <div className="w-full max-w-4xl px-4 pb-8 md:pb-12 animate-[slideUp_0.3s_ease-out]">
            {/* 名字标签 */}
            {currentNode.speaker && (
              <div className="inline-block bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-2 rounded-t-xl text-black font-bold text-lg md:text-xl shadow-md border border-b-0 border-amber-400/50">
                {currentNode.speaker}
              </div>
            )}
            {/* 文本框 */}
            <div className="bg-zinc-900/90 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-b-xl rounded-tr-xl min-h-[140px] shadow-2xl relative">
              <p className="text-lg md:text-xl text-white/95 leading-relaxed">
                {currentNode.text || (currentNode.type === "choice" ? SCRIPT[step-1].text : "")}
              </p>
              
              {/* 闪烁的继续小光标 (仅在非选择状态下显示) */}
              {currentNode.type !== "choice" && (
                <div className="absolute bottom-4 right-6 text-amber-500 animate-pulse text-2xl">
                  ▼
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. 成就弹窗 (Achievement) */}
        {currentNode.type === "achievement" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 w-full">
            <div className="max-w-md w-full rounded-2xl border border-yellow-500/50 bg-black/60 p-6 shadow-[0_0_40px_rgba(234,179,8,0.2)] backdrop-blur-md animate-[bounceIn_0.6s_ease-out]">
              <div className="flex items-center gap-6">
                <div className="text-5xl drop-shadow-lg">🏆</div>
                <div>
                  <div className="text-sm text-yellow-500/80 font-bold uppercase tracking-widest mb-1">Achievement Unlocked</div>
                  <div className="text-xl text-yellow-400 font-bold">{currentNode.text}</div>
                </div>
              </div>
            </div>
            <p className="mt-12 text-zinc-500 animate-pulse">(点击了解真相)</p>
          </div>
        )}

        {/* 5. 最终游戏菜单 (Title Screen) */}
        {currentNode.type === "title" && (
          <div className="flex-1 flex flex-col items-center justify-center w-full bg-black/40 backdrop-blur-sm animate-[fadeIn_1s_ease-in]">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
              Village Economy
            </h1>
            <p className="text-xl text-zinc-400 italic mb-16 tracking-wide drop-shadow-md">
              "You didn't wake up to rule, you woke up to decide."
            </p>

            <div className="flex flex-wrap justify-center gap-6 relative z-50">
              <Link
                href="/game"
                className="group relative overflow-hidden rounded-xl bg-white px-10 py-4 text-lg font-bold text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                <span className="relative z-10">接受任命 (Start Game)</span>
                {/* 按钮光泽扫过动画 */}
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-40 group-hover:animate-[shimmer_1s_infinite]" />
              </Link>
              <Link
                href="/game?reset=1"
                className="rounded-xl border border-white/20 bg-black/50 px-10 py-4 text-lg font-medium text-white/80 backdrop-blur-md hover:bg-white/10 hover:border-white/40 transition-all"
              >
                清除记忆 (Reset Save)
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 最终画面出现刁民 */}
      {currentNode.type === "title" && (
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <WanderingVillager />
          <WanderingVillager />
          <WanderingVillager />
        </div>
      )}

      {/* 全局动画定义 */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes popIn {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.9); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </main>
  );
}