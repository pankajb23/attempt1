import { Layout, BlockStack, InlineStack, Text, Tabs } from '@shopify/polaris';

import { useState, useCallback } from 'react';

import TopHeadingBanner from '../../common/TopHeaderBanner';
import { OfferTabs } from 'app/lib/data/OfferPageVariations';
import { useTranslation } from 'react-i18next';
import WidgetManager from './widget/WidgetManager';

export default function OfferOnPageDashboard({ navigateTo }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    []
  );

  const boldTabs = OfferTabs.map((tab) => ({
    ...tab,
    content: (
      <Text variant="headingMd" as="h5" fontWeight="bold">
        {tab.content}
      </Text>
    ),
  }));

  return (
    <>
      <Layout.Section>
        <BlockStack>
          <TopHeadingBanner
            navigateTo={navigateTo}
            heading={t('offer.add')}
            saveOfferButton={false}
            onSave={() => {
              console.log('Should not have come here.');
            }}
          />
          <InlineStack>
            {/** @ts-ignore*/}
            <Tabs
              tabs={boldTabs}
              selected={selected}
              onSelect={handleTabChange}
            >
              <WidgetManager
                filter={OfferTabs[selected].id}
                navigateTo={navigateTo}
              />
            </Tabs>
          </InlineStack>
        </BlockStack>
      </Layout.Section>
    </>
  );
}
