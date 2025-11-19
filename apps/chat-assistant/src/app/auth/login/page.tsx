// apps/chat-assistant/src/app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, TLoginSchema } from '../../(lib)/auth/auth.schema';
import { signIn } from '@event-bot/data-access';

// Use dynamic import for the component (client-side rendering only)
const LoginForm = dynamic(
  () => import('@event-bot/chat-ui').then(mod => mod.LoginForm),
  { ssr: false }
);

function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: TLoginSchema) => {
    setServerError(undefined);
    try {
      await signIn({ email: data.email, password: data.password });
      router.push('/chat');
    } catch (err) {
      const errorMessage = (err instanceof Error) 
        ? err.message 
        : 'Login failed. Please try again.';
      
      setServerError(errorMessage);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-whiteSoft text-black pt-10">
      <LoginForm
        registerEmail={register('email')}
        registerPassword={register('password')}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        error={serverError}
        onSignUpClick={() => router.push('/auth/register')}
        onForgotPasswordClick={() => router.push('/auth/reset-password')}
        errors={errors}
      />
    </div>
  );
}

export default LoginPage;