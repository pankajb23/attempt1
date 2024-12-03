import { Tooltip, Text, Icon, InlineStack, Button, LegacyCard, ResourceItem, InlineGrid, Avatar } from "@shopify/polaris";
import { XSmallIcon, ViewIcon, DragHandleIcon } from '@shopify/polaris-icons';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function ListItem(props: { id: string; index: number; pid: string, title: string; img: string, handleProductChange: (pid: string) => void }) {
    const { id, index, pid, title, img, handleProductChange } = props;
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
                                <InlineStack blockAlign="center">
                                    <div {...provided.dragHandleProps}>
                                        <Tooltip content="Drag to reorder list items">
                                            <Icon source={DragHandleIcon} />
                                        </Tooltip>
                                    </div>
                                    <Avatar size="md" source={img} />
                                    <Text as="p">{title}</Text>
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

export default function SelectedProducts({ selectedPids, all, selectedProductsPids, handleDragEnd, handleProductChange }) {

    if (selectedPids === undefined || all === undefined || all.length === 0 || selectedPids.length === 0) {
        return null;
    }

    const productMap = new Map(all.map(product => [product.pid, product]));
    const items = selectedProductsPids.map(pid => productMap.get(pid))

    const getKey = (pid) => `draggable-${pid}`;

    return (
        <div style={{ marginTop: "10px" }}>
            <LegacyCard >
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="alpha-delta-omega">
                        {provided => {
                            return (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {items.map((item, index) => {
                                        return (
                                            <ListItem
                                                key={getKey(item.pid)}
                                                id={getKey(item.pid)}
                                                pid={item.pid}
                                                index={index}
                                                title={item.label}
                                                img={item.img}
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
