import {
    IndexFilters,
    useSetIndexFiltersMode,
    Layout,
    BlockStack,
    // Text,
    EmptyState,
    Card,
    IndexTable,
    Text,
    useIndexResourceState,
    Badge
    // Spinner,
} from '@shopify/polaris';
import type { TabProps } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import '../../routes/css/Custom.css';
import { useTranslation } from "react-i18next";
import { NavigationPage } from 'app/lib/enums/NavigationPage';
import { OfferTabs, OfferType } from 'app/lib/data/OfferPageVariations';
import { useStoreContext } from 'app/lib/context/StoreContext';

function RowData({ allOffers }) {
    const resourceName = {
        singular: "order",
        plural: "orders",
    };

    const promotedBulkOptions = [
        {
            content: "Enable",
            onAction: () => console.log("Enable"),
            disabled: false,
        },
        {
            content: "Disable",
            onAction: () => console.log("Disable"),
            disabled: false
        },
    ];

    const wrap = (text: string) => {
        return <Text as="p" variant="bodySm" fontWeight='bold'>{text}</Text>
    }

    const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(allOffers);

    const rowMarkup = allOffers.map(
        (
            { id, offerName, status, createdAt },
            index
        ) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell>
                    <BlockStack>
                        {wrap(offerName)}
                    </BlockStack>
                </IndexTable.Cell>
                <IndexTable.Cell><Badge tone="info">{status}</Badge></IndexTable.Cell>
                <IndexTable.Cell>{createdAt}</IndexTable.Cell>
            </IndexTable.Row >
        )
    );

    return (<IndexTable
        resourceName={resourceName}
        itemCount={allOffers.length}
        selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        promotedBulkActions={promotedBulkOptions}
        headings={[
            { title: wrap("Offer name"), id: "OfferName" },
            { title: wrap("Status"), id: "status" },
            { title: wrap("Priority"), id: "priority" },
            { title: wrap("Created at"), id: "createdAt" }
        ]}
        hasZebraStriping
        pagination={{
            hasNext: true,
            onNext: () => { },
            label: "Next",
        }}
    >
        {rowMarkup}
    </IndexTable>);
}
export default function OfferTabModal({ onShowOfferPage }) {
    const { t } = useTranslation();

    const [filter, setFilter] = useState("All");

    console.log("Filters ", filter);

    const offerTypeKeys = (Object.keys(OfferType) as Array<keyof typeof OfferType>);

    console.log("OfferTypeKeys", offerTypeKeys);
    const tabs: TabProps[] = offerTypeKeys.map((key, index) => ({
        content: OfferType[key],
        // icon: <div style={{width:'20px'}}><Text as="p" variant="bodySm" fontWeight="bold"> {OfferType[key]}</Text></div>,
        index,
        onAction: () => {
            console.log(`Changing key ${key} and value ${OfferTabs[key]}`)
            setFilter(key)
        },
        id: `${key}-${index}`,
        panelID: `${key}-${index}`,
        isLocked: index === 0,
    }));

    const [selected, setSelected] = useState(0);
    const { mode, setMode } = useSetIndexFiltersMode();
    const onHandleCancel = () => { };


    const [queryValue, setQueryValue] = useState('');

    const handleFiltersQueryChange = useCallback(
        (value: string) => setQueryValue(value),
        [],
    );

    // const styledTabs = tabs.map(tab => ({
    //     ...tab,
    //     content: <SafeSpan className='bold-text'>{tab.content}</SafeSpan>
    // }));

    const { modalsAndStoreId } = useStoreContext();
    const allOffers = modalsAndStoreId.offers;

    console.log("AllOffers", allOffers);

    {/** @ts-ignore */ }
    return (
        <>
            <Layout.Section>
                <Card padding="100">
                    <IndexFilters
                        queryValue={queryValue}
                        queryPlaceholder={"Search buy product name, trigger product or trigger tag"}
                        onQueryChange={handleFiltersQueryChange}
                        onQueryClear={() => setQueryValue('')}
                        cancelAction={{
                            onAction: onHandleCancel,
                            disabled: false,
                            loading: false,
                        }}
                        tabs={tabs}
                        onCreateNewView={null}
                        selected={selected}
                        onSelect={setSelected}
                        canCreateNewView={false}
                        filters={[]}
                        appliedFilters={[]}
                        onClearAll={() => { }}
                        mode={mode}
                        setMode={setMode}
                        hideFilters
                        filteringAccessibilityTooltip={t("offer.dashboard.placeholder.accessiblity_tool_tip")}
                    />{
                        allOffers.length > 0 ? <RowData allOffers={allOffers} /> :
                            <BlockStack align='center' inlineAlign="center">
                                <EmptyState
                                    heading={t("offer.get_started")}
                                    action={{
                                        content: t("offer.add"),
                                        onAction: () => {
                                            onShowOfferPage(NavigationPage.OFFER_PAGE_DASHBOARD);
                                            // Add your action handler here
                                        },
                                    }}
                                    image="https://lb-apps-media.s3.amazonaws.com/Selleasy-media/Empty_state.svg"
                                >
                                    <p>{t("offer.display_products")}</p>
                                </EmptyState>
                            </BlockStack>
                    }
                </Card>

            </Layout.Section>
        </>
    );
}
