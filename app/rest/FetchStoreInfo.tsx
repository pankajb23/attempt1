export function fetchStoreInfo(updateModalsAndStoreId) {
    const fetchStoreInfo = async () => {
        try {
            const response = await fetch("/api/offers/all", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const resp = await response.json();
                console.log("response", resp);
                updateModalsAndStoreId({
                    isLoading: false,
                    storeId: resp.data.storeId,
                    mainPageModalState: !resp.data.helpModal.mainPageModalClose,
                    offerPageModalState: !resp.data.helpModal.offerPageModalClose
                });

            } else {
                throw new Error("Error fetching store info");
            }
        } catch (error) {
            console.error("Error fetching store info:", error);
        }
    };
    fetchStoreInfo();
}