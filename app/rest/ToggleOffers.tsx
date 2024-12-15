export default async function ToggleStatus(selectedResources: string[], status, storeId, setModalsAndStoreId, handleSelectionChange) {
    await fetch(`api/offers/toggle?status=${status}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedResources)
    }).then((response) => {
        if (!response.ok) {
            console.error("Failed to toggle the offer");
        }
        console.log("Toggled the offers");
        shopify.toast.show(`Offer toggled successfully`, { duration: 1000 });
        return fetch(`api/offers/fetch?storeId=${storeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            if (!response.ok) {
                console.error("Failed to fetch the offers");
            }
            return response.json().then((resp) => {
                console.log("response from all offers", resp);
                setModalsAndStoreId((prevState) => ({
                    ...prevState,
                    offers: resp.data.offers
                }));
                handleSelectionChange('page', false);
            });

        }).catch((error) => {
            console.error("Failed to fetch the offers", error);
            shopify.toast.show(`Failed to fetch offers`, { duration: 2000, isError: true });
        })
    }).catch((error) => {
        console.error("Failed to toggle the offer", error);
        shopify.toast.show(`Failed to toggle offers`, { duration: 2000, isError: true });
    })
}