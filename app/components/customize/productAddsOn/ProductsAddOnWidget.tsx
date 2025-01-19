import { useForm, FormProvider } from 'react-hook-form';
import { Layout, BlockStack } from '@shopify/polaris';
import TopHeadingBanner from '../../common/TopHeaderBanner';
import {
  CustomizePageType,
  type TranslationComponent,
} from '../../types/CustomizeTypes';
import HelpBottonModal from '../../common/HelpBottomModal';
import PositionModal from './PositionalModal';
import StylingModal from '../frequentlyBoughtTogether/StylingModal';
import TextAndTranslations from '../frequentlyBoughtTogether/TextAndTranslations';
import SettingsModal from './SettingsModal';

export default function ProductsAddOnWidget({ navigateToPage }) {
  const methods = useForm({});

  const translationComponents: TranslationComponent[] = [
    {
      property: 'paw.textAndTranslations.widgetTitle',
      heading: 'Widget title',
      defaultValue: 'Select addons',
    },
    {
      property: 'pawpaw.textAndTranslations.discountLabel',
      heading: 'Discount label',
      defaultValue: '(Discount will apply at checkout)',
    },
    {
      property: 'paw.textAndTranslations.addButtonLabel',
      heading: 'Total button label',
      defaultValue: 'Add',
    },
    {
      property: 'paw.textAndTranslations.removeButtonLabel',
      heading: 'Remove button label',
      defaultValue: 'Remove',
    },
    {
      property: 'paw.textAndTranslations.viewButtonLabel',
      heading: 'View button label',
      defaultValue: 'View',
    },

    {
      property: 'paw.textAndTranslations.cartPageDiscount',
      heading: 'Cart page discount message',
      defaultValue: 'Your discount will be applied at checkout',
    },
  ];
  return (
    <Layout>
      <Layout.Section>
        <BlockStack gap="300">
          <FormProvider {...methods}>
            <TopHeadingBanner
              navigateTo={navigateToPage}
              heading={'Frequently bought together'}
              saveOfferButton={true}
              saveButtonContent="Save"
              onSave={() => {
                console.log('Not implemented');
              }}
              mainPage={CustomizePageType.LandingPage}
            />
            <PositionModal />
            <SettingsModal />
            <TextAndTranslations
              translationComponents={translationComponents}
            />
            <StylingModal />
          </FormProvider>
        </BlockStack>
      </Layout.Section>
      <Layout.Section variant="oneThird"> </Layout.Section>
      <HelpBottonModal />
    </Layout>
  );
}
