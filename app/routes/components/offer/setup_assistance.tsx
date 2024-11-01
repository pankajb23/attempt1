import {
    Layout,
    Text,
    Card,
    Button,
    BlockStack,
    InlineGrid,
    ButtonGroup,
} from "@shopify/polaris";
import { ComposeIcon, XSmallIcon } from '@shopify/polaris-icons';


{/* @TODO try with CalloutCard */}
export default function SetupAssistance({showSetupAssistance}) {
    return (
        <>
            <Layout.Section variant="fullWidth">
                <Card roundedAbove="xl">
                    <BlockStack gap="200">
                        <InlineGrid columns="1fr auto">
                            <Text as="h4" variant="headingMd" fontWeight="bold">
                                Free setup assistance
                            </Text>
                            <Button variant="tertiary" icon={XSmallIcon} onClick={() => showSetupAssistance(false)} />
                        </InlineGrid>
                        <Text as="p" variant="bodyMd">
                            If you need support to get started or to setup offers, please reach out to our support team.
                        </Text>
                        <ButtonGroup gap="tight">
                            {/*  @ts-ignore */}
                            <Button icon={ComposeIcon} >
                                <Text as="strong" fontWeight="bold">
                                    Schedule a Zoom meeting
                                </Text>
                            </Button>
                            {/*  @ts-ignore */}
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
