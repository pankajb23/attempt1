import {
    Layout,
    BlockStack
} from "@shopify/polaris";
import { useSelector } from "react-redux";
import { ProductCallInitializer, selectIsLoading, selectPids, selectTags, selectVariants } from "app/lib/reducers/RestClientReducer";
import { FormProvider, useForm } from 'react-hook-form';
import type { FrequentlyBoughtTogetherType } from "../types/FrequentlyBoughtTogetherTypes";
import TopHeadingBanner from "../common/TopHeaderBanner";
import OfferNameModal from "../features/common/OfferNameModal";
import TriggerCheckbox from "../features/common/TriggerCheckbox";
import SideModal from "../features/frequentlyboughttogether/SideModal";
import OfferProductRadioButtonModal from "../features/common/OfferProductRadioButtonModal";
import PostPurchaseDiscountModal from "./PostPurchaseDiscountModal";
import OtherDetails from "./OtherDetails";

export default function PostPurchaseUpsellPage({ navigateTo }) {

    const methods = useForm<FrequentlyBoughtTogetherType>({
        defaultValues: {
            offerName: "",
            trigger: {},
            offerProducts: {},
            otherPriorities: {},
            discountState: {}
        }
    });


    ProductCallInitializer({ userId: "alpha-beta-gamma" });
    const productArrays = useSelector(state => selectPids(state));
    const tags = useSelector(state => selectTags(state));
    const isLoading = useSelector(state => selectIsLoading(state));
    const productVariants = useSelector(state => selectVariants(state));


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
                                heading="Post purchase upsell"
                                saveOfferButton={true}
                                onSave={methods.handleSubmit(onSubmit)}
                            />
                        </BlockStack>
                        <div style={{ marginTop: "16px" }}>
                            <BlockStack gap='200'>
                                <Layout>
                                    <Layout.Section>
                                        <BlockStack gap='300' >
                                            <OfferNameModal placeholder="E.g Upsell for mobile phones" />
                                            <TriggerCheckbox allProducts={productArrays} tags={tags} />
                                            <OfferProductRadioButtonModal
                                                allProducts={productArrays}
                                                allTags={tags}
                                                allVariants={productVariants}
                                                toolTipContent="Post purchase upsell is an unobtrusive widget and automatic recommendations are available." />

                                            <PostPurchaseDiscountModal />
                                            <OtherDetails />
                                        </BlockStack>

                                    </Layout.Section>
                                    <Layout.Section variant="oneThird">
                                        <SideModal heading={"Post purchase upsell"}
                                            explanation={"Please note this feature is only with Shopify payments and credit card / PayPal Express and available in selected countries for stores that use Shopify’s payment gateway."}
                                            img={"https://lb-apps-media.s3.amazonaws.com/Selleasy-media/Post+Purchase.png"} />
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