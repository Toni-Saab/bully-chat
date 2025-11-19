// packages/chat-ui/src/lib/ui/ChatBotLogo.tsx;

type ChatBotLogoProps = {
  size?: number;
  className?: string;
};

export function ChatBotLogo({ size = 32, className = '' }: ChatBotLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      className={`text-blue ${className}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zM9 9a1 1 0 012 0v2a1 1 0 01-2 0V9z" />
    </svg>
  );
}
