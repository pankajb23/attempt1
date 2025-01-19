export default async function DeleteOffers(
  selectedResources: string[],
  storeId,
  setModalsAndStoreId,
  handleSelectionChange
) {
  await fetch(`api/offers/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(selectedResources),
  })
    .then((response) => {
      if (!response.ok) {
        console.error('Failed to delete the offer');
      }
      console.log('Deleted the offer');
      shopify.toast.show(`Offer deleted successfully`, { duration: 1000 });
      fetch(`api/offers/fetch?storeId=${storeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            console.error('Failed to fetch the offers');
          }
          response.json().then((resp) => {
            const content = resp.data.offers;
            console.log('response from all offers', content);
            setModalsAndStoreId((prevState) => ({
              ...prevState,
              offers: content,
            }));
            handleSelectionChange('page', false);
          });
        })
        .catch((error) => {
          console.error('Failed to fetch the offers', error);
          shopify.toast.show(`Failed to fetch offers`, {
            duration: 2000,
            isError: true,
          });
        });
    })
    .catch((error) => {
      console.error('Failed to delete the offer', error);
      shopify.toast.show(`Failed to delete offers`, {
        duration: 2000,
        isError: true,
      });
    });
}
