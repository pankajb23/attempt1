import { BlockStack, Card, Text, Select, TextField, Checkbox } from "@shopify/polaris";
import { useFormContext, Controller } from "react-hook-form";


function AddAllCartAction() {
    const { watch, control } = useFormContext();

    const addAllCartActionOptions = [
        { label: "Redirect to cart", value: "redirectToCart" },
        { label: "Redirect to checkout", value: "redirectToCheckout" },
        { label: "Stay on the page", value: "stayOnPage" },
        { label: "Reload the page", value: "reloadPage" },
        { label: "Automatically click add to the cart button on the page", value: "autoClickAddToCart" }
    ];
    const isAddAllCartActionChecked = watch("settingsModal.addAllCartAction") ?? "redirectToCart";

    const cssSelectorForAddtoCart = watch("settingsModal.cssSelectorForAddtoCart");
    return (
        <>
            <Controller
                control={control}
                name="settingsModal.addAllCartAction"
                defaultValue={isAddAllCartActionChecked}
                render={({ field: { value, onChange } }) => (
                    <Select
                        label={<Text as="p" variant="bodySm" fontWeight="bold">Action after clicking add all to cart</Text>}
                        value={value}
                        onChange={onChange}
                        options={addAllCartActionOptions}
                        helpText={(() => {
                            switch (value) {
                                case "stayOnPage":
                                    return "Success message on add to cart translation will be shown";
                                case "reloadPage":
                                    return "Success message on add to cart translation will be shown before reload";
                                default:
                                    return "";
                            }
                        })()}
                    />
                )}
            />
            {
                <Controller
                    control={control}
                    name="settingsModal.cssSelectorForAddtoCart"
                    defaultValue={cssSelectorForAddtoCart}
                    render={({ field: { value, onChange } }) => (
                        <TextField
                            label={<Text as="p" variant="bodySm" fontWeight="bold">CSS selector for add to cart button</Text>}
                            value={value}
                            onChange={onChange}
                            autoComplete="off"
                            placeholder="Eg: .trigger-product-form .product-add-button"
                        />
                    )}
                />
            }
        </>
    );
}

function OfferProductClickAction() {
    const { watch, control } = useFormContext();
    const offerProductClickValue = watch("settingsModal.offerProductClickAction");

    return (
        <Controller
            control={control}
            name="settingsModal.offerProductClickAction"
            defaultValue={offerProductClickValue}
            render={({ field: { value, onChange } }) => (
                <Select
                    label={<Text as="p" variant="bodySm" fontWeight="bold">Offer product click action</Text>}
                    value={value}
                    onChange={onChange}
                    options={[
                        { label: "Pop-up product review", value: "popUpProductReview" },
                        { label: "Open product page", value: "openProductPage" },
                        { label: "Open product page in new tag", value: "openProductPageInNewTab" },
                    ]}
                />
            )}
        />
    );
}

function DiscountAction() {
    const { watch, control } = useFormContext();
    const offerProductClickValue = watch("settingsModal.discountAction");

    return (
        <Controller
            control={control}
            name="settingsModal.discountAction"
            defaultValue={offerProductClickValue}
            render={({ field: { value, onChange } }) => (
                <Select
                    label={<Text as="p" variant="bodySm" fontWeight="bold">Discount condition</Text>}
                    value={value}
                    onChange={onChange}
                    options={[
                        { label: "Apply discount when entire bundle is bought", value: "applyDiscountWhenEntireBundleIsBought" },
                        { label: "Apply discount when trigger and atleast 1 upsell is bought", value: "applyDiscountForMinUpsell" }
                    ]}
                />
            )}
        />
    );
}

function DisableWidget() {
    const { watch, control } = useFormContext();
    const isWidgetDisabled = watch("settingsModal.disableWidget");

    return (
        <Controller
            control={control}
            name="settingsModal.disableWidget"
            defaultValue={isWidgetDisabled}
            render={({ field: { value, onChange } }) => (
                <Checkbox
                    label={<Text as="p" variant="bodySm" fontWeight="bold">Disable Frequently bought together widget</Text>}
                    checked={value}
                    onChange={onChange}
                />
            )}
        />
    );
}
export default function SettingsModal() {
    const { watch, control } = useFormContext();

    const layoutStyle = watch("settingsModal.layoutStyle") ?? "cardLayout ";

    const layoutStyleOptions = [
        { label: "Card layout", value: "cardLayout" },
        { label: "Classic layout(Amazon style)", value: "amznLayout" },
    ];

    return (
        <Card roundedAbove="sm">
            <BlockStack gap="300">
                <Text as="p" variant="bodySm" fontWeight="bold">Settings</Text>
                <Controller
                    control={control}
                    name="settingsModal.layoutStyle"
                    defaultValue={layoutStyle}
                    render={({ field: { value, onChange } }) => (
                        <Select
                            label={<Text as="p" variant="bodySm" fontWeight="bold">Layout style</Text>}
                            value={value}
                            onChange={onChange}
                            options={layoutStyleOptions}
                        />
                    )}
                />
                <AddAllCartAction />
                <OfferProductClickAction />
                <DiscountAction />
                <DisableWidget />
            </BlockStack>
        </Card>
    )
}