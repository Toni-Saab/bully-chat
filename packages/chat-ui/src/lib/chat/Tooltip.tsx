// packages/chat-ui/src/lib/chat/Tooltip.tsx

import { TooltipProps } from './types';

const Tooltip = ({ children, content }: TooltipProps) => {
  return (
    <div className="relative group/tooltip">
      {children}
      <div className="absolute left-1/2 bottom-[100%] -translate-x-1/2 mb-2 px-2 py-1 bg-darkGray text-whiteSoft text-xs rounded-md whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50">
        {content}
      </div>
    </div>
  );
};

export { Tooltip };