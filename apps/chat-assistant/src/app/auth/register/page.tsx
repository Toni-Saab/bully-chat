// apps/chat-assistant/src/app/auth/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, TRegisterSchema } from '../../(lib)/auth/register.schema';
import { signUp } from '@event-bot/data-access';

// Use dynamic import for the component (client-side rendering only)
const RegisterForm = dynamic(
  () => import('@event-bot/chat-ui').then(mod => mod.RegisterForm),
  { ssr: false }
);

function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: TRegisterSchema) => {
    setServerError(undefined);

    try {
      await signUp({ 
        email: data.email, 
        password: data.password, 
        username: data.username 
      });
      router.push('/auth/login');
    } catch (err: unknown) {
      const message = err instanceof Error
        ? err.message 
        : 'Registration failed. Please try again.';
        
      setServerError(message);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-whiteSoft text-black pt-10">
      <RegisterForm
        registerUsername={register('username')}
        registerEmail={register('email')}
        registerPassword={register('password')}
        registerConfirmPassword={register('confirmPassword')}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        error={serverError}
        onLoginClick={() => router.push('/auth/login')}
        errors={errors}
      />
    </div>
  );
}

export default RegisterPage;