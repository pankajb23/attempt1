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

/** Total Price Component */
const TotalPriceComponentTextColor = "component.total.price.component.text.color";

/** Total Price Crossed Out */
const TotalPriceCrossedOutTextColor = "component.total.price.crossed.out.text.color";

function getHost() {
    // return "https://sellcross-bc95eb582641.herokuapp.com";
    return "https://0ef0-2401-4900-1f37-cef1-986e-851-b68a-cb9c.ngrok-free.app";
}

class Footer extends HTMLElement {
    constructor(UIConfigs, currencyFormat, offerId) {
        super();
        this.UIConfigs = UIConfigs;
        this.currencyFormat = currencyFormat;
        this.offerId = offerId;
        this.regex = /{{(.*?)}}/g;
        const template = document.createElement("template");
        // intentional div to wrap the footer
        template.innerHTML = `
      <div id="cross-sell-footer">
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


    add(container) {
        // Apply styles from UIConfigs
        // Cache important elements

        this.salePrice.style.color = this.UIConfigs[TotalPriceComponentTextColor];
        this.crossedPrice.style.color = this.UIConfigs[TotalPriceCrossedOutTextColor];

        this.addToCartBtn.style.backgroundColor = this.UIConfigs[ButtonBackgroundColor];
        this.addToCartBtn.style.borderRadius = this.UIConfigs[ButtonBorderRadius];
        this.addToCartBtn.style.borderColor = this.UIConfigs[ButtonBorderColor];
        this.addToCartBtn.style.textFamily = this.UIConfigs[ButtonTextFamily];
        this.addToCartBtn.style.textColor = this.UIConfigs[ButtonTextColor];
        this.addToCartBtn.style.borderWidth = this.UIConfigs[ButtonBorderWidth];

        this.addToCartBtn.addEventListener("click", () => {
            this.handleClick();
        });

        container.appendChild(this);
    }

    

    async handleClick() {
        // const productContainers = document.querySelectorAll("product-container");
        const selectedProducts = Array.from(this.productContainers).map((container) => ({
            productId: container.getProductId(),
            variantId: container.getSelectedVariantId(),
            isChecked: container.isChecked(),
        }));

        // Request cart token

        const cartToken = localStorage.getItem('CROSS-SELL-CART-TOKEN');
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

        if(this.prices.size > 0) {

            this.addToCartBtn.disabled = false;
            const totalPrice = Array.from(this.prices.values()).reduce((sum, p) => sum + p, 0);
            this.salePrice.textContent = this.currencyFormat.replace(this.regex, totalPrice);
            
        }else {
            this.addToCartBtn.disabled = true;
        }
    }
}

// latching styles to this class itself.

class ProductContainer extends HTMLElement {
    constructor(UIConfigs, currencyFormat, footer, productWithVariants) {
        super();
        this.UIConfigs = UIConfigs;
        this.pid = null;
        this.footer = footer;
        this.productWithVariants = productWithVariants;
        
        this.product = productWithVariants?.product;
        console.log("productWithVariants", productWithVariants, this.product);

        // Create a template and set innerHTML once
        const template = document.createElement("template");
        template.innerHTML = `
        <div>
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
        if (selectElement) {
            return selectElement.value;
        } else {
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

    add(container) {

        const product = this.product;

        if (product == null){
            console.log("product is null");
            return;
        } 

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
        // const footer = document.querySelector("cross-footer");
        // Initialize the price in the footer
        // console.log("bypassing this");
        // Finally, append this entire component
        console.log("new method 01");
        container.appendChild(this);
    }

    initialize(footer) {
        this.footer = footer;

        const firstVariantPrice = this.product?.variants?.nodes?.[0]?.price?.amount;

        this.footer.updatePrice(this.pid, firstVariantPrice, this.isChecked());

        this.variantSelect.addEventListener("change", (e) => {
            const selectedVariant = this.product.variants?.nodes?.find(
                (v) => v.id === e.target.value
            );
            const newPrice = selectedVariant?.price?.amount ?? 0;
            this.priceSpan.textContent = this.currencyFormat.replace(this.regex, newPrice);

            this.footer.updatePrice(
                this.product.id,
                newPrice,
                this.isChecked()
            );
        });

        this.checkbox.addEventListener("change", (e) => {
            console.log("checkbox changed", e);
            const variantId = this.getSelectedVariantId();
            const selectedVariant = this.product.variants?.nodes?.find(
                (v) => v.id === variantId
            );
            const newPrice = selectedVariant?.price?.amount ?? 0;
            this.footer.updatePrice(
                this.product.id,
                newPrice,
                this.isChecked()
            );
            console.log(" changing opacity to ", this.isChecked());
            if (this.isChecked()) {
                this.style.opacity = 1;
            } else {
                this.style.opacity = 0.5;
            }
        });
    }
}

class PlusSign extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
      <div class="cross-sell-plus-symbol">+</div>
    `;
        this.innerHTML = template.innerHTML;
    }

    add(container) {
        container.appendChild(this);
    }
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
                    <div id="cross-sell-discount-text">
                        <span id="cross-sell-discount-text-span"></span>
                    </div>
                </div>
                <div id="cross-sell-content">
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

    appendPx(property) {
        return property ? property + "px" : "0px";
    }

    addHeading(content, discountText) {
        const heading = this.querySelector("#cross-sell-title-span");
        const container = this.querySelector("#cross-sell-container");


        heading.textContent = content;
        heading.style.color = this.UIConfigs[CanvasTextColor];
        heading.style.fontSize = this.appendPx(this.UIConfigs[CanvasTextSize]);
        // heading.style.fontWeight = this.UIConfigs[ConfigNames.CanvasTextWeight];
        heading.style.fontFamily = this.UIConfigs[CanvasTextFamily];



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

        if (discountText) {
            const discountTextSpan = this.querySelector("#cross-sell-discount-text-span");
            discountTextSpan.textContent = discountText;
        } else {
            const discountText = this.querySelector("#cross-sell-discount-text");
            discountText.remove();
        }

    }


    addProducts(variants) {
        if (!variants || variants.length === 0) return;

        const productsListContainer = this.querySelector("#cross-sell-content");
        variants.forEach((variantItem, index) => {
            const productContainer = new ProductContainer(this.UIConfigs, this.currencyFormat, productsListContainer, variantItem);
            this.productContainers.push(productContainer);

            productContainer.add(productsListContainer);
            // Add a plus sign between items if not the last
            if (index + 1 < variants.length) {
                const plusSign = new PlusSign();
                plusSign.add(productsListContainer);
            }
        });

    }

    addFooter(offerId) {
        this.footer = new Footer(this.UIConfigs, this.currencyFormat, offerId);
    }

    resize() {
        const componentHeight = document.querySelector(".cross-sell-product-image").height;
        console.log("componentHeight", componentHeight);

        document.querySelectorAll(".cross-sell-plus-symbol").forEach(plusSign => {
            plusSign.style.paddingTop = `${componentHeight / 2}px`;
        });
        
    }
    
    initialize() {
        const productsListContainer = this.querySelector("#cross-sell-content");
        this.footer.add(productsListContainer);
        this.footer.updateContainers(this.productContainers);

        this.productContainers.forEach(productContainer => {
            productContainer.initialize(this.footer);
        });

        window.addEventListener("resize", () => {
            const footer = this.querySelector("#cross-sell-footer");
            const crossSellContent = this.querySelector("#cross-sell-content");
            const crossSellContainer = this.querySelector("#cross-sell-container");

            console.log("window.innerWidth", window.innerWidth);

            if (window.innerWidth < 768 && footer.parentNode === crossSellContent) {
                // move footer outside, append the css classes
                crossSellContainer.appendChild(footer);
                footer.classList.add("cross-sell-footer-mobile");
                footer.classList.remove("cross-sell-footer");
            } else if (footer.parentNode !== crossSellContent) {
                // move footer inside.
                crossSellContent.appendChild(footer);
                footer.classList.add("cross-sell-footer");
                footer.classList.remove("cross-sell-footer-mobile");
            }
        });

        window.addEventListener("resize", () => {
            this.resize();
        });

        requestAnimationFrame(() => {   
            this.resize();
        });
    }
}

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

    const handleCartToken = async () => {
        // Check if CartToken exists in localStorage
        let existingCartToken = localStorage.getItem('CROSS-SELL-CART-TOKEN');
        console.log("existingCartToken", existingCartToken);
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
                localStorage.setItem('CROSS-SELL-CART-TOKEN', cartToken);
                return cartToken;
            } catch (error) {
                console.error('Error getting cart token:', error);
                return null;
            }
        }
        return existingCartToken;
    };


    // Fetch UI config
    const fetchUIConfig = async (cartToken) => {
        const uri = `${getHost()}/api/storefront/fetch?` +
            new URLSearchParams({ shop: shopDomain, pid: productId, cartToken: cartToken });
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
            ];

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
    const cartToken = await handleCartToken();
    const uiConfig = await fetchUIConfig(cartToken);
    if (uiConfig) {
        await renderUI(uiConfig);
    }
};

renderSellCross();
