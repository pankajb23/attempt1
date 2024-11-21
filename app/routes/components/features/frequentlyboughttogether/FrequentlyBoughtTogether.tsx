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
import { useSelector } from "react-redux";
import { ProductCallInitializer, selectIsLoading, selectPids, selectTags, selectVariants } from "app/lib/reducers/RestClientReducer";
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { FrequentlyBoughtTogetherType } from "../../types/FrequentlyBoughtTogetherTypes";

export default function FrequentlyBoughtTogether({ navigateTo }) {
    const methods = useForm<FrequentlyBoughtTogetherType>({
        defaultValues: {
            offerName: "",
            trigger: {
                type: "all_products",
                label: "All Products"
            },
            offerProducts: {
                type: "automatic",
                maxProducts: 3
            }
        }
    });

    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = methods;

    const { t } = useTranslation();
    // const isLoading = useSelector(Initializer());
    ProductCallInitializer({ userId: "alpha-beta-gamma" });
    const productArrays = useSelector(state => selectPids(state));
    const tags = useSelector(state => selectTags(state));
    const isLoading = useSelector(state => selectIsLoading(state));
    const productVariants = useSelector(state => selectVariants(state));

    // const offerNameSelector = useSelector(selectOfferName);
    // const dispatch = useDispatch();

    // const offerNameChangeDispatcher = useCallback((name: string) => {
    //     dispatch(updateOfferName(name));
    // }, [dispatch]);

    if (isLoading) {
        console.log("Loading rest client for the first time");
    } else {
        console.log("Rest client already loaded " + JSON.stringify(productArrays) + " tags " + JSON.stringify(tags));
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
                                        <FormProvider {...methods}>
                                            <Card>
                                                <Text as="h5" variant="headingSm" fontWeight="bold">
                                                    {t("pages.frequently_bought_together.offer_name.heading")}
                                                </Text>
                                                <Controller
                                                    name="offerName"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            label="Offer Name"
                                                            value={value}
                                                            onChange={onChange}
                                                            placeholder={t("pages.frequently_bought_together.offer_name.placeholder")}
                                                            error={errors.offerName?.message}
                                                            autoComplete="off"
                                                        />
                                                    )}
                                                />
                                            </Card>
                                            <TriggerCheckbox allProducts={productArrays} tags={tags} />
                                            <OfferProductRadioButtonModal allProducts={productArrays} allTags={tags} allVariants={productVariants}/>
                                            <DiscountModal allProducts={productArrays} allTags={tags} />
                                            <OtherDetailsModal productArray={productArrays} tags={tags} />
                                        </FormProvider>
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