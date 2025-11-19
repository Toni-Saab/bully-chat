// apps/chat-assistant/src/app/auth/callback/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePasswordSchema, TUpdatePasswordSchema } from '../../(lib)/auth/update-password.schema';
import { updatePassword } from '@event-bot/data-access';

// Use dynamic import for the component (client-side rendering only)
const UpdatePasswordForm = dynamic(
  () => import('@event-bot/chat-ui').then(mod => mod.UpdatePasswordForm),
  { ssr: false }
);

function UpdatePasswordPage() {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState<string | undefined>(undefined);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TUpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
    mode: 'onBlur',
  });

  const handleBackToLogin = () => {
    router.push('/auth/login');
  };

  const onSubmit = async (data: TUpdatePasswordSchema) => {
    setServerMessage(undefined);
    try {
      await updatePassword(data.password);
      setServerMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err) {
      const errorMessage = (err instanceof Error) 
        ? err.message 
        : 'Failed to update password. Please try again.';
      
      setServerMessage(errorMessage);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-whiteSoft text-black pt-10">
      <UpdatePasswordForm
        registerPassword={register('password')}
        registerConfirmPassword={register('confirmPassword')}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        message={serverMessage}
        onBackToLogin={handleBackToLogin}
        errors={errors}
      />
    </div>
  );
}

export default UpdatePasswordPage;