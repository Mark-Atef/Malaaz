// types/index.ts

export interface WaitlistFormData {
  email: string;
  type: 'homeowner' | 'trader';
  referralCode?: string; // referral code from the person who invited them
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
  referralCode?: string;  // this user's own referral code (deterministic from email)
  position?: number;       // estimated position in queue
  count?: number;          // total waitlist count
}

export interface TraderRegistrationData {
  traderType: 'distributor' | 'local';
  businessName: string;
  governorate: string;
  area: string;
  categories: string[];
  revenueRange: string;
  contactName: string;
  phone: string;
  email: string;
  whatsapp?: string;
}

export interface EngineerVisitData {
  name: string;
  phone: string;
  address: string;
  apartmentSize: number;
  preferredDate: string;
  notes?: string;
}

export interface InstallationLeadData {
  name: string;
  phone: string;
  area: string;
  projectType: string;
  budget?: string;
}

export type Locale = 'ar' | 'en';

export type FinishingLevel = 'economic' | 'standard' | 'premium';

export interface CostEstimate {
  electrical: { min: number; max: number };
  painting: { min: number; max: number };
  flooring: { min: number; max: number };
  total: { min: number; max: number };
  malaazSaving: { min: number; max: number };
}