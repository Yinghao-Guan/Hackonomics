// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import VillagerSwarm from '@/components/VillagerSwarm';

// 定义剧本的数据结构 (新增 description 字段用来显示成就介绍)
type SceneNode = {
  type: "narration" | "dialogue" | "choice" | "achievement" | "title" | "title_secret";
  speaker?: string;
  text?: string;
  description?: string; 
  avatar?: string;
  bg: "black" | "room" | "wheat";
  choices?: string[];
  autoPlayDuration?: number;
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
  { type: "choice", choices: ["村长？ 她们....在说什么？"], avatar: "🐴", bg: "room" },
  { type: "dialogue", speaker: "你", text: "你一愣：“村长？” 你看向驴问：“她们....在说什么？”", avatar: "👤", bg: "room" },
  
  { type: "dialogue", speaker: "驴", text: "简单来说，这个村子快撑不下去了，这里的人连最简单的算术都算不明白...", avatar: "🐴", bg: "room" },
  { type: "dialogue", speaker: "驴", text: "而你这个外来者便成了他们的希望，他们在讨论让你当村长。", avatar: "🐴", bg: "room" },
  
  { type: "achievement", text: "关于我转生后变成村长这件事", description: "在不知情的情况下，接手了一个即将崩溃的微型宏观经济体。", bg: "room" },
  
  // 索引 21: 正常的标题界面
  { type: "title", bg: "room" },

  // ---------------------------------------------------------
  // 索引 22 开始: 隐藏结局【平庸之赐】 (点击清除记忆后触发)
  // ---------------------------------------------------------
  { type: "narration", text: "记忆被抽离的那一刻，你第一次感到轻松。不是胜利的轻松，而是——不再需要选择的轻松。", bg: "black", autoPlayDuration: 5000 },

// { type: "narration", text: "The moment your memories are taken away, you feel something unfamiliar. Not relief from victory — but relief from no longer having to choose.", bg: "black", autoPlayDuration: 5000 },

  { type: "narration", text: "你不再需要在饥饿与公平之间权衡，不再需要为看不见的未来负责。", bg: "black", autoPlayDuration: 5000 },

// { type: "narration", text: "No more weighing hunger against fairness. No more answering to a future you cannot see.", bg: "black", autoPlayDuration: 5000 },

  { type: "narration", text: "你成为了他们中的一员。一个不需要理解世界如何运作的人。", bg: "black", autoPlayDuration: 5000 },

// { type: "narration", text: "You become one of them — someone who no longer needs to understand how the world works.", bg: "black", autoPlayDuration: 5000 },

  { type: "narration", text: "日出而作，日落而息。你的世界，不再是一个系统，而是一片土地。", bg: "black", autoPlayDuration: 5000 },

// { type: "narration", text: "You rise with the sun, and rest with it. The world is no longer a system — just a piece of land beneath your feet.", bg: "black", autoPlayDuration: 5000 },

  { type: "dialogue", speaker: "流浪商人", text: "现在的 CPI 太高了！边际效用已经失效了！你们这些人根本不懂什么叫宏观经济！", avatar: "🐪", bg: "black" },

// { type: "dialogue", speaker: "Wandering Merchant", text: "Inflation is out of control! Marginal utility has collapsed! You people don’t even understand macroeconomics!", avatar: "🐪", bg: "black" },

  { type: "narration", text: "你不懂。你也不想懂。", bg: "black", autoPlayDuration: 5000 },

// { type: "narration", text: "You hear the words — but they no longer land on you.", bg: "black", autoPlayDuration: 5000 },

  { type: "narration", text: "你看着自己长满老茧的手，只知道今年的麦子长势喜人，晚上能给孩子多熬一碗糊糊。", bg: "black", autoPlayDuration: 5000 },

// { type: "narration", text: "You look at the calluses on your hands. The soil is damp. The wheat is growing. That is enough.", bg: "black", autoPlayDuration: 5000 },

  { type: "narration", text: "你成家，生子，在柴米油盐的琐碎中，慢慢老去。", bg: "black", autoPlayDuration: 5000 },

  { type: "narration", text: "你不再试图解释世界。你只是活在其中。", bg: "black", autoPlayDuration: 5000 },

// { type: "narration", text: "You no longer try to explain the world. You simply live in it.", bg: "black", autoPlayDuration: 5000 },

  { type: "narration", text: "也许，这就是另一种自由。", bg: "black", autoPlayDuration: 5000 },

// { type: "narration", text: "Perhaps, this is another kind of freedom.", bg: "black", autoPlayDuration: 5000 },

  { type: "narration", text: "正如那句古老的话所说：多有智慧，就多有愁烦。", bg: "black", autoPlayDuration: 5000 },

// { type: "narration", text: "As it is said: with much wisdom comes much sorrow.", bg: "black", autoPlayDuration: 5000 },

  { type: "narration", text: "而你，选择了一种不需要被证明的生活。", bg: "wheat", autoPlayDuration: 5000 },

// { type: "narration", text: "And you chose a life that does not need to be justified.", bg: "wheat", autoPlayDuration: 5000 },

// 👇 演出高潮
  { type: "achievement", text: "平庸之赐 (The Gift of Being Unremarkable)", description: "你放弃了理解与控制世界的权力。在一个由选择构成的世界里，你选择了不再选择。", bg: "wheat" },

// { type: "achievement", text: "The Gift of Being Unremarkable", description: "You gave up the power to understand and shape the world. In a system built on choices, you chose to stop choosing.", bg: "wheat" },
  { type: "title_secret", bg: "wheat" }
];

export default function Home() {
  const [step, setStep] = useState(0);

  const currentNode = SCRIPT[step];
  const isFinished = step >= SCRIPT.length - 1;

  // 如果当前节点存在 autoPlayDuration，自动倒计时并推进
  useEffect(() => {
    if (currentNode.autoPlayDuration) {
      const timer = setTimeout(() => {
        if (!isFinished) setStep(s => s + 1);
      }, currentNode.autoPlayDuration);
      return () => clearTimeout(timer); // 清除计时器防止内存泄漏
    }
  }, [step, currentNode, isFinished]);

  // 点击屏幕推进剧情
  const handleScreenClick = () => {
    if (isFinished) return;
    // 如果是选项、正常标题或隐藏结局标题，禁止点击屏幕背景推进
    if (currentNode.type === "choice" || currentNode.type === "title" || currentNode.type === "title_secret") return;
    if (currentNode.autoPlayDuration) return;
    
    setStep(step + 1);
  };

  // 玩家点击对话泡泡
  const handleChoiceClick = () => {
    setStep(step + 1);
  };

  // 触发隐藏结局 (清除记忆)
  const triggerSecretEnding = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 彻底清除存档
    localStorage.removeItem("village_economy_save_v1");
    // 跳转到隐藏剧情的起始索引 (当前在 21，+1 就是 22)
    setStep(step + 1);
  };

  // 重新轮回 (真的重新开始)
  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 确保存档再次被清空
    localStorage.removeItem("village_economy_save_v1");
    // 🌟 核心修改：真的重新开始，回到剧情第 0 步
    setStep(0);
  };

  // 动态获取背景图片
  const getBackgroundImage = () => {
    if (currentNode.bg === "room") return "url('/room.png')";
    if (currentNode.bg === "wheat") return "url('/wheat.png')"; 
    return "none";
  };

  return (
    <main 
      className="relative min-h-screen w-full overflow-hidden bg-black text-white"
      onClick={handleScreenClick}
    >
      {/* 动态背景层：黑屏 / 木屋 / 夕阳麦田 */}
      <div 
        className={`absolute inset-0 transition-all duration-[3000ms] ease-in-out z-0 bg-cover bg-center ${
          // 将非黑屏背景的亮度 (Opacity) 从 50% 拉高到 90%，让麦田和房间都变得雪亮刺眼
          currentNode.bg !== "black" ? "opacity-90 blur-none scale-100" : "opacity-0 blur-sm scale-105"
        }`}
        style={{ backgroundImage: getBackgroundImage() }}
      />
      
      {/* 渐变遮罩 */}
      <div className={`absolute inset-0 transition-opacity duration-[3000ms] bg-gradient-to-t from-black via-black/40 to-transparent z-0 ${
          // 麦田场景下，遮罩变淡 (opacity-40)，不阻挡阳光
          currentNode.bg === "wheat" ? "opacity-40" : "opacity-100"
      }`} />

      {/* --- 立绘 / 头像层 --- */}
      {currentNode.avatar && currentNode.type !== "title" && currentNode.type !== "title_secret" && (
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
            <p className="text-xl md:text-2xl text-zinc-300 italic text-center leading-relaxed animate-[fadeIn_1.5s_ease-in]">
              {currentNode.text}
            </p>
          </div>
        )}

        {/* 2. 玩家对话选项泡泡 (Choice) */}
        {currentNode.type === "choice" && (
          <div className="absolute right-8 md:right-24 top-1/2 -translate-y-1/2 flex flex-col gap-4 w-[80%] max-w-sm">
            {currentNode.choices?.map((choiceText, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChoiceClick();
                }}
                className="group relative text-left bg-zinc-900/80 hover:bg-white border border-zinc-600 hover:border-white backdrop-blur-md px-6 py-4 rounded-tl-2xl rounded-bl-2xl rounded-tr-sm rounded-br-2xl shadow-lg transition-all duration-300 animate-[slideInRight_0.4s_ease-out]"
              >
                <div className="text-zinc-300 group-hover:text-black font-medium text-lg pr-6">
                  {choiceText}
                </div>
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
            {currentNode.speaker && (
              <div className="inline-block bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-2 rounded-t-xl text-black font-bold text-lg md:text-xl shadow-md border border-b-0 border-amber-400/50">
                {currentNode.speaker}
              </div>
            )}
            <div className="bg-zinc-900/90 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-b-xl rounded-tr-xl min-h-[140px] shadow-2xl relative">
              <p className="text-lg md:text-xl text-white/95 leading-relaxed">
                {currentNode.text || (currentNode.type === "choice" ? SCRIPT[step-1].text : "")}
              </p>
              {currentNode.type !== "choice" && (
                <div className="absolute bottom-4 right-6 text-amber-500 animate-pulse text-2xl">▼</div>
              )}
            </div>
          </div>
        )}

        {/* 4. 成就弹窗 (Achievement) */}
        {currentNode.type === "achievement" && (
          <div className="flex-1 flex flex-col items-center justify-start p-8 pt-[5vh] w-full animate-[fadeIn_2s_ease-in]">
            <div className="max-w-lg w-full rounded-2xl border border-yellow-500/50 bg-black/30 p-6 shadow-[0_0_60px_rgba(234,179,8,0.2)] backdrop-blur-xl animate-[bounceIn_1s_ease-out]">
              <div className="flex items-start gap-6">
                <div className="text-5xl drop-shadow-lg mt-2">🏆</div>
                <div className="flex-1">
                  <div className="text-sm text-yellow-500/80 font-bold uppercase tracking-widest mb-1">Achievement Unlocked</div>
                  <div className="text-2xl text-yellow-400 font-bold mb-2">{currentNode.text}</div>
                  {currentNode.description && (
                    <div className="text-sm text-zinc-300 leading-relaxed border-t border-yellow-500/30 pt-3 mt-2 font-serif">
                        {currentNode.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="mt-12 text-zinc-200 animate-pulse">(点击进入结局)</p>
          </div>
        )}

        {/* 5. 正常的最终游戏菜单 (Title Screen) */}
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
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-40 group-hover:animate-[shimmer_1s_infinite]" />
              </Link>
              
              <button
                onClick={triggerSecretEnding}
                className="rounded-xl border border-white/20 bg-black/50 px-10 py-4 text-lg font-medium text-white/80 backdrop-blur-md hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer"
              >
                清除记忆 (Reset Save)
              </button>
            </div>
          </div>
        )}

        {/* 6. 隐藏/坏结局最终画面 (Dynamic Ending Title) */}
        {currentNode.type === "title_secret" && (
          <div className="flex-1 flex flex-col items-center justify-center w-full bg-black animate-[fadeIn_3s_ease-in]">
            <h1 className="text-4xl md:text-6xl font-serif tracking-widest text-white mb-6 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
              {currentNode.speaker || "【结局：平庸之赐】"}
            </h1>
            <p className="text-xl text-zinc-300 italic mb-16 tracking-widest drop-shadow-md">
              {currentNode.text || "Ignorance is Bliss."}
            </p>
            <button
              onClick={handleRestart}
              className="group relative overflow-hidden rounded-xl border border-white/20 bg-black/60 backdrop-blur-md px-10 py-4 text-lg font-medium text-white/80 transition-all hover:bg-white/20 hover:text-white cursor-pointer"
            >
              <span className="relative z-10">重新轮回 (Restart)</span>
            </button>
          </div>
        )}
      </div>

      {currentNode.type === "title" && (
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <VillagerSwarm currentNodeId="title" population={20} />
        </div>
      )}

      {/* 全局动画定义 */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes popIn { 0% { transform: scale(0.8) translateY(20px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounceIn { 0% { transform: scale(0.9); opacity: 0; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}} />
    </main>
  );
}