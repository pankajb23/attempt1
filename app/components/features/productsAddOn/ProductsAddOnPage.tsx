import { Layout, BlockStack } from '@shopify/polaris';
import TopHeadingBanner from '../../common/TopHeaderBanner';
import TriggerCheckbox from '../common/TriggerCheckbox';
import DiscountModal from '../common/DiscountsModal';
import OtherDetailsModal from '../common/OtherDetailsModal';
import { useSelector } from 'react-redux';
import {
  ProductCallInitializer,
  selectIsLoading,
  selectPids,
  selectTags,
  selectVariants,
} from 'app/lib/reducers/RestClientReducer';
import { FormProvider, useForm } from 'react-hook-form';
import type { FrequentlyBoughtTogetherType } from '../../types/FrequentlyBoughtTogetherTypes';
import OfferNameModal from '../common/OfferNameModal';
import OfferProductModal from './OfferProductModal';
import { useTranslation } from 'react-i18next';
import SideModal from '../frequentlyboughttogether/SideModal';

export default function ProductsAddOnPage({ navigateTo }) {
  const methods = useForm<FrequentlyBoughtTogetherType>({
    defaultValues: {
      offerName: '',
      trigger: {},
      offerProducts: {},
      otherPriorities: {},
      discountState: {},
    },
  });

  const { t } = useTranslation();

  ProductCallInitializer({ userId: 'alpha-beta-gamma' });
  const productArrays = useSelector((state) => selectPids(state));
  const tags = useSelector((state) => selectTags(state));
  const isLoading = useSelector((state) => selectIsLoading(state));
  const productVariants = useSelector((state) => selectVariants(state));

  const onSubmit = async (data) => {
    console.log('data ', JSON.stringify(data));
  };

  const choices = [
    {
      label: t(
        'pages.frequently_bought_together.checkbox.percentOrFixed.heading'
      ),
      value: 'percentOrFixed',
    },
    // { label: t("pages.frequently_bought_together.checkbox.cheapestItemFree.heading"), value: 'cheapestItemFree' },
    {
      label: t(
        'pages.frequently_bought_together.checkbox.freeShipping.heading'
      ),
      value: 'freeShipping',
    },
  ];
  if (isLoading) {
    console.log('Loading rest client for the first time');
  } else {
    return (
      <>
        <Layout.Section>
          <FormProvider {...methods}>
            <BlockStack>
              <TopHeadingBanner
                navigateTo={navigateTo}
                heading="Products Add-On"
                saveOfferButton={true}
                onSave={methods.handleSubmit(onSubmit)}
              />
            </BlockStack>
            <div style={{ marginTop: '16px' }}>
              <BlockStack gap="200">
                <Layout>
                  <Layout.Section>
                    <BlockStack gap="300">
                      <OfferNameModal placeholder="E.g Add-ons for burger" />
                      <TriggerCheckbox
                        allProducts={productArrays}
                        tags={tags}
                      />
                      <OfferProductModal
                        allProducts={productArrays}
                        allTags={tags}
                        allVariants={productVariants}
                      />
                      <DiscountModal
                        allProducts={productArrays}
                        allTags={tags}
                        checkboxHelpText={
                          'The discount will be applied across all add-ons selected by the customer.'
                        }
                        choices={choices}
                        discountTextPlaceholder={
                          'Get {{discount}} off on add-ons.'
                        }
                      />
                      <OtherDetailsModal />
                    </BlockStack>
                  </Layout.Section>
                  <Layout.Section variant="oneThird">
                    <SideModal
                      heading={'Product add-ons'}
                      explanation={
                        'Product add-ons are displayed with checkboxes above the Add to Cart button.'
                      }
                      img={
                        'https://lb-apps-media.s3.amazonaws.com/Selleasy-media/Product+Addon.png'
                      }
                    />
                  </Layout.Section>
                </Layout>
              </BlockStack>
            </div>
          </FormProvider>
        </Layout.Section>
      </>
    );
  }
}
