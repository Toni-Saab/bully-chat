// packages/chat-ui/src/lib/auth/LoginForm.tsx
import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { LoginFormProps } from './types';
import { ChatBotLogo } from '../ui/ChatBotLogo';

function LoginForm({
  registerEmail,
  registerPassword,
  onSubmit,
  isSubmitting,
  error,
  onSignUpClick,
  onForgotPasswordClick,
  errors,
}: LoginFormProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const hasGlobalError = !!error;
  const headerMessage = hasGlobalError 
    ? error 
    : 'Enter your credentials to access the Event Bot chat.';

  const getInputClasses = (validationError?: string) => 
    `flex items-center border ${
      validationError ? 'border-red' : 'border-lightGray/50'
    } rounded-xl bg-darkGray transition-all w-full`;

  const getIconClasses = (validationError?: string) => 
    `p-3 text-mediumGray transition-colors ${
      validationError ? 'text-red' : ''
    }`;

  const ErrorDisplay = ({ message }: { message?: string }) => (
    <div className="h-5 flex items-center pl-1 pt-1">
      {message && <p className="text-xs text-red font-medium">{message}</p>}
    </div>
  );

  return (
    <div className="w-full max-w-sm mx-auto bg-black rounded-2xl shadow-2xl border border-darkGray p-8 text-whiteSoft">
      
      <div className="flex flex-col items-center mb-4">
        <ChatBotLogo size={32} className="mb-2" />
        <h2 className="text-2xl font-bold text-whiteSoft">Chat Login</h2>
      </div>

      <p 
        className={`text-sm mb-3 text-center transition-colors px-2 ${
          hasGlobalError ? 'text-red font-bold' : 'text-mediumGray font-normal'
        }`}
      >
        {headerMessage}
      </p>

      <form onSubmit={onSubmit} className="space-y-2" autoComplete="off">

        <div>
          <ErrorDisplay message={errors.email?.message} />
          <div className={getInputClasses(errors.email?.message)}>
            <div className={getIconClasses(errors.email?.message)}><Mail size={20} /></div>
            <input
              type="email"
              placeholder="Email"
              autoComplete="off"
              className="flex-1 p-3 bg-transparent outline-none text-whiteSoft placeholder-mediumGray"
              {...registerEmail}
            />
          </div>
        </div>

        <div>
          <ErrorDisplay message={errors.password?.message} />
          <div className={getInputClasses(errors.password?.message)}>
            <div className={getIconClasses(errors.password?.message)}><Lock size={20} /></div>
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="current-password"
              className="flex-1 p-3 bg-transparent outline-none text-whiteSoft placeholder-mediumGray"
              {...registerPassword}
            />
            <button 
              type="button" 
              onClick={() => setPasswordVisible(prev => !prev)} 
              className="p-3 text-mediumGray hover:text-whiteSoft transition-colors"
            >
              {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-lg font-medium text-white 
                      bg-blue transition-all duration-300 ease-in-out mt-6
                      hover:scale-[1.02] hover:ring-2 hover:ring-offset-2 hover:ring-blue/50 hover:ring-offset-black
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:ring-0`}
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm font-medium">
        <div className="flex justify-between items-center w-full text-mediumGray">
          <button 
            type="button" 
            onClick={onForgotPasswordClick}
            className="text-blue hover:text-blue hover:underline hover:brightness-110 transition duration-150"
          >
            Forgot password?
          </button>
          <button 
            type="button" 
            onClick={onSignUpClick}
            className="text-blue hover:text-blue hover:underline hover:brightness-110 transition duration-150"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export { LoginForm };
