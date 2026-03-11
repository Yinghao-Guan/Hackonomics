// src/app/page.tsx
import Link from "next/link";
import WanderingVillager from '@/components/Villager';

export default function Home() {
  return (
      <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
          <div>
            <div className="text-sm text-white/60">Hackathon MVP</div>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">Village Economy</h1>
            <p className="mt-4 text-white/70">
              一个叙事驱动的经济学选择游戏（占位UI版）。你醒来时，村子已经快撑不下去了。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
                href="/game"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
            >
              Start / Continue
            </Link>
            <Link
                href="/game?reset=1"
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm text-white/80 hover:bg-white/10"
            >
              Reset Save
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            <div className="font-semibold text-white">Demo Tips</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>选项会记录 A/B/C，并解锁成就。</li>
              <li>右上角可打开“事件日志”。</li>
              <li>存档使用 localStorage（浏览器刷新不会丢）。</li>
            </ul>
          </div>
        </div>
        <WanderingVillager />
        <WanderingVillager />
        <WanderingVillager />
        <WanderingVillager />
        <WanderingVillager />
        <WanderingVillager />
        <WanderingVillager />
        <WanderingVillager />
        <WanderingVillager />
      </main>
  );
}
