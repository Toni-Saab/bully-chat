// apps/chat-assistant/src/app/auth/reset-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, TResetPasswordSchema } from '../../(lib)/auth/reset-password.schema';
import { resetPassword } from '@event-bot/data-access';

// Use dynamic import for the component (client-side rendering only)
const ResetPasswordForm = dynamic(
  () => import('@event-bot/chat-ui').then(mod => mod.ResetPasswordForm),
  { ssr: false }
);

function ResetPasswordPage() {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState<string | undefined>(undefined);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: TResetPasswordSchema) => {
    setServerMessage(undefined);
    try {
      await resetPassword(data.email);
      setServerMessage('Check your email. We sent a password reset link.');
    } catch (err) {
      const errorMessage = (err instanceof Error) 
        ? err.message 
        : 'Failed to send reset link. Please try again.';
      
      setServerMessage(errorMessage);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-whiteSoft text-black pt-10">
      <ResetPasswordForm
        registerEmail={register('email')}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        message={serverMessage}
        onBackToLogin={() => router.push('/auth/login')}
        errors={errors}
      />
    </div>
  );
}

export default ResetPasswordPage;