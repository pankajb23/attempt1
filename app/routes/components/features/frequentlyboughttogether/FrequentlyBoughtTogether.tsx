import {
    Layout,
    BlockStack,
    Card,
    Text,
    TextField,
    InlineError
} from "@shopify/polaris";
import TopHeadingBanner from "../../common/TopHeaderBanner";
import TriggerCheckbox from "../common/TriggerCheckbox";
import OfferProductRadioButtonModal from "../common/OfferProductRadioButtonModal";
import DiscountModal from "../common/DiscountsModal";
import OtherDetailsModal from "../common/OtherDetailsModal";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ProductCallInitializer, selectIsLoading, selectPids, selectTags, selectVariants } from "app/lib/reducers/RestClientReducer";
import { Controller, FormProvider, useForm } from 'react-hook-form';
import type { FrequentlyBoughtTogetherType } from "../../types/FrequentlyBoughtTogetherTypes";

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

    const { control, formState: { errors } } = methods;

    const { t } = useTranslation();
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
                                            <Card>
                                                <Text as="h5" variant="headingSm" fontWeight="bold">
                                                    {t("pages.frequently_bought_together.offer_name.heading")}
                                                </Text>
                                                <Controller
                                                    name="offerName"
                                                    control={control}
                                                    rules={{ required: "Store name is required" }}
                                                    render={({ field: { value, onChange } }) => (
                                                        <div>
                                                            <TextField
                                                                label="Offer Name"
                                                                value={value}
                                                                id="offerName"
                                                                onChange={onChange}
                                                                placeholder={t("pages.frequently_bought_together.offer_name.placeholder")}
                                                                error={Boolean(errors.offerName)}
                                                                autoComplete="off"
                                                            />
                                                            {
                                                                errors.offerName && (
                                                                    <InlineError
                                                                        message={errors.offerName.message}
                                                                        fieldID="offerName"
                                                                    />
                                                                )
                                                            }
                                                        </div>
                                                    )}
                                                />
                                            </Card>
                                            <TriggerCheckbox allProducts={productArrays} tags={tags} />
                                            <OfferProductRadioButtonModal allProducts={productArrays} allTags={tags} allVariants={productVariants} />
                                            <DiscountModal allProducts={productArrays} allTags={tags} />
                                            <OtherDetailsModal />
                                        </BlockStack>

                                    </Layout.Section>
                                    <Layout.Section variant="oneThird">
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