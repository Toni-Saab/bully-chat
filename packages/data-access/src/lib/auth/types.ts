// packages/data-access/src/lib/auth/types.ts
export type RegisterData = {
  email: string;
  password: string;
  username: string;
};

export type SignInCredentials = {
  email: string;
  password: string;
};