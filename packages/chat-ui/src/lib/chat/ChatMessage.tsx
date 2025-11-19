// path: packages/chat-ui/src/lib/chat/ChatMessage.tsx

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Loader2, Check } from 'lucide-react';
import { ChatMessageProps } from './types.js';
import { ChatBotLogo } from '../ui/ChatBotLogo';

function ChatMessage(props: ChatMessageProps) {
    const isUser = props.role === 'user';
    const isBotLoading = props.isLoading && !isUser;
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (props.onCopy) props.onCopy();
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
    };

    return (
        <div className={isUser ? 'flex justify-end p-2' : 'flex justify-start p-2'}>
            {!isUser && (
                <div className="flex-shrink-0 mr-3">
                    <ChatBotLogo size={24} className="text-blue" />
                </div>
            )}

            <div className="max-w-[85%]">
                <div
                    className={`
                        px-4 py-2 rounded-2xl
                        overflow-hidden
                        whitespace-pre-wrap
                        break-words
                        ${isUser ? 'bg-blue text-whiteSoft' : 'bg-whiteSoft text-black'}
                    `}
                    style={{ overflowWrap: 'anywhere', wordBreak: 'normal' }}
                >
                    <div className="text-sm">
                        {isBotLoading ? (
                            <Loader2 size={20} className="animate-spin text-blue" />
                        ) : (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {props.content}
                            </ReactMarkdown>
                        )}
                    </div>
                </div>

                {!isBotLoading && (
                    <div className={`flex gap-2 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <button
                            onClick={handleCopy}
                            className="p-1 hover:text-white text-mediumGray"
                            aria-label="Copy message"
                        >
                            {isCopied ? (
                                <Check size={16} className="text-green-500" />
                            ) : (
                                <Copy size={16} />
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export { ChatMessage };
