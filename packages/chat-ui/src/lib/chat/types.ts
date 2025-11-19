// packages/chat-ui/src/lib/chat/types.ts

export type MessageRole = 'user' | 'assistant';

// === Modals ===
export type ChatActionModalProps = {
  title: string;
  message: string;
  isRename: boolean;
  inputValue?: string;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isDisabled: boolean;
  isDestructive?: boolean;
};

// === Tooltip ===
export type TooltipProps = {
  children: React.ReactNode;
  // Элемент, к которому привязана подсказка
  content: string;               // Текст подсказки
};

// === ChatHeader ===
export type ChatHeaderProps = {
  title: string;
};

// === ChatInput ===
export type ChatInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  isDisabled: boolean;
  placeholder: string;
};

// === ChatMessage ===
export type ChatMessageProps = {
  id: string;
  content: string;
  role: MessageRole;
  isLoading?: boolean;
  onCopy: () => void;
  onEdit?: () => void;
};

// === ChatMessagesList ===
export type ChatMessagesListProps = {
  messages: ChatMessageProps[];
  isInitialLoading: boolean;
};

// === ChatWindow ===
export type ChatWindowProps = {
  title: string;
  messages: ChatMessageProps[];
  isInitialLoading: boolean;
  isEmpty: boolean;
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  isInputDisabled: boolean;
  placeholder: string;
};

// === Sidebar ===
export type ChatData = {
  id: string;
  dateGroup: string;
  title: string;
  isActive: boolean;
  isPinned: boolean;
  onClick: (chatId: string) => void;
  onMenuOpen: (chatId: string) => void;
};

export type ChatUserBlockProps = {
  userName: string;
  onSettingsClick: () => void;
  onLogout: () => void;
};

export type ChatSidebarProps = {
  isLoading: boolean;
  userBlockProps: ChatUserBlockProps;
  chats: ChatData[];
  onNewChat: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  openMenuId: string | null;
  onRenameChat: (chatId: string) => void;
  onPinChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onMenuClose: () => void;
};

export type ChatSidebarItemProps = {
  title: string;
  isActive: boolean;
  isPinned: boolean;
  onClick: () => void;
  isMenuOpen: boolean;
  onMenuOpen: () => void;
  onMenuClose: () => void;
  onRename: () => void;
  onPin: () => void;
  onDelete: () => void;
};

export type ChatSidebarMenuProps = {
  onRename: () => void;
  onPin: () => void;
  onDelete: () => void;
  isPinned: boolean;
};