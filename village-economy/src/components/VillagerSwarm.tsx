// app/components/VillagerSwarm
"use client";

import React, { useMemo } from 'react';
import WanderingVillager, { VillagerRole, VillagerStatus } from './Villager';

type Props = {
  currentNodeId: string;
  population: number;
};

export default function VillagerSwarm({ currentNodeId, population }: Props) {
  // 1. 初始化 20 个村民的身份结构 (12 worker, 4 elder, 4 kid)
  const villagersList = useMemo(() => {
    const list: VillagerRole[] = [];
    for (let i = 0; i < 12; i++) list.push('worker');
    for (let i = 0; i < 4; i++) list.push('elder');
    for (let i = 0; i < 4; i++) list.push('kid');
    return list;
  }, []);

  // 2. 导演的调度逻辑：根据游戏状态赋予他们表现
  return (
    <>
      {villagersList.map((role, index) => {
        let status: VillagerStatus = 'normal';

        // 【剧情表现 A】：当进入事件一时，如果粮食不够，老人和小孩饿得倒地不起
        const isEvent1Starving = currentNodeId.startsWith('event1_') && currentNodeId !== 'event1_ending';
        if (isEvent1Starving && (role === 'elder' || role === 'kid')) {
          status = 'starving';
        }

        // 【剧情表现 B】：当人口减少时，强制按顺序让脆弱群体死亡
        // 如果人口少于 20，差额部分就是死亡人数 (这里假设前几个就是脆弱人口)
        const deadCount = 20 - population;
        // 我们把 index 最后的几个(刚好是小孩和老人)判定为死亡
        if (index >= 20 - deadCount) {
          status = 'dead';
        }

        return <WanderingVillager key={index} role={role} status={status} />;
      })}
    </>
  );
}