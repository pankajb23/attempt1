
export interface OtherPriorities {
    defaultWidgetTitle?: string
    offerPriority?: number
}

// Enum for discount types (radio button options)
export type DiscountTypeEnum = 'percentOrFixed' | 'cheapestItemFree' | 'freeShipping';

// Common combination type
export interface DiscountCombination {
    id: string
    label: string
    isSelected: boolean
}

// Only define interfaces for types that have additional properties
export interface PercentOrFixedDiscount {
    type: 'percentOrFixed';
    label: string;
    discountValue?: number;
    discountText?: string;
    discountCombination?: DiscountCombination[];
}

export interface CheapestItemFreeDiscount {
    type: 'cheapestItemFree';
    label: string;
    discountText?: string;
    discountCombination?: DiscountCombination[];
}

// Union type combining all discount configurations
export type DiscountConfig = PercentOrFixedDiscount | CheapestItemFreeDiscount | {
    type: 'freeShipping';
    label: string;
};

// State interface for the discount selector
export interface DiscountState {
    isEnabled: boolean;
    selectedType?: DiscountTypeEnum;
    config?: DiscountConfig;
}

export type TriggerType = "tags" | "specific_products" | "all_products"

export interface TriggerTags {
    type: "tags"
    tags: string[]
}

export interface SelectedProducts {
    label: string
    link: string
    img: string
}

export interface SpecificProducts {
    type: "specific_products"
    products?: SelectedProducts[]
}

export type Trigger = SpecificProducts | TriggerTags | {
    type: "all_products"
    label: string
}


export type OfferProductsType = "automatic" | "manual"

export interface OfferProductsAutomatic {
    type: "automatic"
    maxProducts: number
}

export interface ManualProducts {
    type: "products"
    products?: SelectedProducts[]
}

export interface SelectedTags {
    label: string
    link: string
    img: string
    tag: string
}

export interface ManualTags {
    type: "tags"
    tags?: SelectedTags[]
}

export interface OfferProductsManual {
    type: "manual"
    assets?: ManualTags[] | ManualProducts[]
}

export interface FrequentlyBoughtTogetherType {
    offerName: string
    trigger?: Trigger
    offerProducts?: OfferProductsManual | OfferProductsAutomatic
    enableDiscount?: DiscountState
    otherPriorities?: OtherPriorities
}




// Helper functions moved outside for reusability
export const getMockedData = () => ({
    offerName: "Summer Special Bundle",
    trigger: {
        type: "specific_products",
        products: [
            {
                label: "Blue Cotton T-Shirt",
                link: "/products/blue-cotton-tshirt",
                img: "/images/blue-tshirt.jpg"
            },
            {
                label: "Denim Jeans",
                link: "/products/denim-jeans",
                img: "/images/denim-jeans.jpg"
            }
        ]
    },
    offerProducts: {
        type: "manual",
        assets: [
            {
                type: "tags",
                tags: [
                    {
                        label: "Summer Collection T-Shirt",
                        link: "/collections/summer-tshirts",
                        img: "/images/summer-collection.jpg",
                        tag: "summer"
                    },
                    {
                        label: "Beach Wear",
                        link: "/collections/beach-wear",
                        img: "/images/beach-wear.jpg",
                        tag: "beach"
                    }
                ]
            },
            {
                type: "products",
                products: [
                    {
                        label: "Sunglasses",
                        link: "/products/sunglasses",
                        img: "/images/sunglasses.jpg"
                    },
                    {
                        label: "Beach Hat",
                        link: "/products/beach-hat",
                        img: "/images/beach-hat.jpg"
                    }
                ]
            }
        ]
    },
    enableDiscount: {
        isEnabled: true,
        selectedType: "percentOrFixed",
        config: {
            type: "percentOrFixed",
            label: "Summer Discount",
            discountValue: 20,
            discountText: "Save 20% on this bundle",
            discountCombination: [
                {
                    id: "combo1",
                    label: "Product Discounts",
                    isSelected: true
                },
                {
                    id: "combo2",
                    label: "Shipping Discounts",
                    isSelected: false
                }
            ]
        }
    },
    otherPriorities: {
        defaultWidgetTitle: "Frequently Bought Together",
        offerPriority: 1
    }
});