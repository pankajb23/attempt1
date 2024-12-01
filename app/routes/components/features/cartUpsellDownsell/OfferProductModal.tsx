import { BlockStack, Card, Text, TextField, InlineGrid, Button, Select, InlineError, Divider, Tabs } from "@shopify/polaris"
import { useFormContext, Controller } from "react-hook-form"
import { useAppBridge } from "@shopify/app-bridge-react"
import ProductsModal from "./ProductsModal";
import { DeleteIcon } from '@shopify/polaris-icons';


function TextFieldModal({ property, heading, defaultValue, helpText, placeholder }) {
    const { watch, control } = useFormContext();
    const propertyValue = watch(property) ?? defaultValue;

    console.log("TextFieldModal property ", property, " propertyValue ", propertyValue, "helpText ", helpText, "defaultValue ", defaultValue, "placeholder ", placeholder);
    return (
        <Controller
            control={control}
            name={property}
            defaultValue={propertyValue}
            render={({ field: { value, onChange } }) => (
                <TextField
                    value={value}
                    placeholder={placeholder}
                    helpText={helpText}
                    onChange={onChange}
                    label={<Text as="p" variant="bodySm" fontWeight="bold">{heading}</Text>}
                    autoComplete="off"
                />
            )}
        />
    )
}

function CommonTextFieldModal({ index, discountDefaultValue }) {
    // console.log("CommonTextFieldModal index ", index, " discountDefaultValue ", discountDefaultValue);
    return (
        <BlockStack gap="300">
            <TextFieldModal
                property={`cart.offerTitle.${index}`}
                heading="Offer title"
                defaultValue="You might also like this."
                helpText={null}
                placeholder={null} />
            <TextFieldModal
                property={`cart.offerDiscountTitle.${index}`}
                heading="Offer discount title"
                defaultValue={discountDefaultValue}
                helpText={"This will override the offer title when there is a discount."}
                placeholder={null} />
            <TextFieldModal
                property={`cart.offerCustomDescription.${index}`}
                heading="Offer custom description"
                defaultValue={null}
                helpText={"This will override the default product description."}
                placeholder={"Eg: You might also like this"} />
        </BlockStack>
    );
}

function ProductSelection({ allProducts, index, modalId }) {
    const shopify = useAppBridge();
    const { control, watch, formState: { isSubmitted } } = useFormContext();
    const selectOption = [
        { label: 'by Products', value: 'products' },
        // { label: 'by Variants', value: 'tags' },
    ];
    const triggerType = watch(`offerProducts.assets.type.${index}`) ?? "products";
    const selectedProducts = watch(`offerProducts.assets.products.${index}`) || [];
    return (
        <>
            <BlockStack gap="100">
                <ProductsModal
                    allProducts={allProducts}
                    selectedProducts={selectedProducts}
                    property={`offerProducts.assets.products.${index}`}
                    modalId={modalId}
                />
                {
                    isSubmitted && triggerType === "products" && selectedProducts.length === 0 && (
                        <InlineError
                            message="Upsell product is required."
                            fieldID="trigger-type"
                        />
                    )
                }
                <InlineGrid columns={4} gap="200">
                    {/** @ts-ignore */}
                    <Button variant="secondary" onClick={() => {
                        // if (manualOfferType === "tags") {
                        //     shopify.modal.show(nestedModalId);
                        // } else {
                        shopify.modal.show(modalId);
                        // }
                    }}>
                        <Text as="p" variant="bodyMd" fontWeight="bold"> Select products</Text>
                    </Button>
                    {index === 0 &&
                        <Controller
                            name={`offerProducts.assets.type.${index}`}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    label={null}
                                    options={selectOption}
                                    onChange={onChange}
                                    value={value}
                                />
                            )}
                        />
                    }
                </InlineGrid>
            </BlockStack>
        </>
    );
}

function AddOfferButton({ index }) {
    return (
        <BlockStack gap="300">
            {/** @ts-ignore */}
            <Button variant="primary">
                <Text as="p" variant="bodyMd" fontWeight="bold"> Add offer</Text>
            </Button>
            <Text as="legend" variant="bodyMd" > Show another upsell or downsell when offer #{index} is accepted or declined. </Text>
        </BlockStack>
    );
}

function OfferBlock({ index, allProducts }) {
    const { watch, setValue } = useFormContext();
    const isOffserSet = watch(`offerProducts.${index}`);
    const isOfferAcceptedOrDeclined = watch(`offerProducts.${index}.isAcceptedOrDeclined`) ?? "accepted";

    const tabs = [
        { id: "accepted", content: <Text as="p" variant="bodySm" fontWeight="bold">{`If offer #${index} is accepted`}</Text> },
        { id: "denied", content: <Text as="p" variant="bodySm" fontWeight="bold">{`If offer #${index} is declined`}</Text> }
    ];
    return (
        <BlockStack gap="300">
            {
                !isOffserSet && (
                    <>

                        <InlineGrid columns="4">
                            {/** @ts-ignore */}
                            <Button variant="secondary" onClick={() => { setValue(`offerProducts.${index}`, true) }}>
                                <Text as="p" variant="bodyMd" fontWeight="bold"> Add next offer</Text>
                            </Button>
                        </InlineGrid>
                        <Text as="legend" variant="bodyMd" > Show another upsell or downsell when offer #{index} is accepted or declined. </Text>
                    </>
                )
            }
            {
                isOffserSet && (
                    <>
                        <InlineGrid columns="1fr auto" gap="200">
                            <Text as="h5" variant="headingMd" fontWeight="bold"> {`Offer #${index}A, #${index}B`}</Text>
                            <Button variant="plain" icon={DeleteIcon} onClick={() => { setValue(`offerProducts.${index}`, null) }} />
                        </InlineGrid>
                        <Tabs fitted tabs={tabs} selected={isOfferAcceptedOrDeclined ? 0 : 1} onSelect={(c) => {
                            console.log("Selected tab ", c);
                            setValue(`offerProducts.${index}.isAcceptedOrDeclined`, c);
                        }}> </Tabs>
                        <ProductSelection allProducts={allProducts} index={index} modalId={`my-modal-${index}`} />
                        <CommonTextFieldModal discountDefaultValue={"Offer unlocked, buy this for {{discount}} off!"} index={1} />
                    </>
                )
            }


            {index === 1 && <>
                <Divider />
                <OfferBlock index={index + 1} allProducts={allProducts} />
            </>
            }
        </BlockStack>
    );

}

export default function OfferProductModal({ allProducts }) {

    return (
        <Card roundedAbove="sm">
            <BlockStack gap="300">
                <Text as="h5" variant="headingMd" fontWeight="bold"> Offer products </Text>
                <Text as="h5" variant="bodySm" fontWeight="bold"> Offer #1 </Text>
                <Text as="h5" variant="bodySm" fontWeight="bold"> Offer product </Text>
                <ProductSelection allProducts={allProducts} index={0} modalId={"my-modal-0"} />
                <CommonTextFieldModal index={0} discountDefaultValue="You might also like this." />
                <Divider />
                <OfferBlock index={1} allProducts={allProducts} />
            </BlockStack>
        </Card>
    );
}