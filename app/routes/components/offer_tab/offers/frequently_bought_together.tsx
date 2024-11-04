import {
    Layout,
    BlockStack,
    Card,
    Text,
    TextField,
} from "@shopify/polaris";
import TopHeadingBanner from "./top_heading_banner";
import { useState } from "react";
import TriggerCheckbox from "./commons/TriggerCheckbox";
import OfferProductRadioButtonModal from "./commons/OfferProductRadioButtonModal";
import DiscountModal from "./commons/DiscountsModal";
import OtherDetailsModal from "./commons/OtherDetailsModal";

export default function FrequentlyBoughtTogether({ onShowOfferPage }) {
    const [offerName, setOfferName] = useState('')
    const setOfferNameDef = (offer) => {
        console.log("Setting offer name " + offer + " from " + offerName);
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
                    <TopHeadingBanner onShowOfferPage={onShowOfferPage} heading={"Frequently Bought Together"} saveOfferButton={true} />
                </BlockStack>
                <div style={{ marginTop: "16px" }}>
                    <BlockStack gap='200'>
                        <Layout>
                            <Layout.Section>
                                <BlockStack gap='300' >
                                    <Card>
                                        <Text as="h5" variant="headingSm" fontWeight="bold">
                                            Offer name - for internal reference
                                        </Text>
                                        <TextField
                                            value={offerName}
                                            onChange={setOfferNameDef}
                                            placeholder="Eg: Upsell for mobile phones"
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