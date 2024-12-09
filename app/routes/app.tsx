import type { HeadersFunction, LoaderFunctionArgs, ActionFunctionArgs, } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError, useFetcher } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { authenticate } from "../shopify.server";
import store from "app/lib/reducers/ReduxStore";
import i18n from "app/assets/i18n/config";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from "react";
import { StoreProvider, useStoreContext } from "app/lib/context/StoreContext";
import { fetchStoreInfo } from "app/rest/FetchStoreInfo";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  console.log("admin response ---> ", JSON.stringify(admin));
  return json({ success: true });
};

export function Pages() {
  const { updateModalsAndStoreId } = useStoreContext();

  useEffect(() => {
    fetchStoreInfo(updateModalsAndStoreId);
  }, []);

  return (
    <>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/customize">Customize</Link>
      </NavMenu>
      <Outlet />
    </>
  );
}

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();
  const queryClient = new QueryClient();
  // const {getSessionToken} = useSessionToken();
  const fetcher = useFetcher<typeof action>();
  console.log("Fetcher ---> ", JSON.stringify(fetcher));


  return (
    <ReduxProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <AppProvider isEmbeddedApp apiKey={apiKey}>
            <StoreProvider>
              <Pages />
            </StoreProvider>
          </AppProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </ReduxProvider>
  );

}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
