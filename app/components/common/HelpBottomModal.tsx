import {
    Layout,
    InlineStack,
    Text,
    Button,
} from '@shopify/polaris';
import { ComposeIcon } from '@shopify/polaris-icons';
import { useTranslation } from 'react-i18next';

export default function HelpBottonModal() {
    const { t } = useTranslation();
    return (
        <>
            <Layout.Section>
                <InlineStack align='center' gap='200'>
                    <Text as="strong">
                        {t("assistance.help.need")}
                    </Text>
                    {/* @ts-ignore*/}
                    <Button icon={ComposeIcon} variant="plain">
                        <Text as="p">
                            {t("assistance.user.guide")}
                        </Text>
                    </Button>
                    <InlineStack align='center' blockAlign='center' gap='200'>
                        <Text as="p" variant='headingXs'>
                            {t("assistance.or")}
                        </Text>
                        {/* @ts-ignore*/}
                        <Button icon={ComposeIcon} variant="plain" textAlign='center'>
                            <Text as="p">
                                {t("assistance.setup")}
                            </Text>
                        </Button>
                    </InlineStack>
                </InlineStack>

            </Layout.Section>
        </>
    );
}