import { InlineStack, Button, Text, InlineGrid, Badge } from '@shopify/polaris';
import { ChevronLeftIcon } from '@shopify/polaris-icons';
import { NavigationPage } from 'app/lib/enums/NavigationPage';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

interface TopHeadingBannerProps {
  navigateTo: (page: NavigationPage) => void;
  heading: string;
  saveOfferButton: boolean;
  onSave: () => void;
  saveButtonContent?: string;
  offerStatus?: string;
  mainPage?: any;
}

export default function TopHeadingBanner({
  navigateTo,
  heading,
  saveOfferButton,
  onSave,
  saveButtonContent = undefined,
  mainPage = NavigationPage.MAIN_PAGE,
}: TopHeadingBannerProps) {
  const { t } = useTranslation();
  const statusTones = {
    active: { tone: 'success', label: 'active' },
    draft: { tone: 'info', label: 'draft' },
  };

  const { watch } = useFormContext();
  const property = 'status';
  const offerStatus = watch(property);

  const headingName = 'offerName';
  const offerName = watch(headingName);

  const offerStatusBadge = statusTones[offerStatus] ? <Badge tone={statusTones[offerStatus].tone}>{statusTones[offerStatus].label}</Badge> : null;

  return (
    <>
      <InlineStack gap="300" wrap={false}>
        <div style={{ marginTop: '1px' }}>
          <Button icon={ChevronLeftIcon} variant="tertiary" size="medium" onClick={() => navigateTo(mainPage)} />
        </div>
        {/* this width is to spread button to the right most.  */}
        <div style={{ width: '100%', paddingBottom: '4px', marginBottom: '4px' }}>
          <InlineGrid columns="1fr auto">
            <Text as="h5" variant="headingLg">
              {' '}
              {offerName != null || offerName != undefined ? offerName : heading} {offerStatusBadge}
            </Text>
            {saveOfferButton ? (
              <Button variant="primary" onClick={onSave}>
                {' '}
                {saveButtonContent || t('offer.save')}
              </Button>
            ) : null}
          </InlineGrid>
        </div>
      </InlineStack>
    </>
  );
}
