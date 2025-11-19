// packages/chat-ui/src/lib/chat/ChatSidebar.tsx

import { Menu, MessageSquare, X } from 'lucide-react';
import { ChatUserBlock } from './ChatUserBlock.js';
import { ChatSidebarItem } from './ChatSidebarItem.js';
import { ChatSidebarProps } from './types.js';
import { ChatBotLogo } from '../ui/ChatBotLogo';

const groupChats = (chats: ChatSidebarProps['chats']): Record<string, typeof chats> => {
  const groups: Record<string, typeof chats> = {};
  for (const chat of chats) {
    const key = chat.dateGroup;
    if (!groups[key]) groups[key] = [];
    groups[key].push(chat);
  }
  return groups;
};

function ChatSidebar(props: ChatSidebarProps) {
  const grouped = groupChats(props.chats);

  return (
    <>
      {props.openMenuId && (
        <div className="fixed inset-0 z-[900]" onClick={props.onMenuClose} />
      )}

      {props.isCollapsed && (
        <div className="fixed top-0 left-0 z-[100] flex items-center gap-3 p-2 h-15">
          <button
            onClick={props.onToggleCollapse}
            className="p-2 bg-black border border-darkGray rounded-lg text-lightGray hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
          <button
            onClick={props.onNewChat}
            className="p-2 bg-blue rounded-lg text-white hover:bg-blue/90 transition-colors"
          >
            <MessageSquare size={20} />
          </button>
        </div>
      )}

      <div
        className="fixed top-0 left-0 h-screen w-80 bg-black border-r border-darkGray flex flex-col z-[950] transform transition-transform duration-300 ease-in-out"
        style={{ transform: props.isCollapsed ? 'translateX(-100%)' : 'translateX(0)' }}
      >
        <div className="flex items-center justify-between p-4 h-14 border-b border-darkGray">
          <div className="flex items-center gap-2 text-blue">
            <ChatBotLogo size={24} />
            <span className="text-lg font-bold text-white">EVENT-BOT</span>
          </div>
          <button
            onClick={props.onToggleCollapse}
            className="p-2 bg-black border border-darkGray rounded-lg text-lightGray hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={props.onNewChat}
            className="w-full bg-blue text-white py-2 rounded-lg hover:bg-blue/90 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <MessageSquare size={18} />
            New Chat
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-4 space-y-3">
          {props.isLoading ? (
            <p className="text-lightGray p-4">Loading chats...</p>
          ) : (
            Object.keys(grouped).map(groupName => (
              <div key={groupName} className="space-y-1">
                <h3 className="text-xs text-mediumGray uppercase pt-2">{groupName}</h3>
                {grouped[groupName].map(item => (
                  <ChatSidebarItem
                    key={item.id}
                    title={item.title}
                    isActive={item.isActive}
                    isPinned={item.isPinned}
                    onClick={() => item.onClick(item.id)}
                    onMenuOpen={() => item.onMenuOpen(item.id)}
                    onMenuClose={props.onMenuClose}
                    isMenuOpen={props.openMenuId === item.id}
                    onRename={() => props.onRenameChat(item.id)}
                    onPin={() => props.onPinChat(item.id)}
                    onDelete={() => props.onDeleteChat(item.id)}
                  />
                ))}
              </div>
            ))
          )}
        </div>

        <ChatUserBlock
          userName={props.userBlockProps.userName}
          onSettingsClick={props.userBlockProps.onSettingsClick}
          onLogout={props.userBlockProps.onLogout}
        />
      </div>
    </>
  );
}

export { ChatSidebar };

