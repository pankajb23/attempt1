import {
  InlineStack,
  Button,
  Text,
  BlockStack,
  Card,
  Badge,
} from '@shopify/polaris';
import { useTranslation } from 'react-i18next';

export default function OfferWidget({
  header,
  message,
  img,
  navigateTo,
  offerType,
  badge,
}) {
  const { t } = useTranslation();

  const badgeLabel =
    badge !== undefined ? (
      <>
        <Badge tone="info">{badge}</Badge>
      </>
    ) : null;
  return (
    <div style={{ width: '320px' }}>
      <Card>
        <BlockStack gap="200">
          <InlineStack align="start" blockAlign="start">
            <img
              alt=""
              width="100%"
              height="1000%"
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              src={img}
            />
          </InlineStack>
          <BlockStack gap="200">
            <Text as="h5" fontWeight="bold" variant="headingMd">
              {header}
              {'     '}
              {badgeLabel}
            </Text>
            <Text as="p" variant="bodySm">
              {message}
            </Text>
          </BlockStack>
          <InlineStack align="end" blockAlign="end" gap="1000">
            <Button
              textAlign="end"
              variant="primary"
              onClick={() => navigateTo(offerType)}
            >
              {t('offer.widget.create')}
            </Button>
          </InlineStack>
        </BlockStack>
      </Card>
    </div>
  );
}
