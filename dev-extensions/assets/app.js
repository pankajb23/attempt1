import * as ConfigNames from "./CommonConfigNames";
import { PlusSign, ProductContainer,  Footer, SellCrossContainer } from "./Containers";
import { getHost } from "./Host";

let offerId = null;


// Register custom elements
customElements.define("plus-sign", PlusSign);
customElements.define("product-container", ProductContainer);
customElements.define("cross-footer", Footer);
customElements.define("sell-cross-container", SellCrossContainer);

const renderSellCross = async () => {
    // const sellCrossComponent = document.getElementById("sell-cross-component");
    // if (!sellCrossComponent) {
    //     console.error("Error: sell-cross-component not found in the DOM.");
    //     return;
    // }

    function flattenObject(obj, parent = '', result = {}) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const newKey = parent ? `${parent}.${key}` : key;
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    if (Array.isArray(obj[key])) {
                        obj[key].forEach((item, index) => {
                            flattenObject(item, `${newKey}[${index}]`, result);
                        });
                    } else {
                        flattenObject(obj[key], newKey, result);
                    }
                } else {
                    result[newKey] = obj[key];
                }
            }
        }
        return result;
    }

    // Fetch UI config
    const fetchUIConfig = async () => {
        const uri = `${getHost()}/api/storefront/fetch?` +
            new URLSearchParams({ shop: shopDomain, pid: productId });
        const response = await fetch(uri, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true"
            },
        });
        if (!response.ok) {
            console.error("Failed to fetch UI configuration");
            return null;
        }
        return response.json();
    };

    const findComponent = async (selectors, maxAttempts = 5, delay = 1000) => {
        for (let i = 0; i < maxAttempts; i++) {
            const foundComponent = selectors.find(c => document.querySelector(c));
            if (foundComponent) {
                return document.querySelector(foundComponent);
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        console.error("Error: component not found in the DOM.");
        return null;
    }
    // Render UI
    const renderUI = async(data) => {
        const { variants, layout, offerId: fetchedOfferId, currencyFormat } = data.data;
        const flattenedLayout = flattenObject(layout);
        console.log("flattenedlayouts", flattenedLayout);

        offerId = fetchedOfferId; // store globally if needed

        const selectors = [
            // ".product-single",
            // ".section.product_section",
            // ".product-single__content",
            // "#productHead",
            // "#ProductSection--product-template",
            // "#shopify-section-product-template",
            ".product--large",
            ".product--left"
        ]

        const topLevelComponent = await findComponent(selectors);

        console.log("topLevelComponent01", topLevelComponent);
        if (!topLevelComponent) {
            console.error("Error: top level component not found in the DOM.");
            return;
        }

        const sellCrossContainer = new SellCrossContainer();
        sellCrossContainer.add(topLevelComponent);
        // add heading
        sellCrossContainer.addHeading("Frequently Bought Together");

        // add footer
        sellCrossContainer.addFooter(flattenedLayout);

        // add products
        sellCrossContainer.addProducts(variants, flattenedLayout, currencyFormat);

        console.log("attemp01");
        topLevelComponent.parentElement.appendChild(sellCrossContainer);

        console.log("topLevelComponent -> Parent", topLevelComponent.parentElement);
    };

    // Fetch and render
    const uiConfig = await fetchUIConfig();
    if (uiConfig) {
        await renderUI(uiConfig);
    }
};

renderSellCross();