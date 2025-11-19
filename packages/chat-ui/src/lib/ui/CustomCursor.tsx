// event-bot/packages/src/lib/ui/CustomCursor.tsx

'use client'

import React, { useEffect, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Проверяем, поддерживает ли устройство hover/мышь
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (isTouchDevice) {
        return;
    }

    const onMouseMove = (event: MouseEvent) => {
      if (cursorRef.current) {
        // Устанавливаем положение курсора
        cursorRef.current.style.left = `${event.clientX}px`;
        cursorRef.current.style.top = `${event.clientY}px`;
      }
    };

    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // Рендерим элемент с классом, который мы стилизовали в global.css
  return <div ref={cursorRef} className="custom-cursor" />;
};

export {CustomCursor};