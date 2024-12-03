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
import '../../css/Custom.css';
import MainPageOfferDashboardColumns from 'app/lib/data/MainPageDashboardColums';
import { useTranslation } from "react-i18next";
import { NavigationPage } from 'app/lib/enums/NavigationPage';

export default function OfferTabModal({ onShowOfferPage }) {
    const { t } = useTranslation();

    const itemStrings = MainPageOfferDashboardColumns();
    
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


    {/** @ts-ignore */ }
    return (
        <>
            <Layout.Section>
                <LegacyCard>
                    <IndexFilters
                        queryValue={queryValue}
                        queryPlaceholder={t("offer.dashboard.placeholder.query")}
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
                        filteringAccessibilityTooltip={t("offer.dashboard.placeholder.accessiblity_tool_tip")}
                    />
                    <BlockStack align='center' inlineAlign="center">
                        <EmptyState
                            heading= { t("offer.get_started")}
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
                </LegacyCard>

            </Layout.Section>
        </>
    );
}