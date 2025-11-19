// packages/data-access/src/lib/chats/chats.service.ts

import { supabase } from '../supabase/supabaseClient.js';
import { Tables, TablesInsert, TablesUpdate } from '../supabase/database.types.js';
import { ai } from '../gemini/gemini.js';
import { GEMINI_SYSTEM_INSTRUCTION } from '../gemini/config.js';

type Chat = Tables<'chats'>;
type Message = Tables<'messages'>;
type NewMessage = TablesInsert<'messages'>;

const MAX_TITLE_LENGTH = 50;

export const getChats = async (userId: string): Promise<Chat[]> => {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const getChatMessages = async (chatId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

export const createChat = async (userId: string): Promise<Chat> => {
  const { data, error } = await supabase
    .from('chats')
    .insert({ user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create chat');
  return data;
};

export const addMessage = async (message: NewMessage): Promise<Message> => {
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Error adding message');
  return data;
};

export const deleteChat = async (chatId: string): Promise<void> => {
  const msgResult = await supabase.from('messages').delete().eq('chat_id', chatId);
  if (msgResult.error) throw new Error(msgResult.error.message);

  const chatResult = await supabase.from('chats').delete().eq('id', chatId);
  if (chatResult.error) throw new Error(chatResult.error.message);
};

export const updateChat = async (chatId: string, title: string): Promise<Chat> => {
  const cleanTitle = title.trim();
  if (cleanTitle === '') throw new Error('Title cannot be empty');

  const payload: TablesUpdate<'chats'> = { title: cleanTitle };

  const { data, error } = await supabase
    .from('chats')
    .update(payload)
    .eq('id', chatId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Error updating title');
  return data;
};

export const pinChat = async (chatId: string, isPinned: boolean): Promise<Chat> => {
  const payload: TablesUpdate<'chats'> = { is_pinned: isPinned };

  const { data, error } = await supabase
    .from('chats')
    .update(payload)
    .eq('id', chatId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Error pinning chat');
  return data;
};

const generateChatTitle = async (message: string): Promise<string> => {
  const prompt = `Generate short title (max ${MAX_TITLE_LENGTH} chars) for this message. Reply only with title: "${message}"`;

  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  let title = 'New Chat';
  if (result.text) {
    title = result.text.trim();
  }
  if (title.length > MAX_TITLE_LENGTH) {
    title = title.substring(0, MAX_TITLE_LENGTH);
  }
  return title;
};

export const processUserMessage = async (
  chatId: string,
  content: string,
  isFirstMessage: boolean,
  history: Message[]
): Promise<{ userMessage: Message; botMessage: Message; newTitle?: string }> => {
  const userMessage = await addMessage({
    chat_id: chatId,
    content: content,
    role: 'user',
    is_graphql_query: false,
  });

  const messagesForAI = [];
  let i = 0;
  while (i < history.length) {
    const msg = history[i];
    const role = msg.role === 'user' ? 'user' : 'model';
    messagesForAI.push({ role: role, parts: [{ text: msg.content }] });
    i = i + 1;
  }
  messagesForAI.push({ role: 'user', parts: [{ text: content }] });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: messagesForAI,
    config: { systemInstruction: GEMINI_SYSTEM_INSTRUCTION },
  });

  const botText = response.text;
  if (!botText) throw new Error('No response from Gemini');

  const botMessage = await addMessage({
    chat_id: chatId,
    content: botText,
    role: 'model',
    is_graphql_query: false,
  });

  let newTitle: string | undefined = undefined;
  if (isFirstMessage) {
    newTitle = await generateChatTitle(content);
    await updateChat(chatId, newTitle);
  }

  return { userMessage, botMessage, newTitle };
};

export type { Chat, Message, NewMessage };