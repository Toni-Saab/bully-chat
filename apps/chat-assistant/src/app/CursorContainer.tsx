'use client'

import dynamic from 'next/dynamic';

const DynamicCustomCursor = dynamic(
  () => import('@event-bot/chat-ui').then((mod) => mod.CustomCursor),
  { ssr: false }
);

export function CursorContainer() {
  return <DynamicCustomCursor />;
}