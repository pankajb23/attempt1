<<<<<<< HEAD
import { useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();

  const product = responseJson.data!.productCreate!.product!;
  const variantId = product.variants.edges[0]!.node!.id!;

  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );

  const variantResponseJson = await variantResponse.json();

  return json({
    product: responseJson!.data!.productCreate!.product,
    variant:
      variantResponseJson!.data!.productVariantsBulkUpdate!.productVariants,
  });
};

export default function Index() {
  const fetcher = useFetcher<typeof action>();

  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);
  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  return (
    <Page>
      <TitleBar title="Remix app template">
        <button variant="primary" onClick={generateProduct}>
          Generate a product
        </button>
      </TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Congrats on creating a new Shopify app 🎉
                  </Text>
                  <Text variant="bodyMd" as="p">
                    This embedded app template uses{" "}
                    <Link
                      url="https://shopify.dev/docs/apps/tools/app-bridge"
                      target="_blank"
                      removeUnderline
                    >
                      App Bridge
                    </Link>{" "}
                    interface examples like an{" "}
                    <Link url="/app/additional" removeUnderline>
                      additional page in the app nav
                    </Link>
                    , as well as an{" "}
                    <Link
                      url="https://shopify.dev/docs/api/admin-graphql"
                      target="_blank"
                      removeUnderline
                    >
                      Admin GraphQL
                    </Link>{" "}
                    mutation demo, to provide a starting point for app
                    development.
                  </Text>
                </BlockStack>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">
                    Get started with products
                  </Text>
                  <Text as="p" variant="bodyMd">
                    Generate a product with GraphQL and get the JSON output for
                    that product. Learn more about the{" "}
                    <Link
                      url="https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate"
                      target="_blank"
                      removeUnderline
                    >
                      productCreate
                    </Link>{" "}
                    mutation in our API references.
                  </Text>
                </BlockStack>
                <InlineStack gap="300">
                  <Button loading={isLoading} onClick={generateProduct}>
                    Generate a product
                  </Button>
                  {fetcher.data?.product && (
                    <Button
                      url={`shopify:admin/products/${productId}`}
                      target="_blank"
                      variant="plain"
                    >
                      View product
                    </Button>
                  )}
                </InlineStack>
                {fetcher.data?.product && (
                  <>
                    <Text as="h3" variant="headingMd">
                      {" "}
                      productCreate mutation
                    </Text>
                    <Box
                      padding="400"
                      background="bg-surface-active"
                      borderWidth="025"
                      borderRadius="200"
                      borderColor="border"
                      overflowX="scroll"
                    >
                      <pre style={{ margin: 0 }}>
                        <code>
                          {JSON.stringify(fetcher.data.product, null, 2)}
                        </code>
                      </pre>
                    </Box>
                    <Text as="h3" variant="headingMd">
                      {" "}
                      productVariantsBulkUpdate mutation
                    </Text>
                    <Box
                      padding="400"
                      background="bg-surface-active"
                      borderWidth="025"
                      borderRadius="200"
                      borderColor="border"
                      overflowX="scroll"
                    >
                      <pre style={{ margin: 0 }}>
                        <code>
                          {JSON.stringify(fetcher.data.variant, null, 2)}
                        </code>
                      </pre>
                    </Box>
                  </>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    App template specs
                  </Text>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Framework
                      </Text>
                      <Link
                        url="https://remix.run"
                        target="_blank"
                        removeUnderline
                      >
                        Remix
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Database
                      </Text>
                      <Link
                        url="https://www.prisma.io/"
                        target="_blank"
                        removeUnderline
                      >
                        Prisma
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Interface
                      </Text>
                      <span>
                        <Link
                          url="https://polaris.shopify.com"
                          target="_blank"
                          removeUnderline
                        >
                          Polaris
                        </Link>
                        {", "}
                        <Link
                          url="https://shopify.dev/docs/apps/tools/app-bridge"
                          target="_blank"
                          removeUnderline
                        >
                          App Bridge
                        </Link>
                      </span>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        API
                      </Text>
                      <Link
                        url="https://shopify.dev/docs/api/admin-graphql"
                        target="_blank"
                        removeUnderline
                      >
                        GraphQL API
                      </Link>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Next steps
                  </Text>
                  <List>
                    <List.Item>
                      Build an{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/getting-started/build-app-example"
                        target="_blank"
                        removeUnderline
                      >
                        {" "}
                        example app
                      </Link>{" "}
                      to get started
                    </List.Item>
                    <List.Item>
                      Explore Shopify’s API with{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
                        target="_blank"
                        removeUnderline
                      >
                        GraphiQL
                      </Link>
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
=======
import {
  Page,
  Layout,
  BlockStack,
} from "@shopify/polaris";
import OfferTabModal from './components/offer/OfferTabModal';
import SetupAssistance from "./components/offer/SetupAssistance";
import HelpBottonModal from "./components/common/HelpBottomModal";
import MainPageOfferHeader from "./components/features/mainpage/MainPageOfferHeader";
import { useCallback } from "react";
import OfferOnPageDashboard from "./components/features/offerdashboard/OfferPageDashboard";
import FrequentlyBoughtTogether from "./components/features/frequentlyboughttogether/FrequentlyBoughtTogether";
import { useDispatch, useSelector } from "react-redux";
import { selectShowAssistanceOnMainPage, updateAssistanceOnMainPageThunk, UserGuidePreferencesInitializer, selectIsLoading } from "app/lib/reducers/UserGuidePreferencesReducer";
import { selectUserCurrentPage, navigateTo } from "app/lib/reducers/NavigationPageReducer";
import { NavigationPage } from "app/lib/enums/NavigationPage";
import ProductsAddOnPage from "./components/features/productsAddOn/ProductsAddOnPage";
import CartsAddOnPage from "./components/features/cartAddsOn/CartsAddOnPage";
import PostPurchaseUpsellPage from "./components/postPurchaseUpsell/PostPurchaseUpsellPage";
import ThankyouAddOnPage from "./components/features/thankyouPageAddOns/ThankyouAddOnPage";
import CartUpsellDownsellPage from "./components/features/cartUpsellDownsell/CartUpsellDownsellPage";


export default function Index() {
  const isLoadingDone = useSelector(state => selectIsLoading(state));

  const showAssistanceSelector = useSelector(state => selectShowAssistanceOnMainPage(state));
  const dispatch = useDispatch();

  const setupShowAssistanceCallback = useCallback((flag: boolean) => {
    const value: any = updateAssistanceOnMainPageThunk(false)
    dispatch(value);
  }, [dispatch]);

  const navigateToSelector = useSelector(state => selectUserCurrentPage(state));

  const navigateToCallback = useCallback((navigateToPage: NavigationPage) => {
    dispatch(navigateTo(navigateToPage));
  }, [dispatch]);

  UserGuidePreferencesInitializer({ userId: "alpha-beta-gamma" })

  function wrapBottom(content) {
    return (
      <>
        {content}
        <HelpBottonModal />
      </>
    );
  }

  if (isLoadingDone) {
    console.log("Loading user preferences for the first time");
  } else {
    console.log("nvigateToSelector " + navigateToSelector);
    const renderOfferPage = () => {
      switch (navigateToSelector) {
        case NavigationPage.MAIN_PAGE:
          return (
            <>
              < MainPageOfferHeader navigateToPage={navigateToCallback} />
              {showAssistanceSelector ? < SetupAssistance setupShowAssistanceCb={setupShowAssistanceCallback} /> : null}
              <OfferTabModal onShowOfferPage={navigateToCallback} />
              <HelpBottonModal />
            </>
          );

        case NavigationPage.OFFER_PAGE_DASHBOARD:
          return wrapBottom(<OfferOnPageDashboard navigateTo={navigateToCallback} />);

        case NavigationPage.FREQUENTLY_BOUGHT_TOGETHER:
          return wrapBottom(<FrequentlyBoughtTogether navigateTo={navigateToCallback} />);

        case NavigationPage.PRODUCTS_ADDON:
          return wrapBottom(<ProductsAddOnPage navigateTo={navigateToCallback} />);

        case NavigationPage.CART_UPSELL_DOWNSELL:
          return wrapBottom(<CartUpsellDownsellPage navigateTo={navigateToCallback} />);

        case NavigationPage.CART_ADDON:
          return wrapBottom(<CartsAddOnPage navigateTo={navigateToCallback} />);

        case NavigationPage.POST_PURCHASE_UPSELL:
          return wrapBottom(<PostPurchaseUpsellPage navigateTo={navigateToCallback} />);

        case NavigationPage.THANK_YOU_ADD_ON:
          return wrapBottom(<ThankyouAddOnPage navigateTo={navigateToCallback} />);
      }
    }

    return (
      <Page>

        <BlockStack>
          <Layout>
            {renderOfferPage()}
          </Layout>
        </BlockStack>
      </Page>
    );
  }
>>>>>>> origin/main
}
