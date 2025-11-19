// packages/chat-ui/src/lib/chat/ChatInputContainer.tsx

import { useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { ChatInputProps } from './types.js';

function ChatInputContainer(props: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const minHeight = 44;
  const maxHeight = 120;

  const hasValue = props.value.trim().length > 0;
  const isActive = hasValue && !props.isDisabled;

  useEffect(() => {
    adjustHeight();
  }, [props.value]);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = 'auto';
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${Math.max(minHeight, newHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustHeight();
    props.onChange(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isActive) props.onSend();
    }
  };

  return (
    <div className="p-4 bg-black w-full box-border">
      <div className="flex items-center bg-darkGray rounded-2xl gap-2 w-full max-w-full box-border">

        <textarea
          ref={textareaRef}
          value={props.value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={props.placeholder}
          rows={1}
          className="
            flex-1 
            resize-none 
            bg-transparent 
            text-whiteSoft 
            pl-6 pr-4
            py-4
            leading-6
            focus:outline-none 
            placeholder-mediumGray 
            min-w-0 
            max-w-full 
            whitespace-pre-wrap
            text-base
            box-border
          "
          style={{
            minHeight: `${minHeight}px`,
            maxHeight: `${maxHeight}px`,
          }}
        />

        <button
          onClick={props.onSend}
          disabled={!isActive}
          className={`
            flex-shrink-0 
            w-11 h-11 
            rounded-2xl
            flex items-center justify-center 
            transition-all 
            mr-1
            ${isActive ? 'bg-blue hover:bg-blue/90' : 'bg-mediumGray opacity-50'}
          `}
        >
          <ArrowUp size={20} className="text-white" />
        </button>

      </div>
    </div>
  );
}

export { ChatInputContainer };