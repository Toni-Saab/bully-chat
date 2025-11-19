// apps/chat-assistant/src/app/providers.tsx
'use client';

import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from '@event-bot/data-access';
import type { ReactNode } from 'react';
import { useUserStore } from '@event-bot/store';
import { useEffect } from 'react';


function Providers({ children }: { children: ReactNode }) {
  const checkAuth = useUserStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth(); 
  }, [checkAuth]);
  
  return (
    <ApolloProvider client={apolloClient as any}>
      {children}
    </ApolloProvider>
  );
}

export default Providers;