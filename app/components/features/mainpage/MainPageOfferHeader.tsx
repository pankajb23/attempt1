import { Layout, Text, Button, InlineGrid } from '@shopify/polaris';
import { NavigationPage } from 'app/lib/enums/NavigationPage';
import { useTranslation } from 'react-i18next';

export default function MainPageOfferHeader({ navigateToPage }) {
  const { t } = useTranslation();
  return (
    <>
      <Layout.Section>
        <InlineGrid columns="1fr auto">
          <Text as="h3" variant="headingLg">
            {t('offers.literal')}
          </Text>
          <Button
            onClick={() => {
              navigateToPage(NavigationPage.OFFER_PAGE_DASHBOARD);
            }}
            accessibilityLabel="Export variants"
            variant="primary"
          >
            {t('offer.add')}{' '}
          </Button>
        </InlineGrid>
      </Layout.Section>
    </>
  );
}
