import { Button, Text, Tag } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useState, useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import type { ValueTags } from "app/lib/services/product/FetchProductService";
import { useStoreContext } from "app/lib/context/StoreContext";

function TagsUI(selectedTags, allTags, handleTagsChange) {
    const tags: ValueTags[] = allTags.filter(tag => selectedTags.has(tag.id));

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

export default function SelectTags({ tags }) {
    const shopify = useAppBridge();
    const { setValue } = useFormContext();
    const { modalsAndStoreId } = useStoreContext();
    const allTags = modalsAndStoreId.tags.map((tag, index) => {
        return {
            id: index,
            label: tag
        }
    });
    const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set(tags));

    const findTagsForIds = (ids: string[]) => {
        return allTags.filter(tag => ids.includes(tag.id)).map(tag => tag.label);
    }

    const findIdsForTags = (tags: string[]) => {
        return allTags.filter(tag => tags.includes(tag.label)).map(tag => tag.id);
    }

    useEffect(() => {
        setSelectedTagIds(new Set(tags));
    }, [tags]);

    const handleTagsChange = useCallback((tags: string | string[]) => {
        setSelectedTagIds(prevTags => {
            // If input is array, just replace all tags
            const newTags = new Set(prevTags);
            if (Array.isArray(tags)) {
                setValue('trigger.tags', findTagsForIds(tags));
                return new Set(tags);
            } else {
                if (newTags.has(tags)) {
                    newTags.delete(tags);
                } else {
                    newTags.add(tags);
                }
                setValue('trigger.tags', findTagsForIds([...newTags]));
                return newTags;
            }
        });
    }, []);


    return (<>
        {/* @ts-ignore */}
        <Button variant="secondary" onClick={async () => {
            const picker = await shopify.picker({
                heading: 'Select Tags',
                multiple: true,
                items: allTags.map(tag => {
                    return {
                        id: tag.id,
                        heading: tag.label,
                        selected: selectedTagIds.has(tag.id),
                    }
                })
            });
            const selected = await picker.selected;
            console.log("Selected tags", selected , "tags ", findTagsForIds(selected));

        }}>
            <Text as="p" fontWeight="bold" variant="bodySm">Select Tags</Text>
        </Button>
        <br />
        {TagsUI(selectedTagIds, allTags, handleTagsChange)}
        <div style={{ marginTop: '10px' }} >
            <Text as="dd" variant="bodySm" tone="subdued"> The offer will be displayed on trigger product pages.</Text>
        </div>
    </>);
}
