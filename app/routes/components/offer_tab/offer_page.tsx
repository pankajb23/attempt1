import {
  Layout,
  BlockStack,
  InlineStack,
  Button,
  Text,
  Tabs
} from "@shopify/polaris";

import { useState, useCallback } from "react";

import { ChevronLeftIcon } from '@shopify/polaris-icons';
import WidgetManager from "./widget_manager";
import TopHeadingBanner from "./offers/top_heading_banner";

export default function OfferOnPage({ onShowOfferPage }) {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 'All',
      content: 'All widgets',
      accessibilityLabel: 'All customers',
      badge: '7',
      panelID: 'all-customers-content-1',
    },
    {
      id: 'Product',
      content: 'Product page',
      badge: '2',
      panelID: 'accepts-marketing-content-1',
    },
    {
      id: 'Cart',
      content: 'Cart page',
      badge: '2',
      panelID: 'repeat-customers-content-1',
    },
    {
      id: 'Post',
      content: 'Post purchase',
      badge: '2',
      panelID: 'prospects-content-1',
    },
    {
      id: 'more-1',
      content: 'More',
      badge: '1',
      panelID: 'prospects-content-1',
    },
  ];
  const boldTabs = (tabs.map(tab => ({
    ...tab,
    content: <Text variant="headingMd" as="h5" fontWeight="bold">{tab.content}</Text>
  })));

  return (
    <>
      <Layout.Section>
        <BlockStack>
          <TopHeadingBanner onShowOfferPage={onShowOfferPage} heading={"Add offer"} />
          <InlineStack>
            {/** @ts-ignore*/}
            <Tabs tabs={boldTabs} selected={selected} onSelect={handleTabChange}>
              <WidgetManager filter={tabs[selected].id} onShowOfferPage={onShowOfferPage} />
            </Tabs>
          </InlineStack>
        </BlockStack>
      </Layout.Section>
    </>
  );
}