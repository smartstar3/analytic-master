export interface PaymentInfo {
  plan: Plan;
  interval: Interval;
}

export type Plan = 'free' | 'personal' | 'pro' | 'starter' | 'business' | 'enterprise' | 'test';
export type Interval = 'daily' | 'monthly' | 'yearly';

export interface GeneralInfo {
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface CompanyInfo {
  companyName: string;
  vatNumber: string;
}

// the address of the customer - required for some payment methods
export interface Address {
  postalcode: string;
  HouseNumber: string;
  HouseNumberAdd: string;
  street: string;
  city: string;
  countryIso2: string;
  // state: string;
}

export interface PaymentFormValue {
  paymentInfo: PaymentInfo;
  address: Address;
  general: GeneralInfo;
  company: CompanyInfo;
  language: string;
}

// details about the plans shown on the website
export interface PaymentPlan {
  title: 'free' | 'personal' | 'pro' | 'starter' | 'business' | 'enterprise';
  subtitle: string;
  price: string;
  priceYearly: string;
  details: string[];
  type: 'personal' | 'business';
}
