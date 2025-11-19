// packages/chat-ui/src/lib/chat/ChatHeader.tsx

import { ChatHeaderProps } from './types.js'

function ChatHeader(props: ChatHeaderProps) {
  return (
    <header className="flex justify-center items-center p-4 h-14 border-b border-darkGray bg-black">
      <h2 className="text-white text-lg font-medium truncate text-center w-full">
        {props.title}
      </h2>
    </header>
  )
}

export { ChatHeader }