import { Tooltip, Thumbnail, Text, Icon, Card, InlineStack, Button, LegacyCard, ResourceList, ResourceItem, InlineGrid, Avatar } from "@shopify/polaris";
import { useState, useCallback, useRef, useEffect } from "react";
import { XSmallIcon, ViewIcon, DragHandleIcon } from '@shopify/polaris-icons';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function ListItem(props: { id: string; index: number; title: string; img: string }) {
    const { id, index, title, img } = props;
    console.log("ListItem ", id, index, title);
    const draggableId = id;

    console.log("Type:", typeof draggableId, "Value:", draggableId);
    return (
        <Draggable draggableId={id} index={index}>
            {(provided, snapshot) => {
                console.log("Provided index", JSON.stringify(provided.dragHandleProps), draggableId, index);
                return (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={
                            snapshot.isDragging
                                ? { background: "white", ...provided.draggableProps.style }
                                : provided.draggableProps.style
                        }
                    // style={{
                    //     // ...provided.draggableProps.style,
                    //     // ...(snapshot.isDragging ? { background: "white" } : {}),
                    //     // listStyleType: "none"
                    // }}
                    >
                        <ResourceItem id={id} url={''} >
                            <InlineStack blockAlign="center">
                                <div {...provided.dragHandleProps}>
                                    <Tooltip content="Drag to reorder list items">
                                        <Icon source={DragHandleIcon} />
                                    </Tooltip>
                                </div>
                                <Avatar size="md" source={img} />
                                <Text as="p">{title}</Text>
                            </InlineStack>
                        </ResourceItem>
                    </div>
                );
            }}
        </Draggable>
    );
}

export default function SelectedProducts({ selectedPids, all }) {
    // console.log("Selected products " + JSON.stringify(selectedPids) + " all products " + JSON.stringify(all));
    // const initializedRef = useRef(false);
    // useEffect(() => {
    //     if (!initializedRef.current) {
    //         initializedRef.current = true;
    //         // const selectedPidsSet = new Set(selectedPids);
    //         // const filtered = all.filter(pid => selectedPidsSet.has(pid.pid));
    //         console.log("Setting items once");
    //         // setItems(filtered);
    //     }
    // }, [selectedPids, all]);

    const selectedPidsSet = new Set(selectedPids);
    if (selectedPids === undefined || all === undefined || all.length === 0 || selectedPids.length === 0) {
        return null;
    }
    // console.log("Items size " + (all.length));
    // console.log("Items " + JSON.stringify(all) + " selectedPids " + JSON.stringify(selectedPids) + " all products " + all);

    const pids = all.filter(pid => selectedPidsSet.has(pid.pid));
    const [items, setItems] = useState(pids);

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const getKey = (pid) => `draggable-${pid}`;

    const handleDragEnd = useCallback(({ source, destination }) => {
        console.log("Available draggableIds:", items.map(item => getKey(item.pid)));

        // Log the specific source/destination IDs
        console.log("Source ID:", source);
        console.log("Destination ID:", destination);
        setItems(oldItems => {
            console.log("source and destination ", source, destination);
            const newItems = oldItems.slice(); // Duplicate
            const [temp] = newItems.splice(source.index, 1);
            newItems.splice(destination.index, 0, temp);
            return newItems;
        });
    }, []);

    console.log("Itemss ", items);
    return (
        <LegacyCard>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="root">
                    {provided => {
                        return (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {items.map((item, index) => {
                                    return (
                                        <ListItem
                                            key={item.pid}
                                            id={item.pid}
                                            index={index}
                                            title={item.label}
                                            img={item.img}
                                        />
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        );
                    }}
                </Droppable>
            </DragDropContext>
        </LegacyCard>
    );
};
