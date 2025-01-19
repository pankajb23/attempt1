import {
  Layout,
  BlockStack,
  Card,
  Text,
  Button,
  ButtonGroup,
  Banner,
} from '@shopify/polaris';
import TopHeadingBanner from '../../common/TopHeaderBanner';
import TriggerCheckbox from '../common/TriggerCheckbox';
import OfferProductRadioButtonModal from '../common/OfferProductRadioButtonModal';
import DiscountModal from '../common/DiscountsModal';
import OtherDetailsModal from '../common/OtherDetailsModal';
import { useTranslation } from 'react-i18next';
import {
  FormProvider,
  useForm,
  useFormContext,
  Controller,
} from 'react-hook-form';
import SideModal from './SideModal';
import OfferNameModal from '../common/OfferNameModal';
import { useStoreContext } from 'app/lib/context/StoreContext';

function ToggleModal() {
  const { watch, control } = useFormContext();
  const property = 'status';
  const defaultValue = watch(property);

  // console.log("default value", defaultValue);
  return (
    <div style={{ marginBottom: '20px' }}>
      <Card>
        <BlockStack gap="200">
          <Text as="h6" fontWeight="bold">
            Offer is currently {defaultValue} mode
          </Text>
          <div>
            <Controller
              name="status"
              control={control}
              defaultValue={defaultValue}
              render={({ field: { value, onChange } }) => (
                <ButtonGroup variant="segmented">
                  <Button
                    pressed={value === 'active'}
                    onClick={() => onChange('active')}
                  >
                    Active
                  </Button>
                  <Button
                    pressed={!(value === 'active')}
                    onClick={() => onChange('draft')}
                  >
                    Draft
                  </Button>
                </ButtonGroup>
              )}
            />
          </div>
        </BlockStack>
      </Card>
    </div>
  );
}

// 9910709842

export default function FrequentlyBoughtTogether({ navigateTo, offer = null }) {
  const { t } = useTranslation();

  const { updateModalsAndStoreId, modalsAndStoreId } = useStoreContext();
  const storeId = modalsAndStoreId.storeId;

  const onSubmit = async (data) => {
    const uri =
      offer?.offerId === undefined
        ? `api/offers/save?storeId=${storeId}`
        : `api/offers/save?storeId=${storeId}&offerId=${offer.offerId}`;
    const response = await fetch(`${uri}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      shopify.toast.show(
        `Failed to save offer ${data.offerName} successfully`,
        { duration: 2000, isError: true }
      );
    } else {
      const content = await response.json();
      if (content.status === 200) {
        console.log('content', content);
        shopify.toast.show(`Offer ${data.offerName} saved successfully`, {
          duration: 1000,
        });

        if (content.status === 200) {
          if (offer?.offerId === undefined) {
            updateModalsAndStoreId({
              offers: [...modalsAndStoreId.offers, content.response],
            });
          } else {
            // console.log("All offers", JSON.stringify(modalsAndStoreId.offers));
            // modalsAndStoreId.offers.forEach(offer => {console.log("offer -->", offer)});
            const restOfTheOffers = modalsAndStoreId.offers.filter(
              (offer) => offer['offerId'] !== content.data.response.offerId
            );
            updateModalsAndStoreId({
              offers: [...restOfTheOffers, content.data.response],
            });
          }
        }
        console.log('All offers', JSON.stringify(modalsAndStoreId.offers));
      } else {
        shopify.toast.show(
          `Failed to save offer ${data.offerName} successfully`,
          { duration: 2000, isError: true }
        );
      }
    }
  };

  const onError = (errors) => {
    // console.log("errors", errors);
    shopify.toast.show(`Failed to save offer ${errors.offerName.message}`, {
      duration: 2000,
      isError: true,
    });
  };

  const offerContent = offer?.offerContent
    ? JSON.parse(offer.offerContent)
    : null;
  if (offer?.status != null) {
    offerContent['status'] = offer.status;
  }

  const methods = useForm({
    defaultValues: offer?.offerContent ? JSON.parse(offer.offerContent) : null,
    shouldUnregister: false,
  });

  const choices = [
    {
      label: t(
        'pages.frequently_bought_together.checkbox.percentOrFixed.heading'
      ),
      value: 'percentOrFixed',
    },
    {
      label: t(
        'pages.frequently_bought_together.checkbox.cheapestItemFree.heading'
      ),
      value: 'cheapestItemFree',
    },
    {
      label: t(
        'pages.frequently_bought_together.checkbox.freeShipping.heading'
      ),
      value: 'freeShipping',
    },
  ];

  console.log('offer status', offer);

  return (
    <>
      <Layout.Section>
        <FormProvider {...methods}>
          <BlockStack>
            <TopHeadingBanner
              navigateTo={navigateTo}
              heading={t('pages.frequently_bought_together.heading')}
              saveOfferButton={true}
              onSave={methods.handleSubmit(onSubmit, onError)}
            />
          </BlockStack>
          <div style={{ marginTop: '16px' }}>
            <BlockStack gap="200">
              <Layout>
                <Layout.Section>
                  <BlockStack gap="300">
                    <OfferNameModal
                      placeholder={t(
                        'pages.frequently_bought_together.offer_name.placeholder'
                      )}
                    />
                    <TriggerCheckbox offerType={'frequently_bought_together'} />
                    <OfferProductRadioButtonModal />
                    <DiscountModal
                      checkboxHelpText={t('pages.discount.enable.bundle')}
                      choices={choices}
                      discountTextPlaceholder={t(
                        'pages.frequently_bought_together.checkbox.percentOrFixed.placeholder'
                      )}
                    />
                  </BlockStack>
                </Layout.Section>
                <Layout.Section variant="oneThird">
                  {(offer != undefined || offer != null) && <ToggleModal />}
                  <OtherDetailsModal />
                  {/* <SideModal heading={"Frequently bought together"}
                                        explanation={"This widget is usually displayed below the Add to Cart button."}
                                        img={"https://lb-apps-media.s3.amazonaws.com/Selleasy-media/FBT.png"} /> */}
                </Layout.Section>
              </Layout>
            </BlockStack>
          </div>
        </FormProvider>
      </Layout.Section>
    </>
  );
}
