// types/index.ts

export interface WaitlistFormData {
  email: string;
  type: 'homeowner' | 'trader';
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
}

export type Locale = 'ar' | 'en';