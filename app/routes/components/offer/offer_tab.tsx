import {
    LegacyCard,
    IndexFilters,
    useSetIndexFiltersMode,
    Layout,
    BlockStack,
    // Text,
    EmptyState,
    // Spinner,
} from '@shopify/polaris';
import type { TabProps } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import SafeSpan from '../custom/SafeSpan';
// import empty_state from '../assets/Empty_state.svg';
import '../../css/Custom.css';
import { OfferType } from '../offer_tab/offer_types_util';

export default function IndexFiltersWithNoFiltersExample({ onShowOfferPage }) {
    const itemStrings =
        ['All',
            'Product page offers',
            'Cart page offers',
            'Post purchase offers',
        ];

    const tabs: TabProps[] = itemStrings.map((item, index) => ({
        content: item,
        index,
        onAction: () => { },
        id: `${item}-${index}`,
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

    const styledTabs = tabs.map(tab => ({
        ...tab,
        content: <SafeSpan className='bold-text'>{tab.content}</SafeSpan>
    }));


    {/** @ts-ignore */}
    return (
        <>
            <Layout.Section>
                <LegacyCard>
                    <IndexFilters
                        queryValue={queryValue}
                        queryPlaceholder="Search by product name, trigger product or trigger tag"
                        onQueryChange={handleFiltersQueryChange}
                        onQueryClear={() => setQueryValue('')}
                        cancelAction={{
                            onAction: onHandleCancel,
                            disabled: false,
                            loading: false,
                        }}
                        tabs={styledTabs}
                        selected={selected}
                        onSelect={setSelected}
                        canCreateNewView={false}
                        filters={[]}
                        appliedFilters={[]}
                        onClearAll={() => { }}
                        mode={mode}
                        setMode={setMode}
                        hideFilters
                        filteringAccessibilityTooltip="Search and Filter (F)"
                    />
                    <BlockStack align='center' inlineAlign="center">
                        <EmptyState
                            heading="Add an offer to get started"
                            action={{
                                content: 'Add offer',
                                onAction: () => {
                                    console.log('Add offer clicked');
                                    onShowOfferPage(OfferType.BaseOfferPage);
                                    // Add your action handler here
                                },
                            }}
                            image="https://lb-apps-media.s3.amazonaws.com/Selleasy-media/Empty_state.svg"
                        >
                            <p>Display products as upsell & cross-sell offers</p>
                        </EmptyState>
                    </BlockStack>
                </LegacyCard>

            </Layout.Section>
        </>
    );
}