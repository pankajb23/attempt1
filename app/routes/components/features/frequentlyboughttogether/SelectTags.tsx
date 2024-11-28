import { Button, Text, Tag, ResourceItem } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useState, useCallback, useEffect } from "react";
import AddProductsModal from "../common/AddProductsModal";
import { useFormContext } from "react-hook-form";

function TagsUI(selectedIds, allTags, handleTagsChange) {
    const tags = allTags.filter(tag => selectedIds.has(tag.tagId));

    return (
        Array.from(tags).map(tag => (
            <Tag
                key={tag.tagId}
                onRemove={() => {
                    console.log("Removing tag " + tag.tagId + "selected Ids");
                    handleTagsChange(tag.tagId)
                }}><div>{tag.label}</div></Tag>
        ))
    );
}

export default function SelectTags({ allTags, tags }) {
    const shopify = useAppBridge();
    const { setValue } = useFormContext();
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(tags));
    

    useEffect(() => {
        setSelectedTags(new Set(tags));
    }, [tags]);

    const handleTagsChange = useCallback((tags: string | string[]) => {
        setSelectedTags(prevTags => {
            // If input is array, just replace all tags
            const newTags = new Set(prevTags);
            if (Array.isArray(tags)) {
                setValue('trigger.tags', tags);
                return new Set(tags);
            } else {
                if (newTags.has(tags)) {
                    newTags.delete(tags);
                } else {
                    newTags.add(tags);
                }
                setValue('trigger.tags', newTags);
                return newTags;
            }
        });
    }, []);

    const modalId = "my-modal";


    return (<>
        {/* @ts-ignore */}
        <Button variant="secondary" onClick={() => {
            shopify.modal.show(modalId)
        }}>
            <Text as="p" fontWeight="bold" variant="bodySm">Select Tags</Text>
        </Button>
        <br />
        {TagsUI(selectedTags, allTags, handleTagsChange)}
        <div style={{ marginTop: '10px' }} >
            <Text as="dd" variant="bodySm" tone="subdued"> The offer will be displayed on trigger product pages.</Text>
            <AddProductsModal allProducts={allTags} selectedProducts={selectedTags} addSelectedProducts={handleTagsChange} modalId={modalId} render={renderItem} />
        </div>
    </>);
}

function renderItem(item) {
    const { tagId, name } = item;
    console.log("Rendering item ", JSON.stringify(item));
    return (
        <ResourceItem
            id={tagId}
            onClick={() => { }}
        >
            <Text as="p" variant="bodySm">{name}</Text>
        </ResourceItem>
    );
}