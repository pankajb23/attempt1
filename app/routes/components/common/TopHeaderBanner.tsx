import { InlineStack, Button, Text, InlineGrid } from "@shopify/polaris";
import { ChevronLeftIcon } from "@shopify/polaris-icons";
import { NavigationPage } from "app/lib/enums/NavigationPage";
import { useTranslation } from "react-i18next";

interface TopHeadingBannerProps {
    navigateTo: (page: NavigationPage) => void;
    heading: string;
    saveOfferButton: boolean;
    onSave: () => void;
    saveButtonContent?: string;
    mainPage?: any;
}

export default function TopHeadingBanner({ navigateTo, heading, saveOfferButton, onSave, saveButtonContent=undefined, mainPage = NavigationPage.MAIN_PAGE }: TopHeadingBannerProps) {
    const { t } = useTranslation();
    return (
        <>
            <InlineStack gap="300">
                <div style={{ marginTop: "1px" }}>
                    <Button icon={ChevronLeftIcon} variant="tertiary" size="medium" onClick={() => navigateTo(mainPage)} />
                </div>
                {/* this width is to spread button to the right most.  */}
                <div style={{ width: '93%', paddingBottom: '4px', marginBottom: '4px' }}>
                    <InlineGrid columns="1fr auto">
                        <Text as="h5" variant="headingLg"> {heading}</Text>
                        {saveOfferButton ? <Button variant="primary" onClick={onSave}> {saveButtonContent || t("offer.save")}</Button> : null}
                    </InlineGrid>
                </div>
            </InlineStack>
        </>
    );
} 