import {
    Layout,
    BlockStack
} from "@shopify/polaris";
import TopHeadingBanner from "../../common/TopHeaderBanner";
import TriggerCheckbox from "../common/TriggerCheckbox";
import OfferProductRadioButtonModal from "../common/OfferProductRadioButtonModal";
import DiscountModal from "../common/DiscountsModal";
import OtherDetailsModal from "../common/OtherDetailsModal";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from 'react-hook-form';
import SideModal from "./SideModal";
import OfferNameModal from "../common/OfferNameModal";

export default function FrequentlyBoughtTogether({ navigateTo, id = null, data = null }) {
    const methods = useForm({
        defaultValues: {
            data
        }
    });

    const { t } = useTranslation();


    const onSubmit = async (data) => {
        console.log("data ", JSON.stringify(data));
    };

    const choices = [
        { label: t("pages.frequently_bought_together.checkbox.percentOrFixed.heading"), value: 'percentOrFixed' },
        { label: t("pages.frequently_bought_together.checkbox.cheapestItemFree.heading"), value: 'cheapestItemFree' },
        { label: t("pages.frequently_bought_together.checkbox.freeShipping.heading"), value: 'freeShipping' }
    ];


    return (
        <>
            <Layout.Section>
                <FormProvider {...methods}>
                    <BlockStack >
                        <TopHeadingBanner
                            navigateTo={navigateTo}
                            heading={t("pages.frequently_bought_together.heading")}
                            saveOfferButton={true}
                            onSave={methods.handleSubmit(onSubmit)}
                        />
                    </BlockStack>
                    <div style={{ marginTop: "16px" }}>
                        <BlockStack gap='200'>
                            <Layout>
                                <Layout.Section>
                                    <BlockStack gap='300' >
                                        <OfferNameModal placeholder={t("pages.frequently_bought_together.offer_name.placeholder")} />
                                        <TriggerCheckbox />
                                        <OfferProductRadioButtonModal />
                                        <DiscountModal
                                            checkboxHelpText={t("pages.discount.enable.bundle")}
                                            choices={choices}
                                            discountTextPlaceholder={t("pages.frequently_bought_together.checkbox.percentOrFixed.placeholder")} />
                                        <OtherDetailsModal />
                                    </BlockStack>

                                </Layout.Section>
                                <Layout.Section variant="oneThird">
                                    <SideModal heading={"Frequently bought together"}
                                        explanation={"This widget is usually displayed below the Add to Cart button."}
                                        img={"https://lb-apps-media.s3.amazonaws.com/Selleasy-media/FBT.png"} />
                                </Layout.Section>
                            </Layout>
                        </BlockStack>
                    </div>
                </FormProvider>
            </Layout.Section>
        </>
    );
}