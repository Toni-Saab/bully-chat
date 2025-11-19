// packages/chat-ui/src/lib/chat/ChatSidebarMenu.tsx

import { Edit2, Pin, Trash2 } from 'lucide-react';
import { ChatSidebarMenuProps } from './types.js';
import React from 'react';

function MenuItem({ icon: Icon, label, onClick, isDelete = false }: {
  icon: any;
  label: string;
  onClick: () => void;
  isDelete?: boolean;
}) {
  const baseClasses = 'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors cursor-pointer';
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  const classes = isDelete
    ? `${baseClasses} text-red hover:bg-darkGray`
    : `${baseClasses} text-whiteSoft hover:bg-darkGray`;

  return (
    <div className={classes} onClick={handleClick}>
      <Icon size={16} />
      <span>{label}</span>
    </div>
  );
}

function ChatSidebarMenu(props: ChatSidebarMenuProps) {
  const pinLabel = props.isPinned ? 'Unpin chat' : 'Pin chat';

  return (
    <div
      className="w-40 bg-deepGray rounded-lg shadow-2xl overflow-hidden p-1 border border-darkGray z-[1020]"
      onClick={(e) => e.stopPropagation()}
    >
      <MenuItem icon={Edit2} label="Rename" onClick={props.onRename} />
      <MenuItem icon={Pin} label={pinLabel} onClick={props.onPin} />
      <div className="h-px bg-darkGray my-1" />
      <MenuItem icon={Trash2} label="Delete chat" onClick={props.onDelete} isDelete />
    </div>
  );
}

export { ChatSidebarMenu };
