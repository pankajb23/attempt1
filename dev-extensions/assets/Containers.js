import { getHost } from "./Host";
import * as ConfigNames from "./CommonConfigNames";

export class SellCrossContainer extends HTMLElement {
    constructor() {
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
    }

    add(container) {
        container.appendChild(this);
    }

    addHeading(content) {
        this.querySelector("#cross-sell-title-span").textContent = content;
    }

    addProducts(variants, flattenedLayout, currencyFormat) {
        if (!variants || variants.length === 0) return;

        const productsListContainer = this.querySelector("#cross-sell-products");
        variants.forEach((variantItem, index) => {
            const productContainer = new ProductContainer(currencyFormat);
            productContainer.add(productsListContainer, variantItem);

            // Add a plus sign between items if not the last
            if (index + 1 < variants.length) {
                const plusSign = new PlusSign();
                plusSign.add(productsListContainer);
            }
        });
    }

    addFooter(flattenedLayout) {
        const footer = new Footer();
        footer.add(this.querySelector("#cross-sell-footer"), flattenedLayout);
    }
}

export class ProductContainer extends HTMLElement {
    constructor(UIConfigs, currencyFormat) {
        super();
        this.UIConfigs = UIConfigs;
        this.currencyFormat = currencyFormat;
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
        // Cache DOM elements
    }

    // Get the variant ID of the selected option
    getSelectedVariantId() {
        return this.variantSelect?.value || null;
    }

    // Get the product ID
    getProductId() {
        return this.pid;
    }

    // Check if the checkbox is selected
    isChecked() {
        return this.checkbox?.checked || false;
    }

    add(container, productWithVariants) {
        const product = productWithVariants?.product;
        if (!product) return;

        this.pid = product.id;

        this.titleSpan = this.querySelector(".cross-sell-product-title-span");
        this.checkbox = this.querySelector(".cross-sell-product-checkbox");
        this.img = this.querySelector(".cross-sell-product-image");
        this.priceSpan = this.querySelector(".cross-sell-product-price-span");
        this.variantSelect = this.querySelector(".cross-sell-variant");

        if (this.titleSpan) {
            const anchorElement = document.createElement("a");
            anchorElement.href = product.onlineStoreUrl; // Dynamic link
            anchorElement.textContent = product.title; // Dynamic text
            anchorElement.target = "_blank"; // Open in a new tab if needed

            this.titleSpan.appendChild(anchorElement);
        }

        // Set image
        if (product.featuredImage?.url) {
            this.img.src = product.featuredImage.url;
            this.img.alt = product.title || "Product Image";
        }

        // Set title
        if (product.title) {
            this.titleSpan.textContent = product.title;
            this.titleSpan.style.color = this.UIConfigs?.textColor;
        }

        // Set initial price
        if (productWithVariants?.price) {
            this.priceSpan.textContent = this.currencyFormat.replace(this.regex, productWithVariants.price);
            this.priceSpan.style.color = this.UIConfigs?.salePriceColor;
        }

        // Populate variants in the <select>
        product.variants?.nodes?.forEach((variant) => {
            const option = document.createElement("option");
            option.value = variant.id;
            option.textContent = variant.title;
            this.variantSelect.appendChild(option);
        });

        // If there is at least one variant, show its price by default
        const firstVariantPrice = product?.variants?.nodes?.[0]?.price?.amount;
        if (firstVariantPrice) this.priceSpan.textContent = firstVariantPrice;

        // TODO adding footer earlier than this.
        // Attach event listeners
        const footer = document.querySelector("cross-footer");
        this.variantSelect.addEventListener("change", (e) => {
            const selectedVariant = product.variants?.nodes?.find(
                (v) => v.id === e.target.value
            );
            const newPrice = selectedVariant?.price?.amount || 0;
            this.priceSpan.textContent = newPrice;

            footer.updatePrice(
                product.id,
                parseFloat(newPrice),
                this.isChecked()
            );
        });

        this.checkbox.addEventListener("change", (e) => {
            footer.updatePrice(
                product.id,
                parseFloat(this.priceSpan.textContent) || 0,
                e.target.checked
            );
        });

        console.log("footer01", footer);
        // Initialize the price in the footer
        footer.updatePrice(this.pid, parseFloat(this.priceSpan.textContent) || 0, this.isChecked());

        // Finally, append this entire component
        container.appendChild(this);
    }
}

export class PlusSign extends HTMLElement {
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


export class Footer extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        // intentional div to wrap the footer
        template.innerHTML = `
      <div id="cross-sell-footer-id">
        <div class="cross-sell-total-price">
          <span >Total price:</span>
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
    }

    add(container, layoutConfigs) {
        // Apply styles from layoutConfigs
        // Cache important elements
        
        this.salePrice.style.color = layoutConfigs[ConfigNames.TotalPriceTextColor];
        this.crossedPrice.style.color = layoutConfigs[ConfigNames.TotalPriceCrossedOutTextColor];

        this.addToCartBtn.style.backgroundColor = layoutConfigs[ConfigNames.ButtonBackgroundColor];
        this.addToCartBtn.style.borderRadius = layoutConfigs[ConfigNames.ButtonBorderRadius];
        this.addToCartBtn.style.borderColor = layoutConfigs[ConfigNames.ButtonBorderColor];
        this.addToCartBtn.style.textFamily = layoutConfigs[ConfigNames.ButtonTextFamily];
        this.addToCartBtn.style.textColor = layoutConfigs[ConfigNames.ButtonTextColor];
        this.addToCartBtn.style.borderWidth = layoutConfigs[ConfigNames.ButtonBorderWidth];

        this.addToCartBtn.addEventListener("click", () => {
            this.handleClick();
        });

        container.appendChild(this);
    }

    async handleCartToken() {
        // Check if CartToken exists in localStorage
        let existingCartToken = localStorage.getItem('cartToken');

        if (!existingCartToken) {
            try {
                // Call API to get new CartToken
                const response = await fetch(`${location.origin}/cart.js`, {
                    method: 'GET',
                    credentials: 'include',
                });

                const cartData = await response.json();
                const cartToken = cartData.token;

                // Store the new CartToken in localStorage
                localStorage.setItem('cartToken', cartToken);
            } catch (error) {
                console.error('Error getting cart token:', error);
            }
        }
    };


    async handleClick() {
        const productContainers = document.querySelectorAll("sell-cross-product-container");
        const selectedProducts = Array.from(productContainers).map((container) => ({
            productId: container.getProductId(),
            variantId: container.getSelectedVariantId(),
            isChecked: container.isChecked(),
        }));

        // Request cart token

        const cartToken = await this.handleCartToken();
        const uri = `${getHost()}/api/storefront/order-create?shop=${shopDomain}`;
        const body = JSON.stringify({
            cartToken,
            products: selectedProducts,
            offerId,
        });

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
            this.prices.set(productId, price);
        } else {
            this.prices.delete(productId);
        }

        const totalPrice = Array.from(this.prices.values()).reduce((sum, p) => sum + p, 0);
        this.salePrice.textContent = `₹${totalPrice}`;
    }
}

