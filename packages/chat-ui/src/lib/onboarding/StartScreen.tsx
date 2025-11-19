//packages/chat-ui/src/lib/onboarding/StartScreen.tsx

type StartScreenProps = {
  onStartClick: () => void;
};

function StartScreen({ onStartClick }: StartScreenProps) {
  return (
    <div className="relative z-10 flex flex-col items-center w-full max-w-xl p-4 md:p-8">
      <p className="text-sm text-gray mb-12 py-1 px-3 bg-white/50 rounded-full border border-lightGray/30 shadow-sm opacity-80">
        Event-Bot v1.0 - Assistant in event search
      </p>

      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight text-center text-blue">
        Event-Bot
      </h1>
      
      <h2 className="text-2xl md:text-3xl font-medium text-darkGray text-center mb-16">
        Your helper in finding events
      </h2>
      
      <div className="flex justify-center w-full max-w-sm">
        <button 
          type="button"
          onClick={onStartClick}
          className="w-full flex flex-col items-start p-8 bg-white rounded-2xl shadow-xl border border-lightGray/30 
                     transition duration-150 ease-in-out cursor-pointer 
                     hover:scale-[0.98] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue/50"
        >
          <h3 className="text-xl font-semibold mb-2 text-blue">
            Start Now
          </h3>
          <p className="text-sm text-gray mb-0 text-left">
            Start a conversation to find events and festivals.
          </p>
        </button>
      </div>
    </div>
  );
}

export { StartScreen };
