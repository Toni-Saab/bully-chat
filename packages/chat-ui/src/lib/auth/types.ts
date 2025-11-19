// packages/chat-ui/src/lib/auth/types.ts

import { UseFormRegisterReturn } from 'react-hook-form';

export type LoginFormProps = {
    registerEmail: UseFormRegisterReturn;
    registerPassword: UseFormRegisterReturn;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isSubmitting: boolean;
    error?: string;
    onSignUpClick: () => void;
    onForgotPasswordClick: () => void;
    errors: {
        email?: { message?: string };
        password?: { message?: string };
    };
};

export type RegisterFormProps = {
    registerUsername: UseFormRegisterReturn;
    registerEmail: UseFormRegisterReturn;
    registerPassword: UseFormRegisterReturn;
    registerConfirmPassword: UseFormRegisterReturn;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isSubmitting: boolean;
    error?: string;
    onLoginClick: () => void;
    errors: {
        username?: { message?: string };
        email?: { message?: string };
        password?: { message?: string };
        confirmPassword?: { message?: string };
    };
};

export type ResetPasswordFormProps = {
    registerEmail: UseFormRegisterReturn;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isSubmitting: boolean;
    message?: string;
    onBackToLogin: () => void;
    errors: {
        email?: { message?: string };
    };
};

export type UpdatePasswordFormProps = {
    registerPassword: UseFormRegisterReturn;
    registerConfirmPassword: UseFormRegisterReturn;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isSubmitting: boolean;
    message?: string;
    errors: {
        password?: { message?: string };
        confirmPassword?: { message?: string };
    };
    onBackToLogin: () => void;
};
