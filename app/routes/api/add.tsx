export async function action({ request }) {
    // const formData = await request.formData();
    // const newProduct = formData.get("name");
    // Save newProduct to database or call Shopify Admin API
    // await addProductToShopify(newProduct);
    
    return JSON.stringify({ success: true });
  }
  