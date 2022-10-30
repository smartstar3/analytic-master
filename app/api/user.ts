export type Role = 'owner' | 'admin' | 'editor' | 'member';

export interface User {
  firstName?: string;
  lastName?: string;
  email: string;
  role?: Role;
  id?: number;
  verified?: boolean;
  // subscriptionType: 'free' | 'personal' | 'pro' | 'starter' | 'business' | 'enterprise';
}
