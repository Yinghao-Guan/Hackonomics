// src/app/components/Villager
"use client";

import React, { useState, useEffect, useRef } from 'react';

export type VillagerRole = 'worker' | 'elder' | 'kid';
export type VillagerStatus = 'normal' | 'starving' | 'dead';

type Props = {
  role?: VillagerRole;
  status?: VillagerStatus;
};

const WanderingVillager = ({ role = 'worker', status = 'normal' }: Props) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [transition, setTransition] = useState('none');
  const [facingRight, setFacingRight] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const startNewWalk = () => {
      // 核心逻辑：如果死了或者饿倒了，就原地躺平，不要再乱走了！
      if (status === 'dead' || status === 'starving') return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const offset = 100;

      const startEdge = Math.floor(Math.random() * 4);
      let startX = 0, startY = 0;
      if (startEdge === 0) { startX = Math.random() * w; startY = -offset; }
      else if (startEdge === 1) { startX = w + offset; startY = Math.random() * h; }
      else if (startEdge === 2) { startX = Math.random() * w; startY = h + offset; }
      else { startX = -offset; startY = Math.random() * h; }

      let endEdge = Math.floor(Math.random() * 3);
      if (endEdge >= startEdge) endEdge++;
      
      let endX = 0, endY = 0;
      if (endEdge === 0) { endX = Math.random() * w; endY = -offset; }
      else if (endEdge === 1) { endX = w + offset; endY = Math.random() * h; }
      else if (endEdge === 2) { endX = Math.random() * w; endY = h + offset; }
      else { endX = -offset; endY = Math.random() * h; }

      const distance = Math.hypot(endX - startX, endY - startY);
      
      // 根据角色调整速度：小孩跑得快，老人走得慢
      let baseSpeed = 60;
      if (role === 'kid') baseSpeed = 100;
      if (role === 'elder') baseSpeed = 40;
      const speed = baseSpeed + Math.random() * 30; 
      
      const duration = distance / speed;

      setTransition('none'); 
      setPos({ x: startX, y: startY });
      setFacingRight(endX > startX);
      setIsVisible(true);

      timerRef.current = setTimeout(() => {
        // 如果在走的过程中突然饿了或死了，立刻停止！
        if (status !== 'normal') return; 

        setTransition(`transform ${duration}s linear`);
        setPos({ x: endX, y: endY });

        timerRef.current = setTimeout(() => {
          setIsVisible(false);
          timerRef.current = setTimeout(startNewWalk, Math.random() * 1500 + 500);
        }, duration * 1000);
      }, 50);
    };

    // 状态改变时，如果恢复 normal，重新开始走；如果是死亡/挨饿，清空定时器
    if (status === 'normal') {
      timerRef.current = setTimeout(startNewWalk, Math.random() * 3000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [status, role]); // 监听 status 变化

  // 根据身份决定外观大小
  const sizes = {
    worker: { head: 16, bodyW: 20, bodyH: 24, color: '#151414' },
    elder: { head: 14, bodyW: 18, bodyH: 20, color: '#323030' }, // 老人灰一点、矮一点
    kid: { head: 12, bodyW: 14, bodyH: 16, color: '#111010' },   // 小孩小一点
  };
  const visual = sizes[role];

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        opacity: isVisible ? (status === 'dead' ? 0.3 : 1) : 0, // 死亡后变成半透明尸体
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: transition,
        pointerEvents: 'none',
        zIndex: status === 'dead' ? 1 : 9999, // 尸体垫底，活人在上面走
      }}
    >
      <div style={{ 
        transform: `scaleX(${facingRight ? 1 : -1}) ${status !== 'normal' ? 'rotate(90deg) translateY(10px)' : ''}`, // 挨饿和死亡时原地躺下 (旋转90度)
        transition: 'transform 0.5s ease' // 倒下时的动画过渡
      }}>
        <div
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            // 只有 normal 状态才有活蹦乱跳的动画
            animation: status === 'normal' ? 'villagerBounce 0.35s infinite alternate ease-in-out' : 'none',
          }}
        >
          {/* 小人的死鱼眼特效 */}
          <div style={{ 
            width: `${visual.head}px`, height: `${visual.head}px`, 
            backgroundColor: status === 'dead' ? '#ef4444' : visual.color, // 死后头变成红色
            borderRadius: '50%', position: 'relative'
          }}>
             {status === 'dead' && <span style={{position:'absolute', top:'-2px', left:'2px', fontSize:'8px', color:'white', fontWeight:'bold'}}>×</span>}
          </div>
          <div style={{ width: `${visual.bodyW}px`, height: `${visual.bodyH}px`, backgroundColor: status === 'dead' ? '#999' : visual.color, borderRadius: '4px', marginTop: '2px' }} />
        </div>
      </div>
    </div>
  );
};

export default WanderingVillager;