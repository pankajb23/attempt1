import { InlineStack, Button, Text, InlineGrid } from "@shopify/polaris";
import { ChevronLeftIcon } from "@shopify/polaris-icons";
import { NavigationPage } from "app/lib/enums/NavigationPage";
import { useTranslation } from "react-i18next";

export default function TopHeadingBanner({ navigateTo, heading, saveOfferButton,  onSave }) {
    const {t} =  useTranslation();
    return (
        <>
            <InlineStack blockAlign="baseline" gap="300">
                <div style={{ marginTop: "1px"}}>
                    <Button icon={ChevronLeftIcon} variant="tertiary" size="medium" onClick={() => navigateTo(NavigationPage.MAIN_PAGE)} />
                </div>
                <div style={{ width: '96%', paddingBottom:'4px', marginBottom:'4px' }}>
                    <InlineGrid columns="1fr auto">
                        <Text as="h5" variant="headingLg"> {heading}</Text>
                        {saveOfferButton ? <Button variant="primary" onClick={onSave}> {t("offer.save")}</Button> : null}
                    </InlineGrid>
                </div>
            </InlineStack>
        </>
    );
} 