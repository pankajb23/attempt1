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
import { useSelector } from "react-redux";
import { ProductCallInitializer, selectIsLoading, selectPids, selectTags, selectVariants } from "app/lib/reducers/RestClientReducer";
import { FormProvider, useForm } from 'react-hook-form';
import type { FrequentlyBoughtTogetherType } from "../../types/FrequentlyBoughtTogetherTypes";
import SideModal from "./SideModal";
import OfferNameModal from "../common/OfferNameModal";

export default function FrequentlyBoughtTogether({ navigateTo }) {
    const methods = useForm<FrequentlyBoughtTogetherType>({
        defaultValues: {
            offerName: "",
            trigger: {},
            offerProducts: {},
            otherPriorities: {},
            discountState: {}
        }
    });

    const { t } = useTranslation();
    ProductCallInitializer({ userId: "alpha-beta-gamma" });
    const productArrays = useSelector(state => selectPids(state));
    const tags = useSelector(state => selectTags(state));
    const isLoading = useSelector(state => selectIsLoading(state));
    const productVariants = useSelector(state => selectVariants(state));


    const onSubmit = async (data) => {
        console.log("data ", JSON.stringify(data));
    };

    const choices = [
        { label: t("pages.frequently_bought_together.checkbox.percentOrFixed.heading"), value: 'percentOrFixed' },
        { label: t("pages.frequently_bought_together.checkbox.cheapestItemFree.heading"), value: 'cheapestItemFree' },
        { label: t("pages.frequently_bought_together.checkbox.freeShipping.heading"), value: 'freeShipping' }
    ];

    if (isLoading) {
        console.log("Loading rest client for the first time");
    } else {
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
                                            <TriggerCheckbox allProducts={productArrays} tags={tags} />
                                            <OfferProductRadioButtonModal allProducts={productArrays} allTags={tags} allVariants={productVariants} />
                                            <DiscountModal
                                                allProducts={productArrays}
                                                allTags={tags}
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
}