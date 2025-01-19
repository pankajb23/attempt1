export enum CustomizePageType {
  LandingPage,
  CommonSettings,
  FrequentlyBoughtTogether,
  ProductAddOns,
  CartAddOns,
  UpsellFunnel,
  PostPurchaseUpsell,
  ThankYouPageAddOns,
}

export interface CardModalProps {
  heading: string;
  content: string;
  buttonContent: string;
  link: string;
  modalType: CustomizePageType;
}

export interface TranslationComponent {
  property: string;
  heading: string;
  defaultValue: string;
}
