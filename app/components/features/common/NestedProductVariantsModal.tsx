import { LegacyCard, Text, useIndexResourceState, IndexTable, useBreakpoints, useSetIndexFiltersMode, Avatar, InlineGrid, IndexFiltersMode, IndexFilters } from '@shopify/polaris';
import type { IndexTableRowProps, IndexTableProps } from '@shopify/polaris';
import React, { Fragment, useState, useCallback, useMemo } from 'react';
import type { ProductTags } from 'app/lib/services/product/FetchProductService';
import { Modal } from '@shopify/app-bridge-react';
// import { SelectionType} from "@shopify/polaris/build/ts/src/utilities/index-provider";
// import { SelectionType } from "@shopify/polaris/build/ts/src/utilities/use-index-resource-state";

interface ProductRow extends ProductTags {
  position: number;
}

interface ProductGroup {
  id: string;
  position: number;
  products: ProductRow[];
}

interface Groups {
  [key: string]: ProductGroup;
}

export default function NestedProductVariantsModal({ allVariants, modalId }) {
  const [queryValue, setQueryValue] = useState<string | undefined>(undefined);
  const [selected, setSelected] = useState(0);
  const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering);

  const handleQueryValueChange = useCallback((value: string) => setQueryValue(value), []);

  const columnHeadings = [
    { title: 'Name', id: 'column-header--name' },
    {
      id: 'column-header--availability',
      title: 'availability',
    },
    {
      alignment: 'end',
      id: 'column-header--price',
      title: 'Price',
    },
  ];

  const groupRowsByGroupKey = useCallback((variants: ProductTags[], groupKey: keyof ProductTags, resolveId: (groupVal: string) => string) => {
    let position = -1;
    const groups: Groups = variants.reduce((groups: Groups, product: ProductTags) => {
      const groupVal: string = product[groupKey] as string;
      if (!groups[groupVal]) {
        position += 1;

        groups[groupVal] = {
          position,
          products: [],
          id: resolveId(groupVal),
        };
      }
      groups[groupVal].products.push({
        ...product,
        position: position + 1,
      });

      position += 1;
      return groups;
    }, {});

    return groups;
  }, []);

  const groupedAndFilteredProducts = useMemo(() => {
    const allGroups = groupRowsByGroupKey(allVariants, 'label', (color) => `color--${color.toLowerCase()}`);

    if (!queryValue) {
      return allGroups;
    }

    const searchTerm = queryValue.toLowerCase();
    const filteredGroups: Groups = {};

    Object.entries(allGroups).forEach(([color, group]) => {
      const filteredProducts = group.products.filter((product) => {
        const variantMatch = product.variant.toLowerCase().includes(searchTerm);
        // const priceMatch = product.priceVariation.toString().includes(searchTerm);
        // const labelMatch = product.label.toLowerCase().includes(searchTerm);
        // const currencyMatch = product.currency.toLowerCase().includes(searchTerm);

        return variantMatch;
      });

      if (filteredProducts.length > 0) {
        filteredGroups[color] = {
          ...group,
          products: filteredProducts,
        };
      }
    });

    return filteredGroups;
  }, [allVariants, queryValue, groupRowsByGroupKey]);

  const visibleProductsCount = useMemo(() => {
    return Object.values(groupedAndFilteredProducts).reduce((count, group) => count + group.products.length, 0);
  }, [groupedAndFilteredProducts]);

  const resourceName = {
    singular: 'product',
    plural: 'products',
  };

  const flattenedFilteredProducts = useMemo(() => {
    return Object.values(groupedAndFilteredProducts).flatMap((group) =>
      group.products.map((product) => ({
        id: product.pid, // Added id field required by useIndexResourceState
        ...product,
      }))
    );
  }, [groupedAndFilteredProducts]);

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(flattenedFilteredProducts);

  // Custom selection handler for parent rows
  const handleParentSelection = useCallback(
    (groupProducts: ProductRow[], isSelected: boolean) => {
      const productIds = groupProducts.map((product) => product.pid);
      const newSelection = isSelected ? selectedResources.filter((id) => !productIds.includes(id)) : [...new Set([...selectedResources, ...productIds])];
      handleSelectionChange(
        SelectionType.Range, // selectionType
        true, // isSelecting
        newSelection // selection
      );
    },
    [selectedResources, handleSelectionChange]
  );

  const rowMarkup = Object.keys(groupedAndFilteredProducts).map((color, index) => {
    const { products, position, id: productId } = groupedAndFilteredProducts[color];

    // Calculate parent selection state
    const productIds = products.map((p) => p.pid);
    const selectedCount = productIds.filter((id) => selectedResources.includes(id)).length;
    let parentSelected: IndexTableRowProps['selected'] = false;

    if (selectedCount === products.length) {
      parentSelected = true;
    } else if (selectedCount > 0) {
      parentSelected = 'indeterminate';
    }

    const handleParentClick = () => {
      handleParentSelection(products, parentSelected === true);
    };

    return (
      <Fragment key={productId}>
        <IndexTable.Row
          rowType="data"
          id={`Parent-${index}`}
          position={position}
          selected={parentSelected}
          onClick={handleParentClick}
          accessibilityLabel={`Select all products which have color ${color}`}
        >
          <IndexTable.Cell scope="col" id={productId}>
            <InlineGrid columns={14} gap="200" alignItems="center">
              <Avatar customer size="md" source={products[0].img} />
              <Text as="span" fontWeight="semibold" alignment="center">
                {color}
              </Text>
            </InlineGrid>
          </IndexTable.Cell>
          <IndexTable.Cell />
          <IndexTable.Cell />
        </IndexTable.Row>
        {products.map(({ pid, label, variant, priceVariation, currency, position }, rowIndex) => (
          <IndexTable.Row
            rowType="child"
            key={rowIndex}
            id={pid}
            position={position}
            selected={selectedResources.includes(pid)}
            onClick={() => {
              const newSelection = selectedResources.includes(pid) ? selectedResources.filter((id) => id !== pid) : [...selectedResources, pid];
              handleSelectionChange(
                SelectionType.Single, // selectionType
                true, // isSelecting
                newSelection // selection
              );
            }}
          >
            <IndexTable.Cell>
              <Text as="span" numeric>
                {variant}
              </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text as="span" alignment="end" numeric>
                {position}
              </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text as="span" numeric>
                {priceVariation} {currency}
              </Text>
            </IndexTable.Cell>
          </IndexTable.Row>
        ))}
      </Fragment>
    );
  });

  return (
    <Modal id={modalId} variant="large">
      <LegacyCard>
        <IndexFilters
          sortOptions={[]}
          sortSelected={[]}
          queryValue={queryValue}
          queryPlaceholder="Search by variant, price, color, or currency..."
          onQueryChange={handleQueryValueChange}
          onQueryClear={() => setQueryValue('')}
          primaryAction={null}
          tabs={[]}
          selected={selected}
          onSelect={setSelected}
          canCreateNewView={false}
          filters={[]}
          onClearAll={() => {}}
          mode={mode}
          setMode={setMode}
        />
        <IndexTable
          condensed={useBreakpoints().smDown}
          onSelectionChange={handleSelectionChange}
          selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
          resourceName={resourceName}
          itemCount={visibleProductsCount}
          headings={columnHeadings as IndexTableProps['headings']}
        >
          {rowMarkup}
        </IndexTable>
      </LegacyCard>
    </Modal>
  );
}
