// packages/chat-ui/src/lib/chat/ChatActionModal.tsx

import { ChatActionModalProps } from './types';

const ChatActionModal = ({
  title,
  message,
  isRename,
  inputValue,
  onInputChange,
  onCancel,
  onConfirm,
  isDisabled,
  isDestructive,
}: ChatActionModalProps) => {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 backdrop-blur-sm" onClick={onCancel}>
      <div
        className="bg-deepGray p-6 rounded-xl shadow-2xl border border-darkGray w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-white text-xl font-bold mb-5">{title}</h3>

        <div className="mb-5">
          {isDestructive ? (
            <>
              <p className="text-lightGray text-sm leading-relaxed">
                Are you sure you want to delete this chat?
              </p>
              <p className="text-blue font-bold text-base truncate mt-2">{message}</p>
            </>
          ) : (
            <p className="text-lightGray text-sm font-semibold">{message}</p>
          )}
        </div>

        {isRename && (
          <input
            autoFocus
            type="text"
            value={inputValue}
            onChange={onInputChange}
            placeholder="Enter new chat name..."
            className="w-full p-3 bg-black text-white border border-darkGray rounded-lg focus:border-blue focus:outline-none mb-6 text-base"
          />
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-lightGray rounded-lg hover:bg-darkGray transition-colors font-medium"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isDisabled}
            className={`
              relative px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-150
              min-w-24 text-center
              ${isDisabled
                ? 'bg-darkGray text-lightGray/70 cursor-not-allowed'
                : isDestructive
                  ? 'bg-red hover:bg-red/90'
                  : 'bg-blue hover:bg-blue/90'
              }
            `}
            style={{ minHeight: '44px' }}
          >
            <span className="inline-block min-w-20">
              {isDestructive ? 'Delete' : 'Confirm'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export { ChatActionModal };