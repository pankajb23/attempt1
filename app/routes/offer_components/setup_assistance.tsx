import {
    Layout,
    Text,
    Card,
    Button,
    BlockStack,
    InlineGrid,
    ButtonGroup,
} from "@shopify/polaris";
import { ComposeIcon, XIcon } from '@shopify/polaris-icons';


export default function SetupAssistance() {
    return (
        <>
            <Layout.Section variant="fullWidth">
                <Card roundedAbove="xl">
                    <BlockStack gap="200">
                        <InlineGrid columns="1fr auto">
                            <Text as="h4" variant="headingMd" fontWeight="bold">
                                Free setup assistance
                            </Text>
                            <Button variant="tertiary" icon={XIcon} onClick={() => { }} />
                        </InlineGrid>
                        <Text as="p" variant="bodyMd">
                            If you need support to get started or to setup offers, please reach out to our support team.
                        </Text>
                        <ButtonGroup gap="tight">

                            <Button icon={ComposeIcon} >
                                <Text as="strong" fontWeight="bold">
                                    Schedule a Zoom meeting
                                </Text>
                            </Button>

                            <Button variant="tertiary" >
                                <Text as="strong" fontWeight="bold">
                                    Get help
                                </Text>
                            </Button>
                        </ButtonGroup>
                    </BlockStack>
                </Card>
            </Layout.Section>
        </>
    );
}
