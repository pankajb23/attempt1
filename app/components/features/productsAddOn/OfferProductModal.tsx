import { Thumbnail, Card, Text, Checkbox, InlineStack, Button, Select, ResourceItem } from '@shopify/polaris';
import { useCallback } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Controller, useFormContext } from 'react-hook-form';
import NestedProductVariantsModal from '../common/NestedProductVariantsModal';
import SelectedProducts from '../common/SelectedProductsDraggable';
import AddProductsModal from '../common/AddProductsModal';

export default function OfferProductModal({ allProducts, allTags, allVariants }) {
  const { control, setValue, watch, getValues } = useFormContext();
  const shopify = useAppBridge();

  const modalId = 'my-product-modalId-draggable';
  const nestedModalId = 'my-nested-product-modalId';

  const manualOfferType = watch('offerProducts.assets.type') ?? 'products';
  const addOnType = watch('offerProducts.maxAddonsType') ?? 'anyNumberOfAddOns';
  const shouldShuffleProducts = watch('offerProducts.shouldShuffleProducts') ?? false;

  const selectedPidsArray = watch('offerProducts.assets.products') || [];

  // console.log("Selected pids " + selectedPidsArray);
  const selectedIds = new Set(selectedPidsArray);

  const handleProductChange = useCallback(
    (productIds: string | string[]) => {
      console.log('products', productIds);

      if (Array.isArray(productIds)) {
        setValue('offerProducts.assets.products', productIds);
      } else {
        const newSet = new Set(selectedPidsArray);
        newSet.has(productIds) ? newSet.delete(productIds) : newSet.add(productIds);
        setValue('offerProducts.assets.products', [...newSet]);
      }
    },
    [setValue, selectedPidsArray]
  );

  const handleDragEnd = useCallback(
    ({ source, destination }) => {
      if (!destination) return;
      const currentProducts = getValues('offerProducts.assets.products') || [];
      const newProducts = [...currentProducts];
      const [temp] = newProducts.splice(source.index, 1);
      newProducts.splice(destination.index, 0, temp);

      setValue('offerProducts.assets.products', newProducts);
    },
    [setValue]
  );

  const offerProductAddOnBlock =
    selectedPidsArray !== undefined && selectedPidsArray.length > 0 ? (
      <>
        <div style={{ marginTop: '10px' }}>
          <Controller
            control={control}
            name="offerProducts.maxAddonsType"
            defaultValue={addOnType}
            render={({ field: { onChange, value } }) => (
              <Select
                label={
                  <Text as="h5" variant="headingSm">
                    Maximum number of add-ons that can be selected
                  </Text>
                }
                options={[
                  {
                    label: 'Select any number of add-ons',
                    value: 'anyNumberOfAddOns',
                  },
                  {
                    label: 'Select atleast one add-on',
                    value: 'atleastOneAddOn',
                  },
                  {
                    label: 'Select a maximum of one add-on',
                    value: 'maximumOneAddOn',
                  },
                ]}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <Controller
            control={control}
            name="offerProducts.shouldShuffleProducts"
            defaultValue={shouldShuffleProducts}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                label={
                  <Text as="h5" variant="headingSm">
                    Randomize order each time
                  </Text>
                }
                checked={value}
                onChange={onChange}
                helpText={
                  <Text as="dd" variant="bodySm" tone="subdued">
                    Order of products will be shuffled randomly.
                  </Text>
                }
              />
            )}
          />
        </div>
      </>
    ) : null;
  const selectOption = [
    { label: 'by Products', value: 'products' },
    // { label: 'by Variants', value: 'tags' },
  ];

  const changingPlyCardAtTheBottom = () => {
    switch (manualOfferType) {
      case 'tags':
        return <NestedProductVariantsModal allVariants={allVariants} modalId={nestedModalId} />;
      case 'products':
        return <AddProductsModal allProducts={allProducts} selectedProducts={selectedIds} addSelectedProducts={handleProductChange} modalId={modalId} render={renderItem} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card>
        <Text as="h5" variant="headingSm">
          Offer products
        </Text>
        <div style={{ marginTop: '10px' }}>
          <InlineStack gap="200">
            {/** @ts-ignore */}
            <Button
              variant="secondary"
              onClick={() => {
                if (manualOfferType === 'tags') {
                  shopify.modal.show(nestedModalId);
                } else {
                  shopify.modal.show(modalId);
                }
              }}
            >
              <Text as="p" variant="bodyMd" fontWeight="bold">
                {' '}
                Select products
              </Text>
            </Button>
            <Controller
              name="offerProducts.assets.type"
              defaultValue={manualOfferType}
              control={control}
              render={({ field: { onChange, value } }) => <Select label={null} options={selectOption} onChange={onChange} value={value} />}
            />
          </InlineStack>
          <SelectedProducts
            selectedPids={[...selectedIds]}
            all={allProducts}
            selectedProductsPids={selectedPidsArray}
            handleDragEnd={handleDragEnd}
            handleProductChange={handleProductChange}
          />
        </div>
        {changingPlyCardAtTheBottom()}
        {offerProductAddOnBlock}
        <div style={{ marginTop: '14px' }}>
          <Text as="dd" variant="bodySm" tone="subdued">
            {' '}
            The offer will be displayed on trigger product pages.
          </Text>
        </div>
      </Card>
    </>
  );
}

function renderItem(item) {
  const { pid, name, img } = item;
  const thumbnail = <Thumbnail source={img} size="small" alt="img" />;
  return (
    <ResourceItem id={pid} media={thumbnail} onClick={() => {}}>
      <Text as="p" variant="bodySm">
        {name}
      </Text>
    </ResourceItem>
  );
}
