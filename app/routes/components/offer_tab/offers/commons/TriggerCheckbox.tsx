import { useState, useCallback } from "react";
import { Button, ChoiceList, Text, Card, Tag, LegacyCard, ResourceItem, ResourceList, Avatar, InlineStack, Icon, InlineGrid } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import AddProductTagsModal from "./AddProductTagsModal";
import AddProductsModal from "./AddProductsModal";
import { ViewIcon, XSmallIcon } from "@shopify/polaris-icons";




function TagsUI(selectedIds) {
    return (
        Array.from(selectedIds).map(tag => (
            <Tag
                key={tag}
                onRemove={() => selectedIds.delete(tag)}>{tag}</Tag>
        ))
    );
}

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
                                media={media}
                                url={''}
                                accessibilityLabel={`View details for ${name}`}
                            >
                                <InlineGrid columns={8}>
                                    <div style={{width:'90%'}}>
                                        <Text variant="bodyMd" fontWeight="medium" as="h3">
                                            {name}
                                        </Text>
                                    </div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div>
                                        <Icon source={ViewIcon} />
                                    </div>
                                    <div>
                                        <Icon source={XSmallIcon}/>
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

export default function TriggerCheckbox() {
    const [selected, setSelected] = useState<string[]>(["specific_products"]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [selectedPids, setSelectedPids] = useState<Set<string>>(new Set());

    const shopify = useAppBridge();

    const tagsArray = [
        "Accessory",
        "Archived",
        "Premium",
        "Snow",
        "Snowboard",
        "Sport",
        "Winter"
    ];

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

    const handleChange = useCallback((productId: string) => {
        console.log("change in productId " + productId)
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    }, []);

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

    const handleChoiceListChange = useCallback(
        (value: string[]) => setSelected(value),
        []
    );


    const title = <Text as="h6" variant="headingSm" fontWeight="semibold"> Offer is triggered for </Text>


    const choiceSuffix = () => {
        switch (selected[0]) {
            case "specific_products":
                return (<div style={{ marginTop: '6px' }}>
                    {/* @ts-ignore */}
                    <Button variant="secondary" onClick={() => shopify.modal.show('my-product-modal')}>
                        <Text as="h6" fontWeight="bold" variant="headingSm">Select products</Text>
                    </Button>
                    {SelectedProducts(pidsArray)}
                    <div style={{ marginTop: '10px' }}>
                        <Text as="dd" variant="bodySm" tone="subdued"> The offer will be displayed on trigger product pages.</Text>
                        <AddProductsModal tagsArray={productsArray} selectedIds={selectedPids} handleChange={handlePidChanges} modalId={"my-product-modalId"}/>
                    </div>
                </div>);
            case "tags":
                return (<>
                    {/* @ts-ignore */}
                    <Button variant="secondary" onClick={() => shopify.modal.show('my-modal')}>
                        <Text as="p" fontWeight="bold" variant="bodySm">Select Tags</Text>
                    </Button>
                    <br />
                    {TagsUI(selectedIds)}
                    <div style={{ marginTop: '10px' }} >
                        <Text as="dd" variant="bodySm" tone="subdued"> The offer will be displayed on trigger product pages.</Text>
                        <AddProductTagsModal tagsArray={tagsArray} selectedIds={selectedIds} handleChange={handleChange} />
                    </div>
                </>);
            case "all_products":
                return (<>
                    {/* @ts-ignore */}
                    <Text as="dd" variant="bodySm" tone="subdued"> The offer will be displayed on trigger product pages.</Text>
                </>);
        }
    }
    return (
        <>
            <Card>
                <Text as="h5" variant="headingSm">Trigger</Text>
                <div style={{ marginTop: '10px', paddingBottom: '2px' }}>
                    <ChoiceList
                        title={title}
                        choices={[
                            {
                                label: "Specific products",
                                value: "specific_products",
                            },
                            {
                                label: "Tags",
                                value: "tags",
                            },
                            {
                                label: "All products",
                                value: "all_products",
                            },
                        ]}
                        selected={selected}
                        onChange={handleChoiceListChange}
                    />
                </div>
                {choiceSuffix()}
            </Card>
        </>
    );
}
