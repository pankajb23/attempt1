let offerId = null;
class ProductContainer extends HTMLElement {
    constructor(UIConfigs) {
        super();
        this.UIConfigs = UIConfigs;
        const template = document.createElement("template");
        template.innerHTML = `
            <div class="cross-product">
                <div class="cross-checkbox-container">
                    <input type="checkbox" class="cross-product-checkbox" checked>
                </div>
                <img
                    src=""
                    alt="Product Image"
                    class="cross-product-image"
                >
                <div class="cross-product-title">
                    <span class="p-title-span"></span>
                </div>
                <div class="price-variant-display">
                    <div class="variants">
                        <select id="variant-select" class="variant-select">
                        </select>
                    </div>
                    <div class="cross-product-price">
                        <span class="cross-price-span"></span>
                    </div>
                </div>
            </div>`;
        this.innerHTML = template.innerHTML;
        this.pid = null;
    }

    // Get the variant ID of the selected option
    getSelectedVariantId() {
        const selectBox = this.querySelector(".variant-select");
        return selectBox?.value || null;
    }

    // Get the product ID
    getProductId() {
        return this.pid;
    }

    // Check if the checkbox is selected
    isChecked() {
        const checkbox = this.querySelector(".cross-product-checkbox");
        return checkbox?.checked || false;
    }

    add(container, productWithVariants) {
        // Use this instead of shadowRoot
        // console.log("productWithVariants", productWithVariants);
        const product = productWithVariants?.product;
        this.pid = product?.id;
        const img = this.querySelector(".cross-product-image");
        const titleSpan = this.querySelector(".p-title-span");
        const priceSpan = this.querySelector(".cross-price-span");
        const selectBox = this.querySelector(".variant-select");

        if (product?.featuredImage?.url) {
            img.src = product.featuredImage.url;
            img.alt = product.title || 'Product Image';
        }

        if (product?.title) {
            titleSpan.textContent = product.title;
            titleSpan.style.color = this.UIConfigs?.textColor;
        }

        if (productWithVariants?.price) {
            priceSpan.textContent = `₹${productWithVariants.price}`;
            priceSpan.style.color = this.UIConfigs?.salePriceColor;
        }

        product?.variants?.nodes.forEach((variant) => {
            const option = document.createElement("option");
            option.value = variant.id;
            option.textContent = variant.title;
            selectBox.appendChild(option);
        });
        priceSpan.textContent = product?.variants?.nodes[0]?.price?.amount;
        console.log("amt", product?.variants?.nodes[0]?.price?.amount);

        const checkbox = this.querySelector(".cross-product-checkbox");
        const productId = product?.id;

        const footer = document.querySelector('cross-footer');
        selectBox.addEventListener('change', (e) => {
            const selectedVariant = product.variants?.nodes?.find(
                variant => variant.id == event.target.value
            );
            priceSpan.textContent = selectedVariant?.price?.amount || "$0";

            const isChecked = this.querySelector('.cross-product-checkbox').isChecked;

            footer.updatePrice(productId, parseFloat(priceSpan.textContent), isChecked);
        });

        // console.log("priceSpan", priceSpan.textContent);
        checkbox.addEventListener('change', (e) => {
            footer.updatePrice(productId, parseFloat(priceSpan.textContent), e.target.checked);
        });

        // Update price on load
        footer.updatePrice(productId, parseFloat(priceSpan.textContent), checkbox.checked);
        container.appendChild(this);
    }
}

class PlusSign extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
            <div class="cross-plus-symbol"> + </div>
        `
        this.innerHTML = template.innerHTML;
    }

    add(container) {
        container.appendChild(this);
    }
}

class SectionHeading extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
      <div id="heading">
                <div class="cross-sell-title">
                    <span class="h-title-span"></span>
                </div>
            </div>`;
        this.innerHTML = template.innerHTML;
    }

    add(container, content) {
        const headingSpan = this.querySelector(".h-title-span");
        headingSpan.textContent = content;
        container.appendChild(this);
    }

}

class Footer extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
            <div id="cross-footer">
                    <div class="cross-total-price">
                        <span class="cross-price-text" >
                            Total price:
                        </span>
                        <span class="cross-sale-price">
                        </span>
                        <span class="cross-final-price">
                        </span>
                    </div>
                    <button class="add-to-cart-btn"> Add To Cart</button>
                </div>
        `
        this.innerHTML = template.innerHTML;
        this.prices = new Map();
    }

    add(container, layoutConfigs) {
        const crossPriceText = this.querySelector(".cross-price-text");
        const crossSalePrice = this.querySelector(".cross-sale-price");
        const crossTotalPrice = this.querySelector(".cross-total-price");
        const addToCartBtn = this.querySelector(".add-to-cart-btn");


        crossPriceText.style.color = layoutConfigs.text.color;
        crossSalePrice.style.color = layoutConfigs.price.sale.color;
        crossTotalPrice.style.color = layoutConfigs.price.color;

        addToCartBtn.style.backgroundColor = layoutConfigs.btn.bg.color;
        addToCartBtn.style.borderRadius = "2px";
        addToCartBtn.style.borderColor = layoutConfigs.btn.brdr.color;

        addToCartBtn.addEventListener("click", () => {
            this.handleClick();
        });

        container.appendChild(this);
    }

    handleClick = async () => {
        const productContainers = document.querySelectorAll("product-container");
        const selectedProducts = Array.from(productContainers).map((container) => {
            return {
                productId: container.getProductId(),
                variantId: container.getSelectedVariantId(),
                isChecked: container.isChecked(),
            };
        });

        // console.log("Selected Items:", selectedProducts);

        const uri = `${location.origin}/apps/store/api/storefront/order-create?shop=${shopDomain}`;
        
        const cartJsCall = await fetch(`${location.origin}/cart.js`, {
            method: "GET",
            credentials: "include"
        });

        const response = await cartJsCall.json();
        const cartToken = response.token;

        const body = JSON.stringify({
            cartToken: cartToken,
            products: selectedProducts,
            offerId: offerId,
        });
        const orderCreationResponse = await fetch(uri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body
        });
        const orderCreationResponseJson = await orderCreationResponse.json();

        console.log("orderCreationResponseJson and changing url", orderCreationResponseJson);
        window.location.href = orderCreationResponseJson.data.redirectUrl;
    }

    updatePrice(productId, price, isChecked) {
        if (isChecked) {
            this.prices.set(productId, price);
        } else {
            this.prices.delete(productId);
        }

        const totalPrice = Array.from(this.prices.values()).reduce((sum, p) => sum + p, 0);
        const salePriceSpan = this.querySelector(".cross-final-price");
        salePriceSpan.textContent = `₹${totalPrice}`;
    }
}

customElements.define('plus-sign', PlusSign);
customElements.define('product-container', ProductContainer);
customElements.define('section-heading', SectionHeading);
customElements.define('cross-footer', Footer);

console.log("cart tokens", localStorage.getItem('cartToken'));

const renderSellCross = async () => {
    const sellCrossComponent = document.getElementById("sell-cross-component");

    console.log(sellCrossComponent);
    if (!sellCrossComponent) {
        console.error("Error: sell-cross-component not found in the DOM.");
        return;
    }

    let selectedItems = [];

    const fetchUIConfig = async () => {
        const uri = `${location.origin}/apps/store/api/storefront/fetch?` +
            new URLSearchParams({ shop: shopDomain, pid: productId });
        const response = await fetch(uri, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            console.error("Failed to fetch UI configuration");
            return null;
        }
        return response.json();
    };

    const renderUI = (data) => {
        const variants = data.data.variants;
        const configs = data.data.layout;
        sellCrossComponent.innerHTML = "";

        offerId = data.data.offerId;

        const heading = new SectionHeading()
        heading.add(sellCrossComponent, "Frequently Bought Together");

        const contentContainer = document.createElement("div");
        contentContainer.className = "cross-content";
        sellCrossComponent.appendChild(contentContainer);

        const footer = new Footer();
        footer.add(contentContainer, configs);

        const itemsContainer = document.createElement("div");
        itemsContainer.className = "cross-products";
        contentContainer.appendChild(itemsContainer);

        if (!variants || variants.length === 0) {
            console.warn("No variants found in the response data.");
            return;
        }

        console.log("variants", variants.length);
        const totalSize = variants.length;
        // Add items and "+" signs
        variants.forEach((variantItem, index) => {
            const product = variantItem.product;

            const productContainer = new ProductContainer(configs);
            productContainer.add(itemsContainer, variantItem);

            console.log("adding plusSign", totalSize);
            if (index + 1 < totalSize) {
                console.log("index", index, totalSize);
                const plusSign = new PlusSign();
                plusSign.add(itemsContainer);
            }
        });


        contentContainer.appendChild(footer.container || footer.element || footer);
    };

    const uiConfig = await fetchUIConfig();
    if (uiConfig) {
        renderUI(uiConfig);
    }
};

renderSellCross();
