// apps/chat-assistant/src/app/page.tsx
'use client'

import { useUserStore } from '@event-bot/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      Loading...
    </div>
)};

function HomePage() {
  const { isLoading, isLoggedIn } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return; 
    }

    if (isLoggedIn) {
      router.replace('/chat');
    } else {
      router.replace('/start');
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return <LoadingFallback />;
  }

  return <LoadingFallback />;
}

export default HomePage;