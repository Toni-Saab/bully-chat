// packages/chat-ui/src/lib/chat/ChatSidebarItem.tsx

import { MessageSquare, MoreHorizontal, Pin } from 'lucide-react';
import { ChatSidebarMenu } from './ChatSidebarMenu.js';
import { Tooltip } from './Tooltip.js';
import { ChatSidebarItemProps } from './types.js';
import { useRef, useState, useEffect } from 'react';

function ChatSidebarItem(props: ChatSidebarItemProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (props.isMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.top + 4,
        left: rect.right - 160,
      });
    } else {
      setMenuPosition(null);
    }
  }, [props.isMenuOpen]);

  const bg = props.isActive ? 'bg-darkGray' : 'hover:bg-darkGray';
  const container = `relative flex items-center justify-between p-3 rounded-lg cursor-pointer ${bg} transition-colors group`;

  return (
    <div className={container} onClick={props.onClick}>
      <div className="flex items-center gap-3 flex-grow min-w-0">
        <div className="text-lightGray flex-shrink-0">
          <MessageSquare size={18} />
        </div>
        <p className="text-whiteSoft text-sm font-medium truncate">
          {props.title}
        </p>
      </div>

      {props.isPinned && (
        <Tooltip content="Pinned">
          <div className="text-lightGray/70 mr-2 flex-shrink-0">
            <Pin size={16} />
          </div>
        </Tooltip>
      )}

      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          props.onMenuOpen();
        }}
        className={`p-1 text-lightGray hover:text-white transition-opacity flex-shrink-0 ${
          props.isActive || props.isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <MoreHorizontal size={20} />
      </button>

      {props.isMenuOpen && menuPosition && (
        <div
          className="fixed z-[1020] pointer-events-auto"
          style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <ChatSidebarMenu
            onRename={props.onRename}
            onPin={props.onPin}
            onDelete={props.onDelete}
            isPinned={props.isPinned}
          />
        </div>
      )}
    </div>
  );
}

export { ChatSidebarItem };
