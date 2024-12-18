export interface UserGuidePreferences {
    userId: string
    isShowAssistanceOnMainPageEnabled: boolean
    isShowWarningOnOfferPageEnabled: boolean
}

export interface SelectedProductType{
    pid: string
    title: string
    img: string
}

export interface Offer{
    offerId: string
    offerName: string
    offerType: string
    status: string
    createdAt: string
    priority: string
    content: string
}

export interface CommonStyling {
    buttonBgColor?: string;
    buttonTextColor?: string;
    buttonBorderColor?: string;
    buttonBorderWidth?: string;
    textColor?: string;
    priceColor?: string;
    salePriceColor?: string;
    compareAtPriceColor?: string;
    timerTextColor?: string;
    borderRadius?: string
}

export interface Product {
    title?: string
    img?: string
    price?: string
}
