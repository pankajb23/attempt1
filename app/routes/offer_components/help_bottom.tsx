import {
    Layout,
    // Text,
    InlineStack,
    Text,
    Button,
    // Spinner,
} from '@shopify/polaris';
import { ComposeIcon } from '@shopify/polaris-icons';
// import empty_state from '../assets/Empty_state.svg';
import '../css/Custom.css';

export default function HelpBotton() {
    return (
        <>
            <Layout.Section>
                <InlineStack align='center' gap='200'>
                    <Text as="strong">
                        Need help?
                    </Text>
                    {/* @ts-ignore*/}
                    <Button icon={ComposeIcon} variant="plain">
                        <Text as="p">
                            View user guide
                        </Text>
                    </Button>
                    <InlineStack align='center' blockAlign='center' gap='200'>
                        <Text as="p" variant='headingXs'>
                            or
                        </Text>
                        {/* @ts-ignore*/}
                        <Button icon={ComposeIcon} variant="plain" textAlign='center'>
                            <Text as="p">
                                Get free setup assistance
                            </Text>
                        </Button>
                    </InlineStack>

                </InlineStack>

            </Layout.Section>
        </>
    );
}