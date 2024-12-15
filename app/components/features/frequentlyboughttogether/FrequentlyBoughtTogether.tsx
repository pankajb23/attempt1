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
import { useStoreContext } from "app/lib/context/StoreContext";

export default function FrequentlyBoughtTogether({ navigateTo, offer = null }) {

    const { t } = useTranslation();

    const { modalsAndStoreId } = useStoreContext();
    const storeId = modalsAndStoreId.storeId;

    const onSubmit = async (data) => {
        console.log("data and shipping", offer?.offerId);
        const uri = offer?.offerId === undefined ? `api/offers/save?storeId=${storeId}` : `api/offers/update?storeId=${storeId}&offerId=${offer.offerId}`;
        const response = await fetch(`${uri}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            shopify.toast.show(`Failed to save offer ${data.offerName} successfully`, { duration: 2000, isError: true });
        }
        const content = await response.json();
        console.log("content", content);
        shopify.toast.show(`Offer ${data.offerName} saved successfully`, { duration: 1000 });
    };

    const onError = (errors) => { console.log("errors", errors); };
    const methods = useForm({
        defaultValues: offer?.offerContent ? JSON.parse(offer.offerContent): null
    });


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
                            onSave={methods.handleSubmit(onSubmit, onError)}
                        />
                    </BlockStack>
                    <div style={{ marginTop: "16px" }}>
                        <BlockStack gap='200'>
                            <Layout>
                                <Layout.Section>
                                    <BlockStack gap='300' >
                                        <OfferNameModal placeholder={t("pages.frequently_bought_together.offer_name.placeholder")} />
                                        <TriggerCheckbox offerType={'frequently_bought_together'} />
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