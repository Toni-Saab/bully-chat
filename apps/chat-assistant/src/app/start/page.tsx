// apps/chat-assistant/src/app/start/page.tsx

'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const StartScreen = dynamic(
  () => import('@event-bot/chat-ui').then((mod) => mod.StartScreen),
  { ssr: false }
);

function StartPage() {
  const router = useRouter();

  function handleStartClick() {
    router.push('/auth/login');
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-whiteSoft text-black">
      <StartScreen onStartClick={handleStartClick} />
    </div>
  );
}

export default StartPage;
