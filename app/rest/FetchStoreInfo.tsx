export function fetchStoreInfo(updateStoreDetails) {
  const fetchStoreInfo = async () => {
    try {
      const response = await fetch('/api/offers/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const resp = await response.json();
        console.log('response', resp);
        updateStoreDetails({
          isLoading: false,
          storeId: resp.data.storeId,
          mainPageModalState: resp.data.helpModal.mainPageModalState,
          offerPageModalState: resp.data.helpModal.mainPageModalState,
          tags: resp.data.tagsData,
          offers: resp.data.offers,
          customPages: resp.data.customPages,
          currencySymbol: resp.data.currencySymbol,
          storeData: resp.data.sampleData.nodes,
          currencyFormat: resp.data.currencyFormat,
        });
      } else {
        throw new Error('Error fetching store info');
      }
    } catch (error) {
      console.error('Error fetching store info:', error);
    }
  };
  fetchStoreInfo();
}
