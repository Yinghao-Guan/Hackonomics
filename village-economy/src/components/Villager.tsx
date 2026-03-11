"use client";

import React, { useState, useEffect, useRef } from 'react';

const WanderingVillager = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [transition, setTransition] = useState('none');
  const [facingRight, setFacingRight] = useState(true);
  const [isVisible, setIsVisible] = useState(false); // 控制刷新时的闪烁

  // 使用 useRef 存储定时器，方便组件卸载时清理
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const startNewWalk = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const offset = 100; // 藏在屏幕外 100px 的距离

      // 1. 随机挑选一个起始边缘 (0: 上, 1: 右, 2: 下, 3: 左)
      const startEdge = Math.floor(Math.random() * 4);
      let startX = 0, startY = 0;
      
      if (startEdge === 0) { startX = Math.random() * w; startY = -offset; }
      else if (startEdge === 1) { startX = w + offset; startY = Math.random() * h; }
      else if (startEdge === 2) { startX = Math.random() * w; startY = h + offset; }
      else { startX = -offset; startY = Math.random() * h; }

      // 2. 随机挑选一个结束边缘（必须和起始边缘不同）
      let endEdge = Math.floor(Math.random() * 3);
      if (endEdge >= startEdge) endEdge++; // 巧妙的算法，确保起始和终点不在同一边
      
      let endX = 0, endY = 0;
      if (endEdge === 0) { endX = Math.random() * w; endY = -offset; }
      else if (endEdge === 1) { endX = w + offset; endY = Math.random() * h; }
      else if (endEdge === 2) { endX = Math.random() * w; endY = h + offset; }
      else { endX = -offset; endY = Math.random() * h; }

      // 3. 计算这段路程的距离和时间，确保每个人走路速度看起来差不多
      const distance = Math.hypot(endX - startX, endY - startY);
      const speed = 60 + Math.random() * 70; // 每个人速度不一样，稍微错落一点
      const duration = distance / speed; // 算出需要走多少秒

      // --- 核心魔术步骤 ---

      // 步骤 A：关闭动画，瞬间把小人传送到起点
      setTransition('none'); 
      setPos({ x: startX, y: startY });
      setFacingRight(endX > startX); // 脸朝向终点
      setIsVisible(true);

      // 步骤 B：等待短短的 50 毫秒（让浏览器反应过来已经瞬移了），然后下达走向终点的指令
      timerRef.current = setTimeout(() => {
        setTransition(`transform ${duration}s linear`); // 开启匀速动画
        setPos({ x: endX, y: endY }); // 目标位置

        // 步骤 C：等他走到终点后，休息 0.5 秒到 2 秒，然后重新开始下一轮
        timerRef.current = setTimeout(() => {
          setIsVisible(false); // 走出屏幕后先隐藏
          timerRef.current = setTimeout(startNewWalk, Math.random() * 1500 + 500);
        }, duration * 1000); // 乘以 1000 把秒换成毫秒

      }, 50);
    };

    // 初始时给个随机延迟，这样多个小人不会在同一秒钟同时从屏幕边缘冒出来
    timerRef.current = setTimeout(startNewWalk, Math.random() * 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        opacity: isVisible ? 1 : 0, // 传送时隐藏，走动时显示
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: transition, // 这里动态切换：瞬间移动(none) 还是 平滑走路(linear)
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {/* 负责左右转身的层 */}
      <div style={{ transform: `scaleX(${facingRight ? 1 : -1})` }}>
        
        {/* 负责跳动的层 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animation: 'villagerBounce 0.35s infinite alternate ease-in-out',
          }}
        >
          <style>{`
            @keyframes villagerBounce {
              0% { transform: translateY(0); }
              100% { transform: translateY(-8px); }
            }
          `}</style>
          
          {/* 制造新闻模拟器风格：方块圆头人 */}
          <div style={{ width: '16px', height: '16px', backgroundColor: '#333', borderRadius: '50%' }} />
          <div style={{ width: '20px', height: '24px', backgroundColor: '#333', borderRadius: '4px', marginTop: '2px' }} />
        </div>
      </div>
    </div>
  );
};

export default WanderingVillager;