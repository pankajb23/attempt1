import {
  Layout,
  BlockStack,
  InlineStack,
  Text,
  Tabs
} from "@shopify/polaris";

import { useState, useCallback } from "react";

import WidgetManager from "./widget_manager";
import TopHeadingBanner from "./offers/top_heading_banner";
import { OfferTabs } from "app/lib/data/OfferPageVariations";

export default function OfferOnPage({ onShowOfferPage }) {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    [],
  );

  const boldTabs = (OfferTabs.map(tab => ({
    ...tab,
    content: <Text variant="headingMd" as="h5" fontWeight="bold">{tab.content}</Text>
  })));

  return (
    <>
      <Layout.Section>
        <BlockStack>
          <TopHeadingBanner onShowOfferPage={onShowOfferPage} heading={"Add offer"} saveOfferButton={false} />
          <InlineStack>
            {/** @ts-ignore*/}
            <Tabs tabs={boldTabs} selected={selected} onSelect={handleTabChange}>
              <WidgetManager filter={OfferTabs[selected].id} onShowOfferPage={onShowOfferPage} />
            </Tabs>
          </InlineStack>
        </BlockStack>
      </Layout.Section>
    </>
  );
}