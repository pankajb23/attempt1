import {
    Layout,
    Text,
    Button,
    InlineGrid,
} from "@shopify/polaris";
import { OfferType } from "../offer_tab/offer_types_util";
import { useTranslation } from 'react-i18next';

export default function NavigationalHeader({ navigateToPage }) {
    const { t } = useTranslation();
    return (
        <>
            <Layout.Section >
                <InlineGrid columns="1fr auto">
                    <Text as="h3" variant="headingLg">
                        {t("offers.literal")}
                    </Text>
                    <Button
                        onClick={() => { navigateToPage(OfferType.BaseOfferPage) }}
                        accessibilityLabel="Export variants"
                        variant="primary">{t("offer.add")} </Button>
                </InlineGrid>
            </Layout.Section>
        </>
    )
}
