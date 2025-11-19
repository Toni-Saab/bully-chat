// apps/chat-assistant/src/app/chat/layout.tsx

'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useUserStore } from '@event-bot/store';
import { useChatStore } from '@event-bot/store';
import type { ChatData, ChatActionModalProps } from '@event-bot/chat-ui';
import { getChatDateGroup } from '@event-bot/utils';
import type { Chat } from '@event-bot/data-access';

const DynamicChatSidebar = dynamic(
  () => import('@event-bot/chat-ui').then(mod => mod.ChatSidebar),
  { ssr: false }
);

const DynamicChatActionModal = dynamic(
  () => import('@event-bot/chat-ui').then(mod => mod.ChatActionModal),
  { ssr: false }
);

type ActionType = 'rename' | 'delete' | null;

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, isLoading: isUserLoading, logout } = useUserStore();
  const { chats, activeChat, fetchChats, setActiveChat, isChatsLoading, deleteChat, startNewChat, pinChat, updateChatTitle, messages, isCreatingChat } = useChatStore();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const previousActiveId = useRef<string | null>(activeChat ? activeChat.id : null);

  const [actionChatId, setActionChatId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  const handleNewChat = useCallback(async (forceCreate = false) => {
    if (!user || isCreatingChat) return;
    if (!forceCreate) {
      if (activeChat && messages.length === 0) return;
    }
    await startNewChat(user.id);
  }, [user, activeChat, messages.length, startNewChat, isCreatingChat]);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) router.replace('/auth/login');
    else if (chats.length === 0 && !isChatsLoading) fetchChats(user.id);
  }, [user, isUserLoading, router, chats.length, isChatsLoading, fetchChats]);

  useEffect(() => {
    if (user && !isChatsLoading && !isCreatingChat && !activeChat) {
      handleNewChat(true);
    }
  }, [user, isChatsLoading, isCreatingChat, activeChat, handleNewChat]);

  useEffect(() => {
    if (activeChat && activeChat.id !== previousActiveId.current) {
      setOpenMenuId(null);
      router.replace(`/chat/${activeChat.id}`);
      previousActiveId.current = activeChat.id;
    } else if (!activeChat && pathname !== '/chat') {
      router.replace('/chat');
    } else if (activeChat) {
      previousActiveId.current = activeChat.id;
    }
  }, [activeChat, router, pathname]);

  const handleChatSelect = useCallback((chatId: string) => {
    if (activeChat && activeChat.id === chatId) return;
    setActiveChat(chatId);
  }, [activeChat, setActiveChat]);

  const handleMenuOpen = useCallback((chatId: string) => setOpenMenuId(chatId), []);
  const handleMenuClose = useCallback(() => setOpenMenuId(null), []);
  
  const handlePinChat = (chatId: string) => {
    pinChat(chatId);
    handleMenuClose();
  };

  const handleModalOpen = (chatId: string, type: ActionType) => {
    handleMenuClose();
    const chatToEdit = chats.find(c => c.id === chatId);
    if (!chatToEdit) return;
    setActionChatId(chatId);
    setActionType(type);
    if (type === 'rename') {
      setNewChatTitle(chatToEdit.title ? chatToEdit.title : 'New Chat');
    }
  };

  const handleRenameChat = (chatId: string) => handleModalOpen(chatId, 'rename');
  const handleDeleteChat = (chatId: string) => handleModalOpen(chatId, 'delete');

  const handleActionModalClose = () => {
    setActionChatId(null);
    setActionType(null);
    setNewChatTitle('');
    setIsProcessing(false);
  };

  const handleActionConfirm = async () => {
    if (!actionChatId || !actionType || isProcessing) return;
    setIsProcessing(true);
    try {
      if (actionType === 'rename') {
        const text = newChatTitle.trim();
        if (text) await updateChatTitle(actionChatId, text);
      } else if (actionType === 'delete') {
        await deleteChat(actionChatId);
      }
    } catch (error) {
      console.error('Error performing action:', error);
    } finally {
      handleActionModalClose();
    }
  };

  const sortedAndGroupedChats = React.useMemo(() => {
    const pinnedChats: Chat[] = [];
    const unpinnedChats: Chat[] = [];

    for (const chat of chats) {
      if (chat.is_pinned) {
        pinnedChats.push(chat);
      } else {
        unpinnedChats.push(chat);
      }
    }

    const sortFn = (a: Chat, b: Chat) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    };

    pinnedChats.sort(sortFn);
    unpinnedChats.sort(sortFn);

    const allSortedChats = [...pinnedChats, ...unpinnedChats];

    const result: ChatData[] = [];
    
    for (const chat of allSortedChats) {
      const dateGroup = chat.is_pinned ? 'Pinned' : getChatDateGroup(chat.created_at);

      result.push({
        id: chat.id,
        dateGroup: dateGroup,
        title: chat.title || 'New Chat',
        isActive: activeChat !== null && chat.id === activeChat.id,
        isPinned: chat.is_pinned,
        onClick: handleChatSelect,
        onMenuOpen: handleMenuOpen,
      });
    }

    return result;
  }, [chats, activeChat, handleChatSelect, handleMenuOpen]); 

  const sidebarChats = sortedAndGroupedChats;

  const activeChatToEdit = actionChatId ? chats.find(c => c.id === actionChatId) : null;

  const getModalProps = (): ChatActionModalProps | null => {
    if (!activeChatToEdit || !actionType) return null;
    const currentTitle = activeChatToEdit.title || 'New Chat';
    if (actionType === 'rename') {
      return {
        title: 'Rename Chat',
        message: 'Enter a new chat title:',
        isRename: true,
        inputValue: newChatTitle,
        onInputChange: (e) => setNewChatTitle(e.target.value),
        isDisabled: isProcessing || !newChatTitle.trim() || newChatTitle.trim() === currentTitle,
        onCancel: handleActionModalClose,
        onConfirm: handleActionConfirm,
      };
    }
    if (actionType === 'delete') {
      return {
        title: 'Confirm Deletion',
        message: `${currentTitle}`,
        isRename: false,
        isDestructive: true,
        isDisabled: isProcessing,
        onCancel: handleActionModalClose,
        onConfirm: handleActionConfirm,
      };
    }
    return null;
  };

  const modalProps = getModalProps();

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DynamicChatSidebar
        isLoading={isChatsLoading || isCreatingChat}
        userBlockProps={{
          userName: profile && profile.username ? profile.username : 'User',
          onSettingsClick: () => router.push('/settings'),
          onLogout: handleLogout,
        }}
        chats={sidebarChats}
        onNewChat={() => handleNewChat()}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        openMenuId={openMenuId}
        onMenuClose={handleMenuClose}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
        onPinChat={handlePinChat}
      />

      <main
        className={`
          flex-grow h-screen overflow-hidden bg-black
          transition-padding-left duration-300 ease-in-out
          ${isSidebarCollapsed ? 'pl-0' : 'pl-80'}
        `}
      >
        {children}
      </main>

      {modalProps && <DynamicChatActionModal {...modalProps} />}
    </div>
  );
};

export default ChatLayout;
