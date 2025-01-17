import * as ConfigNames from "./CommonConfigNames";
import { SellCrossContainer } from "./Containers";
import { getHost } from "./Host";
import { PlusSign, ProductContainer } from "./ProductContainer";
import { Footer } from "./FooterContainer";

let offerId = null;


// Register custom elements
customElements.define("plus-sign", PlusSign);
customElements.define("cross-sell-product", ProductContainer);
customElements.define("cross-footer", Footer);
customElements.define("sell-cross-container", SellCrossContainer);

const renderSellCross = async () => {

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
    const renderUI = async (data) => {
        const { variants, layout, offerId: fetchedOfferId, currencyFormat, defaultWidgetTitle, discountText } = data.data;
        const flattenedLayout = flattenObject(layout);

        console.log("flattenedLayout", flattenedLayout);
        if (fetchedOfferId === null || fetchedOfferId === undefined || layout == null) {
            console.warn("Error: offerId/layout not found in the data.");
            return;
        } else {

            // todo can be fetched from the backend. 
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

            if (!topLevelComponent) {
                console.error("Error: top level component not found in the DOM.");
                return;
            }

            const sellCrossContainer = new SellCrossContainer(flattenedLayout, currencyFormat);
            sellCrossContainer.add(topLevelComponent);
            // add heading
            sellCrossContainer.addHeading(defaultWidgetTitle ? defaultWidgetTitle : "Frequently Bought Together", discountText);

            // add footer
            sellCrossContainer.addFooter(fetchedOfferId);

            // add products
            sellCrossContainer.addProducts(variants);

            topLevelComponent.parentElement.appendChild(sellCrossContainer);

            sellCrossContainer.initialize();
        }
    };

    // Fetch and render
    const uiConfig = await fetchUIConfig();
    if (uiConfig) {
        await renderUI(uiConfig);
    }
};

renderSellCross();
