// packages/store/src/lib/chatStore.ts

import { create } from 'zustand';
import {
  getChats,
  createChat,
  deleteChat as deleteChatService,
  getChatMessages,
  updateChat as updateChatService,
  pinChat as pinChatService,
  processUserMessage,
  Chat,
  Message,
} from '@event-bot/data-access';
import { updateItemInArray } from '@event-bot/utils';

type ExtendedMessage = Message & {
  isLoading?: boolean;
};

type ChatState = {
  chats: Chat[];
  activeChat: Chat | null;
  messages: ExtendedMessage[];
  isChatsLoading: boolean;
  isMessagesLoading: boolean;
  isCreatingChat: boolean;
  fetchChats: (userId: string) => Promise<void>;
  setActiveChat: (chatId: string) => Promise<void>;
  startNewChat: (userId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  sendMessage: (content: string, role: string) => Promise<void>;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  pinChat: (chatId: string) => Promise<void>;
  reset: () => void;
};

const createTempMessage = (chatId: string, content: string, role: string, isAwaitingResponse: boolean): ExtendedMessage => {
  const uniqueId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  return {
    id: uniqueId,
    chat_id: chatId,
    content,
    role,
    created_at: new Date().toISOString(),
    is_graphql_query: false,
    isLoading: isAwaitingResponse,
  };
};

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  activeChat: null,
  messages: [],
  isChatsLoading: false,
  isMessagesLoading: false,
  isCreatingChat: false,

  fetchChats: async (userId) => {
    set({ isChatsLoading: true });
    try {
      const allChats = await getChats(userId);
      set({ chats: allChats });
      if (allChats.length === 0) {
        set({ activeChat: null, messages: [] });
        return;
      }
      const currentActive = get().activeChat;
      const hasCurrent = allChats.some(chat => currentActive && chat.id === currentActive.id);
      if (currentActive && hasCurrent) {
        await get().setActiveChat(currentActive.id);
      }
    } catch (error) {
      console.error('Failed to load chats', error);
      set({ chats: [], activeChat: null, messages: [] });
    } finally {
      set({ isChatsLoading: false });
    }
  },

  setActiveChat: async (chatId) => {
    const state = get();
    let chat: Chat | null = null;
    for (const c of state.chats) {
      if (c.id === chatId) {
        chat = c;
        break;
      }
    }
    if (!chat) return;
    set({ activeChat: chat, isMessagesLoading: true, messages: [] });
    try {
      const msgs = await getChatMessages(chatId);
      set({ messages: msgs as ExtendedMessage[] });
    } catch (error) {
      console.error('Failed to load messages', error);
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  startNewChat: async (userId) => {
    const state = get();
    if (state.isCreatingChat) {
      return;
    }
    const existingEmptyChat = state.chats.find(c => c.title === null);
    if (existingEmptyChat) {
      if (state.activeChat) {
        if (state.activeChat.id !== existingEmptyChat.id) {
          await get().setActiveChat(existingEmptyChat.id);
        }
      } else {
        await get().setActiveChat(existingEmptyChat.id);
      }
      return;
    }
    if (state.activeChat) {
      if (state.messages.length === 0) {
        if (state.activeChat.title === null || state.activeChat.title === 'New Chat') {
          return;
        }
      }
    }
    set({ isCreatingChat: true });
    try {
      const newChat = await createChat(userId);
      set({
        chats: [newChat, ...state.chats],
        activeChat: newChat,
        messages: [],
      });
    } catch (error) {
      console.error('Failed to create new chat', error);
    } finally {
      set({ isCreatingChat: false });
    }
  },

  sendMessage: async (content, role) => {
    const text = content.trim();
    if (text === '') return;
    const state = get();
    const active = state.activeChat;
    if (!active || !active.user_id) return;
    const isFirstMessage = state.messages.length === 0 && (active.title === 'New Chat' || active.title === null);
    const tempUserMsg = createTempMessage(active.id, text, role, false);
    const tempBotMsg = createTempMessage(active.id, '', 'model', true);
    set({ messages: [...state.messages, tempUserMsg, tempBotMsg] });
    try {
      const { userMessage, botMessage, newTitle } = await processUserMessage(
        active.id,
        text,
        isFirstMessage,
        state.messages as Message[],
      );
      set((state) => {
        const afterUser = state.messages.map(msg =>
          msg.id === tempUserMsg.id ? userMessage : msg
        );
        const finalMessages = afterUser.map(msg =>
          msg.id === tempBotMsg.id ? botMessage : msg
        );
        let newChats = state.chats;
        let newActive = state.activeChat;
        if (newTitle) {
          const updatedChat: Chat = { ...active, title: newTitle };
          newActive = updatedChat;
          newChats = updateItemInArray(state.chats, updatedChat);
        }
        return { messages: finalMessages, activeChat: newActive, chats: newChats };
      });
    } catch (error) {
      console.error('Failed to send message or get bot response', error);
      set((state) => ({
        messages: state.messages.filter(m => m.id !== tempUserMsg.id && m.id !== tempBotMsg.id),
      }));
    }
  },

  deleteChat: async (chatId) => {
    try {
      await deleteChatService(chatId);
      const newChats = get().chats.filter(c => c.id !== chatId);
      const active = get().activeChat;
      const wasActive = active && active.id === chatId;
      const newActive = wasActive ? null : active;
      set({
        chats: newChats,
        activeChat: newActive,
        messages: [],
      });
    } catch (error) {
      console.error('Failed to delete chat', error);
    }
  },

  updateChatTitle: async (chatId, title) => {
    const trimmed = title.trim();
    if (trimmed === '') throw new Error('Title cannot be empty');
    try {
      const updated = await updateChatService(chatId, trimmed);
      set((state) => {
        const newChats = updateItemInArray(state.chats, updated);
        let newActive = state.activeChat;
        if (state.activeChat && state.activeChat.id === chatId) {
          newActive = updated;
        }
        return { chats: newChats, activeChat: newActive };
      });
    } catch (error) {
      console.error('Failed to update chat title', error);
    }
  },

  pinChat: async (chatId) => {
    let currentChat: Chat | null = null;
    for (const c of get().chats) {
      if (c.id === chatId) {
        currentChat = c;
        break;
      }
    }
    if (!currentChat) return;
    const newPinStatus = !currentChat.is_pinned;
    try {
      const updated = await pinChatService(chatId, newPinStatus);
      set((state) => {
        const newChats = updateItemInArray(state.chats, updated);
        let newActive = state.activeChat;
        if (state.activeChat && state.activeChat.id === chatId) {
          newActive = updated;
        }
        return { chats: newChats, activeChat: newActive };
      });
    } catch (error) {
      console.error('Failed to pin/unpin chat', error);
    }
  },

  reset: () => {
    set({
      chats: [],
      activeChat: null,
      messages: [],
      isChatsLoading: false,
      isMessagesLoading: false,
    });
  },
}));
