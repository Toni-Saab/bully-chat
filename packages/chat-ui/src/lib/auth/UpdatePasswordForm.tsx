// packages/chat-ui/src/lib/auth/UpdatePasswordForm.tsx
import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { UpdatePasswordFormProps } from './types';
import { ChatBotLogo } from '../ui/ChatBotLogo';

function UpdatePasswordForm({
  registerPassword,
  registerConfirmPassword,
  onSubmit,
  isSubmitting,
  message,
  errors,
  onBackToLogin,
}: UpdatePasswordFormProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const hasMessage = !!message;
  const isSuccess = message?.includes('Password updated');

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
        <h2 className="text-2xl font-bold text-whiteSoft">Update Password</h2>
      </div>

      <p 
        className={`text-sm mb-3 text-center transition-colors px-2 ${
          hasMessage 
            ? (isSuccess ? 'text-green-400 font-bold' : 'text-red font-bold') 
            : 'text-mediumGray font-normal'
        }`}
      >
        {message || 'Enter your new password.'}
      </p>

      <form onSubmit={onSubmit} className="space-y-2" autoComplete="off">
        
        <div>
          <ErrorDisplay message={errors.password?.message} />
          <div className={getInputClasses(errors.password?.message)}>
            <div className={getIconClasses(errors.password?.message)}><Lock size={20} /></div>
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="New Password"
              autoComplete="new-password"
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

        <div>
          <ErrorDisplay message={errors.confirmPassword?.message} />
          <div className={getInputClasses(errors.confirmPassword?.message)}>
            <div className={getIconClasses(errors.confirmPassword?.message)}><Lock size={20} /></div>
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              placeholder="Confirm Password"
              autoComplete="new-password"
              className="flex-1 p-3 bg-transparent outline-none text-whiteSoft placeholder-mediumGray"
              {...registerConfirmPassword}
            />
            <button 
              type="button" 
              onClick={() => setConfirmPasswordVisible(prev => !prev)} 
              className="p-3 text-mediumGray hover:text-whiteSoft transition-colors"
            >
              {confirmPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
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
          {isSubmitting ? 'Updating...' : 'Update Password'}
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

export { UpdatePasswordForm };
