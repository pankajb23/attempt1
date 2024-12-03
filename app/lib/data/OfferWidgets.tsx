import { useTranslation } from "react-i18next";
import { NavigationPage } from "../enums/NavigationPage"
export default function OfferWidgets() {
    const { t } = useTranslation();
    const widgets = [
        {
            id: "1",
            heading: t("offer.widget.frequently.bought.together.heading"),
            content: t("offer.widget.frequently.bought.together.content"),
            img: "https://lb-apps-media.s3.amazonaws.com/Selleasy-media/FBT.png",
            grps: "Product",
            offerType: NavigationPage.FREQUENTLY_BOUGHT_TOGETHER,
        },
        {
            id: "2",
            heading: t("offer.widget.products.addOn.heading"),
            content: t("offer.widget.products.addOn.content"),
            img: "https://lb-apps-media.s3.amazonaws.com/Selleasy-media/Product+Addon.png",
            grps: "Product",
            offerType: NavigationPage.PRODUCTS_ADDON,
        },
        {
            id: "3",
            heading: t("offer.widget.carts.addOn.heading"),
            content: t("offer.widget.carts.addOn.content"),
            img: "https://lb-apps-media.s3.amazonaws.com/Selleasy-media/Cart+Addon.png",
            grps: "Cart",
            badge: "Pop-up",
            offerType: NavigationPage.CART_ADDON,
        },
        {
            id: "4",
            heading: t("offer.widget.carts.upsell_downsell.heading"),
            content: t("offer.widget.carts.upsell_downsell.content"),
            img: "	https://lb-apps-media.s3.amazonaws.com/Selleasy-media/Funnel.png",
            grps: "Cart",
            badge: "Pop-up",
            offerType: NavigationPage.CART_UPSELL_DOWNSELL,
        },
        {
            id: "5",
            heading: t("offer.widget.post.purchase.upsell.heading"),
            content: t("offer.widget.post.purchase.upsell.content"),
            img: "https://lb-apps-media.s3.amazonaws.com/Selleasy-media/Post+Purchase.png",
            grps: "Post",
            offerType: NavigationPage.POST_PURCHASE_UPSELL,
        },
        {
            id: "6",
            heading: t("offer.widget.thankyou.addOn.heading"),
            content: t("offer.widget.thankyou.addOn.content"),
            img: "https://lb-apps-media.s3.amazonaws.com/Selleasy-media/Thankyou+page.png",
            grps: "Post",
            offerType: NavigationPage.THANK_YOU_ADD_ON,
        }
    ]

    return widgets;
}