/** Button */
const ButtonBackgroundColor = "component.button.background.color";
const ButtonTextColor = "component.button.text.color";
const ButtonTextFamily = "component.button.text.family";
const ButtonBorderRadius = "component.button.border.radius";
const ButtonBorderWidth = "component.button.border.width";
const ButtonBorderColor = "component.button.border.color";

/** Canvas */
const CanvasBackgroundColor = "component.canvas.background.color";

const CanvasLeftPadding = "component.canvas.left.padding";
const CanvasRightPadding = "component.canvas.right.padding";
const CanvasTopPadding = "component.canvas.top.padding";
const CanvasBottomPadding = "component.canvas.bottom.padding";

/** Canvas margins */
const CanvasLeftMargin = "component.canvas.left.margin";
const CanvasRightMargin = "component.canvas.right.margin";
const CanvasTopMargin = "component.canvas.top.margin";
const CanvasBottomMargin = "component.canvas.bottom.margin";

const CanvasBorderRadius = "component.canvas.border.radius";
const CanvasBorderWidth = "component.canvas.border.width";
const CanvasBorderColor = "component.canvas.border.color";

const CanvasTextColor = "component.canvas.text.color";
const CanvasTextSize = "component.canvas.text.size";
const CanvasTextFamily = "component.canvas.text.family";

/** Total Price */
const TotalPriceTextColor = "component.total.price.text.color";

/** Total Price Component */
const TotalPriceComponentTextColor = "component.total.price.component.text.color";

/** Total Price Crossed Out */
const TotalPriceCrossedOutTextColor = "component.total.price.crossed.out.text.color";

function getHost() {
    // return "https://3dcf-2401-4900-1f37-cbfd-1d35-c7a8-c9fb-a870.ngrok-free.app";
    return "https://7a81-2401-4900-1f37-2772-2951-b107-9e03-f06d.ngrok-free.app";
    // return `${location.origin}/apps/store`;
}

class SellCrossContainer extends HTMLElement {
    constructor(UIConfigs, currencyFormat) {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
            <div id="cross-sell-container">
                <div id="cross-sell-heading">
                    <div id="cross-sell-title">
                        <span id="cross-sell-title-span"></span>
                    </div>
                </div>
                <div id="cross-sell-content">
                    <div id="cross-sell-products"></div>
                    <div id="cross-sell-footer"></div>
                </div>
            </div>
        `;
        this.innerHTML = template.innerHTML;
        this.UIConfigs = UIConfigs;
        this.currencyFormat = currencyFormat;
        this.productContainers = [];
        this.footer = null;
    }

    add(container) {
        container.appendChild(this);
    }

    appendPx(property){
        return property ? property + "px" : "0px";
    }

    addHeading(content) {
        const heading = this.querySelector("#cross-sell-title-span");
        heading.textContent = content;
        heading.style.color = this.UIConfigs[CanvasTextColor];
        heading.style.fontSize = this.appendPx(this.UIConfigs[CanvasTextSize]);
        // heading.style.fontWeight = this.UIConfigs[ConfigNames.CanvasTextWeight];
        heading.style.fontFamily = this.UIConfigs[CanvasTextFamily];

        const container = this.querySelector("#cross-sell-container");

        container.style.backgroundColor = this.UIConfigs[CanvasBackgroundColor];
        
        container.style.borderRadius = this.appendPx(this.UIConfigs[CanvasBorderRadius]);
        container.style.borderColor = this.UIConfigs[CanvasBorderColor];
        container.style.borderWidth = this.appendPx(this.UIConfigs[CanvasBorderWidth]);

        container.style.paddingLeft = this.appendPx(this.UIConfigs[CanvasLeftPadding]);
        container.style.paddingRight = this.appendPx(this.UIConfigs[CanvasRightPadding]);
        container.style.paddingTop = this.appendPx(this.UIConfigs[CanvasTopPadding]);
        container.style.paddingBottom = this.appendPx(this.UIConfigs[CanvasBottomPadding]);

        container.style.marginLeft = this.appendPx(this.UIConfigs[CanvasLeftMargin]);
        container.style.marginRight = this.appendPx(this.UIConfigs[CanvasRightMargin]);
        container.style.marginTop = this.appendPx(this.UIConfigs[CanvasTopMargin]);
        container.style.marginBottom = this.appendPx(this.UIConfigs[CanvasBottomMargin]);
    }


    addProducts(variants) {
        if (!variants || variants.length === 0) return;

        const productsListContainer = this.querySelector("#cross-sell-products");
        variants.forEach((variantItem, index) => {
            const productContainer = new ProductContainer(this.UIConfigs, this.currencyFormat);
            productContainer.add(productsListContainer, variantItem);
            this.productContainers.push(productContainer);
            // Add a plus sign between items if not the last
            if (index + 1 < variants.length) {
                const plusSign = new PlusSign();
                plusSign.add(productsListContainer);
            }
        });
        this.footer.updateContainers(this.productContainers);
    }

    addFooter(offerId) {
        const footer = new Footer(this.currencyFormat, offerId);
        footer.add(this.querySelector("#cross-sell-footer"), this.UIConfigs);
        this.footer = footer;
    }
}

class ProductContainer extends HTMLElement {
    constructor(UIConfigs, currencyFormat) {
        super();
        this.UIConfigs = UIConfigs;
        this.pid = null;

        // Create a template and set innerHTML once
        const template = document.createElement("template");
        template.innerHTML = `
      <div class="cross-sell-product">
        <div class="cross-sell-product-image-container">
          <div class="cross-sell-checkbox-container">
            <input type="checkbox" class="cross-sell-product-checkbox" checked />
          </div>
          <img
            src=""
            alt="Product Image"
            class="cross-sell-product-image"
        />
        </div>
        <div class="cross-sell-product-title">
          <span class="cross-sell-product-title-span">
          </span>
        </div>
        <div class="cross-sell-variant-and-price">
          <div class="cross-sell-variant">
            
          </div>
          <div class="cross-sell-product-price">
            <span class="cross-sell-product-price-span"></span>
          </div>
        </div>
      </div>
    `;

        this.innerHTML = template.innerHTML;
        this.regex = /{{(.*?)}}/g;
        this.currencyFormat = currencyFormat;
        // Cache DOM elements
        this.titleSpan = this.querySelector(".cross-sell-product-title-span");
        this.checkbox = this.querySelector(".cross-sell-product-checkbox");
        this.img = this.querySelector(".cross-sell-product-image");
        this.priceSpan = this.querySelector(".cross-sell-product-price-span");
        this.variantSelect = this.querySelector(".cross-sell-variant");
    }


    // Get the variant ID of the selected option
    getSelectedVariantId() {
        const selectElement = this.querySelector('[name="variant-select"]');
        if(selectElement) {
            return selectElement.value;
        }else {
            return null;
        }
    }

    // Get the product ID
    getProductId() {
        return this.pid;
    }

    // Check if the checkbox is selected
    isChecked() {
        return this.checkbox?.checked ?? false;
    }

    add(container, productWithVariants) {
        const product = productWithVariants?.product;
        if (!product) return;

        this.pid = product.id;

        if (this.titleSpan) {
            const anchorElement = document.createElement("a");
            if (product.onlineStoreUrl) {
                anchorElement.href = product.onlineStoreUrl; // Dynamic link
            }
            anchorElement.textContent = product.title; // Dynamic text
            anchorElement.target = "_blank"; // Open in a new tab if needed

            this.titleSpan.appendChild(anchorElement);
        }

        // Set image
        if (product.featuredImage?.url) {
            this.img.src = product.featuredImage.url;
            this.img.alt = product.title ?? "Product Image";
        }


        const selectElement = document.createElement("select");
        selectElement.name = "variant-select";
        // Populate variants in the <select>
        product.variants?.nodes?.forEach((variant) => {
            const option = document.createElement("option");
            option.value = variant.id;
            option.textContent = variant.title;
            selectElement.appendChild(option);
        });

        this.variantSelect.appendChild(selectElement);

        // If there is at least one variant, show its price by default
        const firstVariantPrice = product?.variants?.nodes?.[0]?.price?.amount;

        if (firstVariantPrice) this.priceSpan.textContent = this.currencyFormat.replace(this.regex, firstVariantPrice);

        this.priceSpan.style.color = this.UIConfigs[TotalPriceComponentTextColor];
        // TODO adding footer earlier than this.
        // Attach event listeners
        const footer = document.querySelector("cross-footer");
        // Initialize the price in the footer

        footer.updatePrice(this.pid, firstVariantPrice, this.isChecked());


        this.variantSelect.addEventListener("change", (e) => {
            const selectedVariant = product.variants?.nodes?.find(
                (v) => v.id === e.target.value
            );
            const newPrice = selectedVariant?.price?.amount ?? 0;
            this.priceSpan.textContent = this.currencyFormat.replace(this.regex, newPrice);

            footer.updatePrice(
                product.id,
                newPrice,
                this.isChecked()
            );
        });

        this.checkbox.addEventListener("change", (e) => {

            const variantId = this.getSelectedVariantId();
            const selectedVariant = product.variants?.nodes?.find(
                (v) => v.id === variantId
            );
            const newPrice = selectedVariant?.price?.amount ?? 0;

            footer.updatePrice(
                product.id,
                newPrice,
                this.isChecked()
            );
        });

        console.log("bypassing this");
        // Finally, append this entire component
        while(this.firstChild) {
            container.appendChild(this.firstChild);
        }
        // container.appendChild(this);
    }
}

class PlusSign extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
      <div class="cross-sell-plus-symbol"> + </div>
    `;
        this.innerHTML = template.innerHTML;
    }

    add(container) {
        container.appendChild(this);
    }
}


class Footer extends HTMLElement {
    constructor(currencyFormat, offerId) {
        super();
        this.currencyFormat = currencyFormat;
        this.offerId = offerId;
        this.regex = /{{(.*?)}}/g;
        const template = document.createElement("template");
        // intentional div to wrap the footer
        template.innerHTML = `
      <div id="cross-sell-footer-id">
        <div class="cross-sell-total-price">
          <span style="color: '#000000'">Total price:</span>
          <span class="cross-sell-total-sale-price"></span>
          <span class="cross-sell-total-price-cross"></span>
        </div>
        <button class="cross-sell-add-to-cart-btn">Add To Cart</button>
      </div>
    `;

        this.innerHTML = template.innerHTML;

        this.salePrice = this.querySelector(".cross-sell-total-sale-price");
        this.crossedPrice = this.querySelector(".cross-sell-total-price-cross");
        this.addToCartBtn = this.querySelector(".cross-sell-add-to-cart-btn");

        // Keep track of product prices in a Map
        this.prices = new Map();
        this.productContainers = [];
    }

    updateContainers(productContainers) {
        this.productContainers = productContainers;
    }


    add(container, layoutConfigs) {
        // Apply styles from layoutConfigs
        // Cache important elements

        this.salePrice.style.color = layoutConfigs[TotalPriceTextColor];
        this.crossedPrice.style.color = layoutConfigs[TotalPriceCrossedOutTextColor];

        this.addToCartBtn.style.backgroundColor = layoutConfigs[ButtonBackgroundColor];
        this.addToCartBtn.style.borderRadius = layoutConfigs[ButtonBorderRadius];
        this.addToCartBtn.style.borderColor = layoutConfigs[ButtonBorderColor];
        this.addToCartBtn.style.textFamily = layoutConfigs[ButtonTextFamily];
        this.addToCartBtn.style.textColor = layoutConfigs[ButtonTextColor];
        this.addToCartBtn.style.borderWidth = layoutConfigs[ButtonBorderWidth];

        this.addToCartBtn.addEventListener("click", () => {
            this.handleClick();
        });

        container.appendChild(this);
    }

    async handleCartToken() {
        // Check if CartToken exists in localStorage
        let existingCartToken = localStorage.getItem('cross-sell-cartToken');

        if (existingCartToken == null) {
            try {
                // Call API to get new CartToken
                const response = await fetch(`${location.origin}/cart.js`, {
                    method: 'GET',
                    credentials: 'include',
                });

                const cartData = await response.json();
                const cartToken = cartData.token;
                console.log("cartToken", cartData);
                // Store the new CartToken in localStorage
                localStorage.setItem('cross-sell-cartToken', cartToken);
                return cartToken;
            } catch (error) {
                console.error('Error getting cart token:', error);
                return null;
            }
        }
        return existingCartToken;
    };


    async handleClick() {
        // const productContainers = document.querySelectorAll("product-container");
        const selectedProducts = Array.from(this.productContainers).map((container) => ({
            productId: container.getProductId(),
            variantId: container.getSelectedVariantId(),
            isChecked: container.isChecked(),
        }));

        // Request cart token

        const cartToken = await this.handleCartToken();
        console.log("cartToken", cartToken);
        const uri = `${getHost()}/api/storefront/order-create?shop=${shopDomain}`;
        const body = JSON.stringify({
            cartToken: cartToken,
            products: selectedProducts,
            offerId: this.offerId,
        });

        console.log("body", body);
        // Create order in server
        const orderCreationResponse = await fetch(uri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true"
            },
            body,
        });
        const orderCreationResponseJson = await orderCreationResponse.json();

        // Redirect after order creation
        window.location.href = orderCreationResponseJson.data.redirectUrl;
    }

    updatePrice(productId, price, isChecked) {
        if (isChecked) {
            this.prices.set(productId, parseFloat(price));
        } else {
            this.prices.delete(productId);
        }

        const totalPrice = Array.from(this.prices.values()).reduce((sum, p) => sum + p, 0);
        this.salePrice.textContent = this.currencyFormat.replace(this.regex, totalPrice);
    }
}

// Register custom elements
customElements.define("plus-sign", PlusSign);
customElements.define("product-container", ProductContainer);
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
    };
    // Render UI
    const renderUI = async(data) => {
        const { variants, layout, offerId: fetchedOfferId, currencyFormat } = data.data;
        const flattenedLayout = flattenObject(layout);
        console.log("flattenedlayouts", flattenedLayout);

        if(fetchedOfferId === null || fetchedOfferId === undefined) {
            console.error("Error: offerId not found in the data.");
            return;
        }

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
        ];

        const topLevelComponent = await findComponent(selectors);

        if (!topLevelComponent) {
            console.error("Error: top level component not found in the DOM.");
            return;
        }

        const sellCrossContainer = new SellCrossContainer(flattenedLayout, currencyFormat);
        sellCrossContainer.add(topLevelComponent);
        // add heading
        sellCrossContainer.addHeading("Frequently Bought Together");

        // add footer
        sellCrossContainer.addFooter(fetchedOfferId);

        // add products
        sellCrossContainer.addProducts(variants);

        topLevelComponent.parentElement.appendChild(sellCrossContainer);
    };

    // Fetch and render
    const uiConfig = await fetchUIConfig();
    if (uiConfig) {
        await renderUI(uiConfig);
    }
};

renderSellCross();
