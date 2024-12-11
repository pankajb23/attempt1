import { Tooltip, Text, Icon, InlineStack, Button, LegacyCard, ResourceItem, InlineGrid, Avatar, BlockStack, Tag } from "@shopify/polaris";
import { XSmallIcon, ViewIcon, DragHandleIcon } from '@shopify/polaris-icons';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { type ProductArray } from "./OfferProductRadioButtonModal";

function ListItem(props: { id: string; index: number; pid: string, title: string; img: string, variants: ProductArray[], handleProductChange: (pid: string) => void }) {
    const { id, index, pid, title, img, variants, handleProductChange } = props;
    return (
        <Draggable draggableId={id} index={index}>
            {(provided, snapshot) => {
                return (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                            ...provided.draggableProps.style,
                            listStyleType: "none"
                        }}
                    >
                        <ResourceItem id={id} url={''} >
                            <InlineGrid columns={["twoThirds", "oneThird"]}>
                                <InlineStack blockAlign="center" gap="100" direction="row">
                                    <div {...provided.dragHandleProps}>
                                        <Tooltip content="Drag to reorder list items">
                                            <Icon source={DragHandleIcon} />
                                        </Tooltip>
                                    </div>
                                    <Avatar size="md" source={img} />
                                    <div style={{ paddingLeft: '5px' }}>
                                        <BlockStack gap="100">
                                            <Text as="p">{title}</Text>
                                            <InlineStack>
                                                {variants?.map((variant, index) => {
                                                    return (
                                                        <Tag key={index}> {variant.title}</Tag>
                                                    );
                                                })}
                                            </InlineStack>
                                        </BlockStack>
                                    </div>
                                </InlineStack>
                                <InlineGrid columns={4} gap="0">
                                    <div></div>
                                    <div></div>
                                    <div>
                                        <Icon source={ViewIcon} />
                                    </div>
                                    <div>
                                        {/* @ts-ignore */}
                                        <Button variant="plain" icon={XSmallIcon} onClick={() => {
                                            handleProductChange(pid)
                                        }} />
                                    </div>
                                </InlineGrid>
                            </InlineGrid>
                        </ResourceItem>
                    </div>
                );
            }}
        </Draggable>
    );
}

export default function SelectedProducts({ selectedPids, handleDragEnd, handleProductChange }) {

    if (selectedPids === undefined || selectedPids.length === 0 || (selectedPids.length === 1 && selectedPids[0] === undefined)) {
        return null;
    }
    
    console.log("SelectedPids ", selectedPids);
    const getKey = (pid) => `draggable-${pid}`;

    return (
        <div style={{ marginTop: "10px" }}>
            <LegacyCard >
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="alpha-delta-omega">
                        {provided => {
                            return (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {selectedPids.map((item, index) => {
                                        console.log("item --> ", item);
                                        return (
                                            <ListItem
                                                key={getKey(item.pid)}
                                                id={getKey(item.pid)}
                                                pid={item.pid}
                                                index={index}
                                                title={item.title}
                                                img={item.img}
                                                variants={item.variants ?? null}
                                                handleProductChange={handleProductChange}
                                            />
                                        )
                                    })}
                                    {provided.placeholder}
                                </div>
                            );
                        }}
                    </Droppable>
                </DragDropContext>
            </LegacyCard>
        </div>
    );
};
