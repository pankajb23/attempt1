import {
  IndexFilters,
  useSetIndexFiltersMode,
  Layout,
  BlockStack,
  EmptyState,
  Card,
  IndexTable,
  Text,
  useIndexResourceState,
  Badge,
  Button,
  useBreakpoints,
} from '@shopify/polaris';
import type { TabProps } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import '../../routes/css/Custom.css';
import { useTranslation } from 'react-i18next';
import { NavigationPage } from 'app/lib/enums/NavigationPage';
import { OfferTabs, OfferType } from 'app/lib/data/OfferPageVariations';
import { useStoreContext } from 'app/lib/context/StoreContext';
import type { Offer } from 'app/types';
import DeleteOffers from 'app/rest/DeleteOffers';
import ToggleOffers from 'app/rest/ToggleOffers';

function formatDate(isoDateString: string, locale = 'en-GB'): string {
  const date = new Date(isoDateString);
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function RowData({ allOffers, openPage }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalItems = allOffers.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPageOffers = allOffers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const ordersWithId = currentPageOffers.map((offer, index) => {
    // index here is 0-based for the current page, so for uniqueness you can offset by page
    const globalIndex = (page - 1) * pageSize + index;
    return { ...offer, id: globalIndex };
  });

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(ordersWithId);

  const areAllSelectedOnesActive =
    selectedResources.length === 0
      ? false
      : selectedResources
          .map(Number)
          .every(
            (idx) =>
              ordersWithId[idx - (page - 1) * pageSize].status === 'active'
          );

  const areAllSelectedOnesDraft =
    selectedResources.length === 0
      ? false
      : selectedResources
          .map(Number)
          .every(
            (idx) =>
              ordersWithId[idx - (page - 1) * pageSize].status === 'draft'
          );

  const selectedOfferIds = selectedResources
    .map(Number)
    .map((idx) => ordersWithId[idx - (page - 1) * pageSize].offerId);

  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

  const { modalsAndStoreId, setModalsAndStoreId } = useStoreContext();

  const promotedBulkOptions = [
    {
      content: 'Enable',
      onAction: async () =>
        await ToggleOffers(
          selectedOfferIds,
          'active',
          modalsAndStoreId.storeId,
          setModalsAndStoreId,
          handleSelectionChange
        ),
      disabled: areAllSelectedOnesActive,
    },
    {
      content: 'Disable',
      onAction: async () =>
        await ToggleOffers(
          selectedOfferIds,
          'draft',
          modalsAndStoreId.storeId,
          setModalsAndStoreId,
          handleSelectionChange
        ),
      disabled: areAllSelectedOnesDraft,
    },
    {
      content: 'Delete',
      onAction: async () => {
        console.log('Deleteing ids', [selectedOfferIds]);
        await DeleteOffers(
          selectedOfferIds,
          modalsAndStoreId.storeId,
          setModalsAndStoreId,
          handleSelectionChange
        );
      },
      disabled: false,
    },
  ];

  const wrap = (text: string) => {
    return (
      <Text as="p" variant="bodySm" fontWeight="bold">
        {text}
      </Text>
    );
  };

  const rowMarkup = ordersWithId.map((offer, index) => {
    return (
      <IndexTable.Row
        id={offer.id}
        key={offer.id}
        selected={selectedResources.includes(offer.id)}
        position={index}
        onClick={() => {
          openPage(NavigationPage.FREQUENTLY_BOUGHT_TOGETHER, offer);
        }}
      >
        <IndexTable.Cell>
          <BlockStack gap="100">
            {
              <div style={{ width: '30px' }}>
                <Button
                  dataPrimaryLink={true}
                  removeUnderline={false}
                  variant="monochromePlain"
                  fullWidth={false}
                  size="micro"
                  textAlign="left"
                >
                  {wrap(offer.offerName)}
                </Button>
              </div>
            }
            {
              <div>
                <Text as="p" variant="bodySm">
                  {' '}
                  {offer.offerType}
                </Text>
              </div>
            }
          </BlockStack>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone={offer.status === 'active' ? 'success' : 'info'}>
            {offer.status}
          </Badge>
        </IndexTable.Cell>
        {/* <IndexTable.Cell><Badge tone="info">{offer.offerType}</Badge></IndexTable.Cell> */}
        <IndexTable.Cell>{formatDate(offer.createdAt)}</IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  const hasNext = page < totalPages;
  const hasPrevious = page > 1;

  return (
    <IndexTable
      condensed={useBreakpoints().smDown}
      resourceName={resourceName}
      itemCount={allOffers.length}
      selectedItemsCount={
        allResourcesSelected ? 'All' : selectedResources.length
      }
      onSelectionChange={handleSelectionChange}
      promotedBulkActions={promotedBulkOptions}
      headings={[
        { title: wrap('Offer name'), id: 'OfferName' },
        { title: wrap('Status'), id: 'status' },
        // { title: wrap("Priority"), id: "priority" },
        { title: wrap('Created at'), id: 'createdAt' },
      ]}
      hasZebraStriping
      pagination={{
        hasNext: hasNext,
        onNext: () => setPage((prev) => prev + 1),
        hasPrevious: hasPrevious,
        onPrevious: () => setPage((prev) => prev - 1),
        label: `Page ${page} of ${totalPages}`,
      }}
      selectable
    >
      {rowMarkup}
    </IndexTable>
  );
}

export default function OfferTabModal({ onShowOfferPage, openPage }) {
  const { t } = useTranslation();

  const [filter, setFilter] = useState('All');

  const offerTypeKeys = Object.keys(OfferType) as Array<keyof typeof OfferType>;

  const tabs: TabProps[] = offerTypeKeys.map((key, index) => ({
    content: OfferType[key],
    index,
    onAction: () => {
      console.log(`Changing key ${key} and value ${OfferTabs[key]}`);
      setFilter(key);
    },
    id: `${key}-${index}`,
    panelID: `${key}-${index}`,
    isLocked: index === 0,
  }));

  const [selected, setSelected] = useState(0);
  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => {};

  const [queryValue, setQueryValue] = useState('');

  const handleFiltersQueryChange = useCallback(
    (value: string) => setQueryValue(value),
    []
  );

  // const styledTabs = tabs.map(tab => ({
  //     ...tab,
  //     content: <SafeSpan className='bold-text'>{tab.content}</SafeSpan>
  // }));

  const { modalsAndStoreId } = useStoreContext();
  // const allOffers: Offer[] = selected === 0? modalsAndStoreId.offers : modalsAndStoreId.offers.filter(offer => offer.offerType === OfferType[OfferType[selected]]);
  const allOffers: Offer[] = modalsAndStoreId.offers;

  {
    /** @ts-ignore */
  }
  return (
    <>
      <Layout.Section>
        <Card padding="100">
          <IndexFilters
            queryValue={queryValue}
            queryPlaceholder={
              'Search buy product name, trigger product or trigger tag'
            }
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
            onClearAll={() => {}}
            mode={mode}
            setMode={setMode}
            hideFilters
            filteringAccessibilityTooltip={t(
              'offer.dashboard.placeholder.accessiblity_tool_tip'
            )}
          />
          {allOffers.length > 0 ? (
            <RowData allOffers={allOffers} openPage={openPage} />
          ) : (
            <BlockStack align="center" inlineAlign="center">
              <EmptyState
                heading={t('offer.get_started')}
                action={{
                  content: t('offer.add'),
                  onAction: () => {
                    onShowOfferPage(NavigationPage.OFFER_PAGE_DASHBOARD);
                    // Add your action handler here
                  },
                }}
                image="https://lb-apps-media.s3.amazonaws.com/Selleasy-media/Empty_state.svg"
              >
                <p>{t('offer.display_products')}</p>
              </EmptyState>
            </BlockStack>
          )}
        </Card>
      </Layout.Section>
    </>
  );
}
