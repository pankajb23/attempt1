import {
  Layout,
  Text,
  Button,
  ButtonGroup,
  Card,
  BlockStack,
  InlineGrid,
} from '@shopify/polaris';
import { useTranslation } from 'react-i18next';
import { ComposeIcon, XSmallIcon } from '@shopify/polaris-icons';

export default function SetupAssistance({ setupShowAssistanceCb }) {
  const { t } = useTranslation();

  return (
    <>
      <Layout.Section variant="fullWidth">
        <Card>
          <BlockStack gap="200">
            <InlineGrid columns="1fr auto">
              <Text as="h4" variant="headingMd" fontWeight="bold">
                {t('offer.callout.heading')}
              </Text>
              <Button
                variant="tertiary"
                icon={XSmallIcon}
                onClick={() => setupShowAssistanceCb(false)}
              />
            </InlineGrid>
            <Text as="p" variant="bodyMd">
              {t('offer.callout.content')}
            </Text>
            <ButtonGroup gap="tight">
              {/** @ts-ignore */}
              <Button icon={ComposeIcon}>
                <Text as="strong" fontWeight="bold">
                  {' '}
                  {t('offer.callout.schedule_zoom')}
                </Text>
              </Button>
              {/** @ts-ignore */}
              <Button variant="tertiary">
                <Text as="strong" fontWeight="bold">
                  {t('offer.callout.get_help')}
                </Text>
              </Button>
            </ButtonGroup>
          </BlockStack>
        </Card>
      </Layout.Section>
    </>
  );
}
