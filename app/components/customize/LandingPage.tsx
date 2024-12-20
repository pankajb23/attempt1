import { type CardModalProps, CustomizePageType } from "../types/CustomizeTypes";
import { Layout, Text, Card, InlineGrid, Button } from "@shopify/polaris";

function CardModal({ modal, navigateToPage }) {
    return (
        <>
            <Layout.Section key={modal.modalType}>
                <Card roundedAbove="sm" >
                    <InlineGrid columns="1fr auto">
                        <Text variant="headingSm" fontWeight="bold" as="h5">{modal.heading}</Text>
                        {/** @ts-ignore */}
                        <Button variant="secondary" size="slim" onClick={() => { navigateToPage(modal.modalType) }}>
                            <Text variant="bodySm" as="p" fontWeight="bold">{modal.buttonContent}
                            </Text>
                        </Button>
                    </InlineGrid>
                    <div style={{ marginTop: '8px' }}>
                        <Text as="dd" variant="bodySm" tone="subdued">{modal.content}</Text>
                    </div>
                </Card>
            </Layout.Section>
        </>
    )
}


const CardModals: CardModalProps[] = [
    {
        heading: "Common settings and customizations",
        content: "Apply common styling or CSS to all widgets. To customize individual widgets, check the widget settings below.",
        buttonContent: "Edit settings",
        link: "",
        modalType: CustomizePageType.CommonSettings
    },
    {
        heading: "Frequently bought together",
        content: "Embedded widget on the product page.",
        buttonContent: "Edit widget",
        link: "",
        modalType: CustomizePageType.FrequentlyBoughtTogether
    },
    {
        heading: "Product add-ons",
        content: "Embedded widget on the product page.",
        buttonContent: "Edit widget",
        link: "",
        modalType: CustomizePageType.ProductAddOns
    },
    {
        heading: "Cart add-ons",
        content: "Pop-up widget on cart page.",
        buttonContent: "Edit widget",
        link: "",
        modalType: CustomizePageType.CartAddOns
    },
    {
        heading: "Upsell funnel",
        content: "Pop-up widget on cart page.",
        buttonContent: "Edit widget",
        link: "",
        modalType: CustomizePageType.UpsellFunnel
    },
    {
        heading: "Post purchase upsell",
        content: "Appears after payment capture, before thank you page. This works only when the customer pays using Shopify payment gateway Credit Card or PayPal Express.",
        buttonContent: "Edit widget",
        link: "",
        modalType: CustomizePageType.PostPurchaseUpsell
    },
    {
        heading: "Thank you page add-ons",
        content: "Embedded widget on the thank you page. This works with the standard thank you page and when checkout extensibility is not used.",
        buttonContent: "Edit widget",
        link: "",
        modalType: CustomizePageType.ThankYouPageAddOns
    }
];

export default function LandingPageModal({ navigateToPage }) {
    return (
        <Layout>
            <Layout.Section key={'alpha'}>
                <Text variant="headingLg" fontWeight="bold" as="h5">Customize</Text>
            </Layout.Section>
            {<CardModal key={CardModals[0].modalType} modal={CardModals[0]} navigateToPage={navigateToPage} />}
            <Layout.Section key={'beta'}>
                <Text variant="headingMd" fontWeight="bold" as="h6">Widgets</Text>
            </Layout.Section>
            {
                CardModals.slice(1).map((modal) => {
                    return <CardModal key={modal.modalType} modal={modal} navigateToPage={navigateToPage} />
                })
            }
        </Layout>
    );
}