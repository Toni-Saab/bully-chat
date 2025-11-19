// packages/chat-ui/src/lib/chat/ChatUserBlock.tsx

import { LogOut, User } from 'lucide-react';
import { ChatUserBlockProps } from './types.js';

const ChatUserBlock = (props: ChatUserBlockProps) => {
  const containerClasses = 'flex items-center justify-between p-3 bg-darkGray';
  const infoClasses = 'flex items-center gap-3 text-whiteSoft';
  const avatarClasses = 'w-8 h-8 rounded-full bg-lightGray flex items-center justify-center';
  const nameClasses = 'text-sm font-medium truncate';
  
  return (
    <div className={containerClasses}>
      <div className={infoClasses}>
        <div className={avatarClasses}>
          <User size={16} color="black" />
        </div>
        <p className={nameClasses}>
          {props.userName}
        </p>
      </div>
      
      <button  
        onClick={props.onLogout}
        className="p-1 text-red hover:text-red/70 transition-colors"
      >
        <LogOut size={20} />
      </button>
    </div>
  );
};

export { ChatUserBlock };
export type { ChatUserBlockProps };
