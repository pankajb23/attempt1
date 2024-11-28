import {
    Layout,
    BlockStack
} from "@shopify/polaris";
import TopHeadingBanner from "../../common/TopHeaderBanner";
import TriggerCheckbox from "../common/TriggerCheckbox";
import OtherDetailsModal from "../common/OtherDetailsModal";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ProductCallInitializer, selectIsLoading, selectPids, selectTags } from "app/lib/reducers/RestClientReducer";
import { FormProvider, useForm } from 'react-hook-form';
import type { FrequentlyBoughtTogetherType } from "../../types/FrequentlyBoughtTogetherTypes";
import OfferNameModal from "../common/OfferNameModal";
import UpsellFunnelDiscount from "./UpsellFunnelDiscount";
import SideModal from "../frequentlyboughttogether/SideModal";
import OfferProductModal from "./OfferProductModal";

export default function CartUpsellDownsellPage({ navigateTo }) {
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
    // const productVariants = useSelector(state => selectVariants(state));


    const onSubmit = async (data) => {
        console.log("data ", JSON.stringify(data));
    };

    
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
                                heading={"Cart upsell & downsell"}
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
                                            <OfferProductModal />
                                            <UpsellFunnelDiscount />
                                            <OtherDetailsModal />
                                        </BlockStack>

                                    </Layout.Section>
                                    <Layout.Section variant="oneThird">
                                        <SideModal heading={"Cart upsell & downsell"}
                                            explanation={"Cart upsell & downsell appears when the Checkout button is clicked."}
                                            img={"https://lb-apps-media.s3.amazonaws.com/Selleasy-media/Funnel.png"} />
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