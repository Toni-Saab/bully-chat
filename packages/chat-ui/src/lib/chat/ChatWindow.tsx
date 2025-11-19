// packages/chat-ui/src/lib/chat/ChatWindow.tsx

import { ChatHeader } from './ChatHeader.js';
import { ChatMessagesList } from './ChatMessagesList.js';
import { ChatInputContainer } from './ChatInputContainer.js';
import { ChatBotLogo } from '../ui/ChatBotLogo';
import { ChatWindowProps } from './types.js';

function ChatWindow(props: ChatWindowProps) {
  const input = (
    <div className="p-4 bg-black min-w-0">
      <ChatInputContainer
        value={props.inputValue}
        onChange={props.onInputChange}
        onSend={props.onSend}
        isDisabled={props.isInputDisabled}
        placeholder={props.placeholder}
      />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-black w-full max-w-full overflow-hidden min-w-0">
      <ChatHeader title={props.title} />

      {props.isEmpty ? (
        <>
          <div className="flex flex-col items-center justify-center flex-grow p-10 min-w-0">
            <div className="text-center text-lightGray max-w-lg">
              <ChatBotLogo size={48} className="mx-auto mb-4 text-blue" />
              <h1 className="text-3xl font-bold mb-2 text-whiteSoft">
                How can I help you?
              </h1>
              <p className="text-lg">Ask your first question.</p>
            </div>
          </div>
          {input}
        </>
      ) : (
        <>
          <ChatMessagesList
            messages={props.messages}
            isInitialLoading={props.isInitialLoading}
          />
          {input}
        </>
      )}
    </div>
  );
}

export { ChatWindow };
