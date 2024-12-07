import { Card, Text, ChoiceList, Icon, InlineStack, Tooltip, Button, Select, LegacyCard, ResourceList, ResourceItem, InlineGrid, Avatar } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { AlertCircleIcon, XSmallIcon, MenuVerticalIcon } from '@shopify/polaris-icons';
import { useAppBridge } from "@shopify/app-bridge-react";
import AddProductsModal from "../../../features/common/AddProductsModal";
import AutomaticOfferProducts from "../../../features/common/AutomaticOfferProducts";

function SelectedProducts(pids) {
    console.log("In selectedProducts " + JSON.stringify(pids));
    return (
        <div style={{ marginTop: '10px' }}>
            <LegacyCard>
                <ResourceList
                    resourceName={{ singular: 'product', plural: 'products' }}
                    items={pids}
                    renderItem={(item) => {
                        console.log("logging item " + item);
                        const { id, name, img, isArchived } = item;
                        const media = <Avatar customer size="md" name={name} source={img} />

                        return (

                            <ResourceItem
                                id={id}
                                name={name}
                                // media={media}
                                url={''}
                                accessibilityLabel={`View details for ${name}`}
                            >
                                <InlineGrid columns={10}>
                                    <div><Icon source={MenuVerticalIcon} /></div>
                                    <div>{media}</div>
                                    <div style={{ width: '90%' }}>
                                        <Text variant="bodyMd" fontWeight="medium" as="h3">
                                            {name}
                                        </Text>
                                    </div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div>
                                        <Icon source={XSmallIcon} />
                                    </div>
                                </InlineGrid>
                            </ResourceItem>
                            // <Icon source={ViewIcon} />
                        );
                    }}
                />
            </LegacyCard>
        </div>
    )
}

export default function OfferProductRadioButtonModal() {
    const [selected, setSelected] = useState<string[]>(['manual']);
    const handleChange = useCallback((value: string[]) => setSelected(value), []);

    const [selectProductOption, setProductOptionSelected] = useState<string | undefined>(undefined);

    const [selectedPids, setSelectedPids] = useState<Set<string>>(new Set());

    const [automaticOfferProductValueSet, setAutomaticOfferProductValueSet] = useState<number>(2);
    const handleAutomaticOfferProductValueSet = (n: number) => {
        setAutomaticOfferProductValueSet(n);
    }

    const shopify = useAppBridge();

    const modalId = "my-product-modalId-draggable";

    const handleSelectChange = useCallback(
        (value) => {
            console.log("changing to value " + value);
            setProductOptionSelected(value)
        },
        [],
    );

    const handlePidChanges = useCallback((pid: string) => {
        console.log("change in productId " + pid);
        console.log("Pids atm " + JSON.stringify(selectedPids));
        setSelectedPids((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(pid)) {
                newSet.delete(pid);
            } else {
                newSet.add(pid);
            }
            return newSet;
        });
    }, []);


    const productsArray = [
        {
            id: "1",
            name: "Product One",
            img: "https://cdn.shopify.com/s/files/1/0802/4820/9601/files/gift_card_200x200.png?v=1728612434",  // Using placeholder image
            isArchived: false
        },
        {
            id: "2",
            name: "Product Two",
            img: "https://cdn.shopify.com/s/files/1/0802/4820/9601/files/snowboard_wax_200x200.png?v=1728612437",
            isArchived: false
        },
        {
            id: "3",
            name: "Product Three",
            img: "https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4d41-83f0-7f417b02831d_200x200.jpg?v=1728612435",
            isArchived: true
        },
        {
            id: "4",
            name: "Product Four",
            img: "https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4a36-82af-50df8fe31c69_200x200.jpg?v=1728612434",
            isArchived: false
        },
        {
            id: "5",
            name: "Product Five",
            img: "https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4fe1-b333-0d1548b43c06_200x200.jpg?v=1728612436",
            isArchived: true
        }
    ];

    const pidsArray = productsArray.filter(pid => selectedPids.has(pid.name));

    const title = <Text as="p" variant="headingSm" fontWeight="bold">Select offer products</Text>
    const automaticOption =
        (
            <>
                <InlineStack>
                    <Text as="p" variant="bodyMd" > Automatic
                    </Text>
                    <Tooltip content="Frequently bought together is an unobtrusive widget and automatic recommendations are available.">
                        <Icon source={AlertCircleIcon} tone="base" />
                    </Tooltip>
                </InlineStack>
            </>
        );

    const selectOption = [
        { label: 'by Products', value: 'by_products' },
        { label: 'by Variants', value: 'by_variants' },
    ];

    const changingPlyCardAtTheBottom = (() => {
        switch (selected[0]) {
            case 'manual':
                return (
                    <AddProductsModal
                        tagsArray={productsArray}
                        selectedIds={selectedPids}
                        handleChange={handlePidChanges}
                        modalId={modalId}
                    />
                );
            case 'automatic':
                return (
                    <AutomaticOfferProducts
                        value={automaticOfferProductValueSet}
                        handleChange={handleAutomaticOfferProductValueSet}
                    />
                );
            default:
                return null;
        }
    });

    return (
        <>
            <Card>
                <Text as="h5" variant="headingSm">Offer products</Text>
                <div style={{ marginTop: '10px' }}>
                    <ChoiceList
                        title={title}
                        choices={[
                            { label: 'Manual', value: 'manual' },
                            { label: automaticOption, value: 'automatic' },
                        ]}
                        selected={selected}
                        onChange={handleChange}
                    />
                </div>
                {
                    (selected[0] === "manual") ? (
                        <div style={{ marginTop: '10px' }}>
                            <InlineStack gap='200'>
                                {/** @ts-ignore */}
                                <Button variant="secondary" onClick={() => {
                                    console.log("Clicking select products")
                                    shopify.modal.show(modalId);
                                }}>
                                    <Text as="p" variant="bodyMd" fontWeight="bold"> Select products</Text>
                                </Button>

                                <Select
                                    label={null}
                                    options={selectOption}
                                    onChange={handleSelectChange}
                                    value={selectProductOption}
                                />
                                {SelectedProducts(pidsArray)}
                            </InlineStack>
                        </div>
                    ) : null
                }
                {changingPlyCardAtTheBottom()}
                <div style={{ marginTop: '14px' }}>
                    <Text as="dd" variant="bodySm" tone="subdued"> The offer will be displayed on trigger product pages.</Text>
                </div>
            </Card>
        </>
    );
}