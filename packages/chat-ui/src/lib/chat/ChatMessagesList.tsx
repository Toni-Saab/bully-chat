// packages/chat-ui/src/lib/chat/ChatMessagesList.tsx

import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage.js';
import { ChatMessagesListProps } from './types.js';

function ChatMessagesList(props: ChatMessagesListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [props.messages]);

  if (props.isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black text-lightGray min-w-0">
        <p className="text-lg">Loading messages...</p>
      </div>
    );
  }

  if (props.messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black text-lightGray min-w-0">
        <p className="text-lg">Start a new conversation!</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 bg-black min-h-0 min-w-0"
    >
      <div className="flex flex-col justify-end gap-4 min-h-full">
        {props.messages.map((message) => (
          <ChatMessage
            key={message.id}
            id={message.id}
            content={message.content}
            role={message.role}
            isLoading={message.isLoading}
            onCopy={message.onCopy}
            onEdit={message.onEdit}
          />
        ))}
      </div>
    </div>
  );
}

export { ChatMessagesList };