const setupSellCross = async () => {
    // invoke the settings of the page configs.
    // this will get us how the page should look like. 
    // all the products which are to be shown in FBT. 
    const UIConfigPromise = async () => {
        const uri = `${location.origin}/apps/store/api/storefront/fetch?`+ new URLSearchParams({ shop: shopDomain, pid: productId });
        fetch(uri, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
    };
    const UIConfigs = UIConfigPromise();
}

/// setup-sell-cross
setupSellCross();