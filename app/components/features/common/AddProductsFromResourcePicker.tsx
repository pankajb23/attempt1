import { ResourcePicker } from '@shopify/app-bridge/actions';
import { useAppBridge } from '@shopify/app-bridge-react';

const MyComponent = () => {
  const selected = await shopify.resourcePicker({
    type: "product",
    multiple: true,
    query: "Find product",
    selectionIds: [],
    action: 'select'
  });


};