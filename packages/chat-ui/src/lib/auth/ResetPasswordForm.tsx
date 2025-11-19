// packages/chat-ui/src/lib/auth/ResetPasswordForm.tsx
import { Mail } from 'lucide-react';
import { ResetPasswordFormProps } from './types';
import { ChatBotLogo } from '../ui/ChatBotLogo';

function ResetPasswordForm({
  registerEmail,
  onSubmit,
  isSubmitting,
  message,
  onBackToLogin,
  errors,
}: ResetPasswordFormProps) {
  const hasMessage = !!message;
  const isSuccess = message?.includes('Check your email');

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
        <ChatBotLogo size={32} className="mb-2 text-blue" />
        <h2 className="text-2xl font-bold text-whiteSoft">Reset Password</h2>
      </div>

      <p
        className={`text-sm mb-3 text-center transition-colors px-2 ${
          hasMessage
            ? (isSuccess ? 'text-green-400 font-bold' : 'text-red font-bold')
            : 'text-mediumGray font-normal'
        }`}
      >
        {message || 'Enter your email. We will send a reset link.'}
      </p>

      <form onSubmit={onSubmit} className="space-y-2" autoComplete="off">

        <div>
          <ErrorDisplay message={errors.email?.message} />
          <div className={getInputClasses(errors.email?.message)}>
            <div className={getIconClasses(errors.email?.message)}>
              <Mail size={20} />
            </div>
            <input
              type="email"
              placeholder="Email"
              autoComplete="off"
              className="flex-1 p-3 bg-transparent outline-none text-whiteSoft placeholder-mediumGray"
              {...registerEmail}
            />
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
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm font-medium">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-blue hover:underline hover:brightness-110 transition duration-150"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export { ResetPasswordForm };
