// path: apps/chat-assistant/src/app/chat/[id]/page.tsx

'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useChatStore } from '@event-bot/store';
import type { Message } from '@event-bot/data-access';

type ExtendedMessage = Message & {
    isLoading?: boolean;
};

const DynamicChatWindow = dynamic(
    () => import('@event-bot/chat-ui').then(mod => mod.ChatWindow),
    { ssr: false }
);

const ChatDetailPage = () => {
    const { activeChat, messages, isMessagesLoading, sendMessage } = useChatStore();
    const [input, setInput] = useState('');

    if (!activeChat) {
        return (
            <div className="flex items-center justify-center h-full bg-black text-white">
                Loading chat...
            </div>
        );
    }

    const handleSend = () => {
        const text = input.trim();
        if (!text) return;
        sendMessage(text, 'user');
        setInput('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const toMessageRole = (role: string): 'user' | 'assistant' => {
        return role === 'user' ? 'user' : 'assistant';
    };

    const formattedMessages = messages.map((msg: ExtendedMessage) => ({
        id: msg.id,
        content: msg.content,
        role: toMessageRole(msg.role),
        isLoading: !!msg.isLoading,
        onCopy: () => navigator.clipboard.writeText(msg.content),
    }));

    const isEmpty = messages.length === 0;
    const isInputDisabled = isMessagesLoading;

    return (
        <div className="h-screen flex flex-col">
            <DynamicChatWindow
                title={activeChat.title || 'New chat'}
                messages={formattedMessages}
                isInitialLoading={isMessagesLoading}
                isEmpty={isEmpty}
                inputValue={input}
                onInputChange={handleInputChange}
                onSend={handleSend}
                isInputDisabled={isInputDisabled}
                placeholder="Message..."
            />
        </div>
    );
};

export default ChatDetailPage;
