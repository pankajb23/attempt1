import { useState, useCallback } from "react";
import { Button, ChoiceList, Text, Card, Checkbox, BlockStack, ResourceItem, LegacyFilters, ResourceList } from "@shopify/polaris";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";


function AddProductTagsModal({ tagsArray, selectedIds, handleChange }) {
    const [queryValue, setQueryValue] = useState<string | undefined>(undefined);
    const handleQueryValueRemove = useCallback(
        () => setQueryValue(undefined),
        []
    );

    const handleClearAll = useCallback(() => {
        handleQueryValueRemove();
    }, [handleQueryValueRemove]);

    const newDs = tagsArray.map(name => ({
        name,
        isChecked: selectedIds.has(name)
    }));

    const resourceName = {
        singular: "tag",
        plural: "tags",
    }
    const filterControl = (
        <LegacyFilters
            queryValue={queryValue}
            filters={[]}
            appliedFilters={[]}
            onQueryChange={setQueryValue}
            onQueryClear={handleQueryValueRemove}
            onClearAll={handleClearAll}
        ></LegacyFilters>
    );

    function renderItem(item) {
        const { name, isChecked } = item;

        return (
            <ResourceItem id={name} onClick={handleChange(name)}>
                <Checkbox
                    label={name}
                    checked={isChecked}
                    onChange={handleChange(name)}
                />
            </ResourceItem>
        );
    }

    return (
        <>
            <Modal id="my-modal" variant="large">
                <TitleBar title="Add product tags">
                    <button variant="primary">Add</button>
                </TitleBar>
                <BlockStack>
                    <ResourceList
                        resourceName={resourceName}
                        items={newDs}
                        renderItem={renderItem}
                        filterControl={filterControl}
                    />
                </BlockStack>
            </Modal>
        </>
    );
}

export default function TriggerCheckbox() {
    const [selected, setSelected] = useState<string[]>(["specific_products"]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
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

    const handleChange = useCallback((productId: string) => {
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
                    <Button variant="secondary" size="medium" onClick={() => shopify.modal.show('my-modal')}>
                        <Text as="h6" fontWeight="bold" variant="headingSm">Select products</Text>
                    </Button>
                    <div style={{ marginTop: '10px' }}>
                        <Text as="dd" variant="bodySm" tone="subdued"> The offer will be displayed on trigger product pages.</Text>
                        <AddProductTagsModal tagsArray={tagsArray} selectedIds={selectedIds} handleChange={handleChange} />
                    </div>
                </div>);
            case "tags":
                return (<>
                    {/* @ts-ignore */}
                    <Button variant="tertiary">
                        <Text as="p" fontWeight="bold" variant="bodySm">Select products</Text>
                    </Button>
                    <Text as="p" variant="bodySm" fontWeight="regular"> The offer will be displayed on trigger product pages.</Text>
                </>);
            case "all_products":
                return (<>
                    {/* @ts-ignore */}
                    <Text as="p" variant="bodySm" fontWeight="regular"> The offer will be displayed on trigger product pages.</Text>
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
