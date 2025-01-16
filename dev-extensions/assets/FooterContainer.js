export class Footer extends HTMLElement {
    constructor(currencyFormat, offerId) {
        super();
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

