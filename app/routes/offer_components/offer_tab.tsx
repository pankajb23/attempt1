import {
    LegacyCard,
    IndexFilters,
    useSetIndexFiltersMode,
    Layout,
    BlockStack,
    Icon,
    Box,
    Text,
} from '@shopify/polaris';
import type { TabProps } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import empty_state from '../assets/Empty_state.svg';

export default function IndexFiltersWithNoFiltersExample() {
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

    const Placeholder = ({ label = '', height = 'auto', width = 'auto' }) => {
        return (
            <div
                style={{
                    background: 'var(--p-color-border-interactive-subdued)',
                    height: height,
                    width: width,
                }}
            >
                <div
                    style={{
                        color: 'var(--p-color-text)',
                    }}
                >
                    <Text as="p">
                        {label}
                    </Text>
                </div>
            </div>
        );
    }

    const styledTabs = tabs.map(tab => ({
        ...tab, 
        content: <span style={{ fontWeight: 'bold'}}>{tab.content}</span>
    }));

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
                    <BlockStack align='center'>
                        <Icon source={empty_state} />
                        <Box>
                            <Placeholder label="Content inside a box" />
                        </Box>
                    </BlockStack>
                </LegacyCard>

            </Layout.Section>
        </>
    );
}