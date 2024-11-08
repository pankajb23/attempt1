import {
    Layout,
    BlockStack,
    Card,
    Text,
    TextField,
} from "@shopify/polaris";
import TopHeadingBanner from "../../common/TopHeaderBanner";
import { useState } from "react";
import TriggerCheckbox from "../../offer_tab/offers/commons/TriggerCheckbox";
import OfferProductRadioButtonModal from "../../offer_tab/offers/commons/OfferProductRadioButtonModal";
import DiscountModal from "../../offer_tab/offers/commons/DiscountsModal";
import OtherDetailsModal from "../../offer_tab/offers/commons/OtherDetailsModal";
import { useTranslation } from "react-i18next";

export default function FrequentlyBoughtTogether({ navigateTo }) {
    const { t } = useTranslation();

    const [offerName, setOfferName] = useState('')
    const setOfferNameDef = (offer) => {
        setOfferName(offerName);
    }

    const [isEnabledDiscountTicked, setIsEnabledDiscountedTicked] = useState<boolean>(false);
    const [selectedChoice, setSelectedChoice] = useState<string[]>([]);


    const handleSelectChoice = (selectedChoice: string[]) => {
        console.log("Selected choices " + selectedChoice);
        setSelectedChoice(selectedChoice);
    }

    const handleCheckedBoxChange = (enabledDiscountedTicked: boolean) => {
        setIsEnabledDiscountedTicked(enabledDiscountedTicked);
    }

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
                                            value={offerName}
                                            onChange={setOfferNameDef}
                                            placeholder={t("pages.frequently_bought_together.offer_name.placeholder")}
                                            label=""
                                            autoComplete="off"
                                        />
                                    </Card>
                                    <TriggerCheckbox />
                                    <OfferProductRadioButtonModal />
                                    <DiscountModal isEnabledDiscountTicked={isEnabledDiscountTicked} handleCheckedBoxChange={handleCheckedBoxChange} selectedChoice={selectedChoice} handleSelectedChoice={handleSelectChoice} />
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