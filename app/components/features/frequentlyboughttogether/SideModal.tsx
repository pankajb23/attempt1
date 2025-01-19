import {
  BlockStack,
  Card,
  Text,
  Divider,
  Image,
  Button,
} from '@shopify/polaris';
import { ExternalSmallIcon } from '@shopify/polaris-icons';

export default function SideModal({ heading, explanation, img }) {
  return (
    <Card roundedAbove="xs">
      <BlockStack gap="300">
        <Text as="h4" variant="headingSm">
          {' '}
          {heading}{' '}
        </Text>
        <Text as="dd" variant="bodySm" tone="subdued">
          {explanation}
        </Text>
        <Divider />
        <Image source={img} alt="Frequently bought together" />
        <Button icon={ExternalSmallIcon}>Customize widget</Button>
      </BlockStack>
    </Card>
  );
}
