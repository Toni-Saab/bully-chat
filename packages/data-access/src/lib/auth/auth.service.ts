// packages/data-access/src/lib/auth/auth.service.ts

import { supabase } from '../supabase/supabaseClient.js';
import { User } from '@supabase/supabase-js';
import { Tables } from '../supabase/database.types.js';
import { RegisterData, SignInCredentials } from './types.js';

type Profile = Tables<'profiles'>;

const checkUsernameUnique = async (username: string): Promise<boolean> => {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (data) {
    return false;
  }
  return true;
};

const signUp = async (data: RegisterData) => {
  const { email, password, username } = data;

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) {
    if (error.message.includes('User already registered')) {
      throw new Error('This email is already registered. Please login.');
    }
    if (error.status === 429) {
      throw new Error('Too many requests. Please wait 30 seconds.');
    }
    if (error.message.includes('duplicate key value')) {
      throw new Error('This username is already taken.');
    }
    throw new Error(error.message);
  }

  const user = authData.user;
  if (user) {
    const identities = user.identities;
    if (!identities || identities.length === 0) {
      throw new Error('This email is already registered. Please login.');
    }
  }

  return authData;
};

const signIn = async (credentials: SignInCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

const getUserProfile = async (userId: string): Promise<Profile | null> => {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
};

const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback`,
  });
  if (error) {
    throw new Error(error.message);
  }
};

const updatePassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    throw new Error(error.message);
  }
};

export {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getUserProfile,
  checkUsernameUnique,
  resetPassword,
  updatePassword,
};

export type {
  User,
  RegisterData,
  SignInCredentials,
  Profile,
};