import {
    Layout,
    BlockStack,
    Card,
    Text,
    TextField,
} from "@shopify/polaris";
import TopHeadingBanner from "../../common/TopHeaderBanner";
import TriggerCheckbox from "../common/TriggerCheckbox";
import OfferProductRadioButtonModal from "../common/OfferProductRadioButtonModal";
import DiscountModal from "../common/DiscountsModal";
import OtherDetailsModal from "../common/OtherDetailsModal";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { selectOfferName, updateOfferName } from "app/lib/reducers/offers/FrequentlyBoughtTogetherReducer";
import { useCallback } from "react";
import { ProductCallInitializer, selectIsLoading } from "app/lib/reducers/RestClientReducer";

export default function FrequentlyBoughtTogether({ navigateTo }) {
    const { t } = useTranslation();
    // const isLoading = useSelector(Initializer());
    ProductCallInitializer({ userId: "alpha-beta-gamma" });

    const isLoading = useSelector(state => selectIsLoading(state));
    
    const offerNameSelector = useSelector(selectOfferName);
    const dispatch = useDispatch();

    const offerNameChangeDispatcher = useCallback((name: string) => {
        dispatch(updateOfferName(name));
    }, [dispatch]);

    if (isLoading) {
        console.log("Loading rest client for the first time");
    } else {

        return (
            <>
                <Layout.Section>
                    <BlockStack >
                        <TopHeadingBanner navigateTo={navigateTo} heading={t("pages.frequently_bought_together.heading")} saveOfferButton={true} />
                    </BlockStack>
                    <div style={{ marginTop: "16px" }}>
                        <BlockStack gap='200'>
                            <Layout>
                                <Layout.Section>
                                    <BlockStack gap='300' >
                                        <Card>
                                            <Text as="h5" variant="headingSm" fontWeight="bold">
                                                {t("pages.frequently_bought_together.offer_name.heading")}
                                            </Text>
                                            <TextField
                                                value={offerNameSelector}
                                                onChange={offerNameChangeDispatcher}
                                                placeholder={t("pages.frequently_bought_together.offer_name.placeholder")}
                                                label=""
                                                autoComplete="off"
                                            />
                                        </Card>
                                        <TriggerCheckbox />
                                        <OfferProductRadioButtonModal />
                                        <DiscountModal />
                                        <OtherDetailsModal />
                                    </BlockStack>
                                </Layout.Section>
                                <Layout.Section variant="oneThird">
                                </Layout.Section>
                            </Layout>
                        </BlockStack>
                    </div>
                </Layout.Section>
            </>
        );
    }
}