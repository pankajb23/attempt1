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
                <div class="cross-product-price">
                    <span class="cross-price-span"></span>
                </div>
            </div>`;
        this.innerHTML = template.innerHTML;
    }

    add(container, productWithVariants) {
        // Use this instead of shadowRoot
        const img = this.querySelector(".cross-product-image");
        const titleSpan = this.querySelector(".p-title-span");
        const priceSpan = this.querySelector(".cross-price-span");

        if (productWithVariants?.product?.featuredImage?.url) {
            img.src = productWithVariants.product.featuredImage.url;
            img.alt = productWithVariants.product.title || 'Product Image';
        }

        if (productWithVariants?.product?.title) {
            titleSpan.textContent = productWithVariants.product.title;
            titleSpan.style.color = this.UIConfigs?.textColor;
        }

        if (productWithVariants?.price) {
            priceSpan.textContent = `₹${productWithVariants.price}`;
            priceSpan.style.color = this.UIConfigs?.salePriceColor;
        }   

        const checkbox = this.querySelector(".cross-product-checkbox");
        const price = parseFloat(productWithVariants?.price || 0);
        const productId = productWithVariants?.product?.id;

        checkbox.addEventListener('change', (e) => {
            const footer = document.querySelector('cross-footer');
            footer.updatePrice(productId, price, e.target.checked);
        });

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
        // addToCartBtn.style.color = layoutConfigs.btn.bg.color;
        addToCartBtn.style.borderRadius = "2px";
        addToCartBtn.style.borderColor = layoutConfigs.btn.brdr.color;


        container.appendChild(this);
    }

    updatePrice(productId, price, isChecked) {
        if (isChecked) {
            this.prices.set(productId, price);
        } else {
            this.prices.delete(productId);
        }

        const totalPrice = Array.from(this.prices.values()).reduce((sum, p) => sum + p, 0);
        const salePriceSpan = this.querySelector(".cross-sale-price");
        salePriceSpan.textContent = `₹${totalPrice.toFixed(2)}`;
    }
}

customElements.define('plus-sign', PlusSign);
customElements.define('product-container', ProductContainer);
customElements.define('section-heading', SectionHeading);
customElements.define('cross-footer', Footer);

console.log("cart tokens",localStorage.getItem('cartToken'));
const renderSellCross = async () => {
    const sellCrossComponent = document.getElementById("sell-cross-component");
    console.log(sellCrossComponent);
    if (!sellCrossComponent) {
        console.error("Error: sell-cross-component not found in the DOM.");
        return;
    }

    let selectedItems = [];

    // Fetch JSON configuration from the backend
    const fetchUIConfig = async () => {
        const uri = `${location.origin}/apps/store/api/storefront/fetch?` +
            new URLSearchParams({ shop: shopDomain, pid: productId }); // Replace with your actual parameters
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

    // Render UI dynamically based on JSON
    const renderUI = (data) => {
        const variants = data.data.variants;
        const configs = data.data.layout;
        // Clear existing children inside the sell-cross-component
        sellCrossComponent.innerHTML = "";

        // Title
        // const title = document.createElement("h2");
        // title.textContent = "Frequently Bought Together";
        const heading = new SectionHeading()
        heading.add(sellCrossComponent, "Frequently Bought Together");
        // sellCrossComponent.appendChild(title);

        const contentContainer = document.createElement("div");
        contentContainer.className = "cross-content";
        sellCrossComponent.appendChild(contentContainer);
        // Container for items
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

        const footer = new Footer();
        footer.add(contentContainer, configs);

        // contentContainer.
        // Summary Section
        //     const summarySection = document.createElement("div");
        //     summarySection.className = "alphabet-summary";
        //     summarySection.innerHTML = `
        //     <div class="summary-pricing">
        //       <p>Total price: ₹<span id="total-price">0</span> <span id="original-price"></span></p>
        //     </div>
        //     <button id="add-to-cart">Add to Cart</button>
        //   `;
        //     sellCrossComponent.appendChild(summarySection);

        //     attachEventListeners();
    };

    // Update total price
    const updateTotalPrice = () => {
        const total = selectedItems.reduce((sum, item) => sum + parseFloat(item.dataset.price), 0);
        const originalTotal = selectedItems.length * 20; // Example original price logic
        document.getElementById("total-price").textContent = total.toFixed(2);
        document.getElementById("original-price").textContent = `₹${originalTotal.toFixed(2)}`;
    };

    // Attach event listeners to items
    const attachEventListeners = () => {
        const items = document.querySelectorAll(".alphabet-item");
        const checkboxes = document.querySelectorAll(".select-item");

        checkboxes.forEach((checkbox, index) => {
            checkbox.addEventListener("change", () => {
                const item = items[index];
                if (checkbox.checked) {
                    item.classList.add("selected");
                    selectedItems.push(item);
                } else {
                    item.classList.remove("selected");
                    selectedItems = selectedItems.filter((selected) => selected !== item);
                }
                updateTotalPrice();
            });
        });

    };

    // Initialize the UI
    const uiConfig = await fetchUIConfig();
    if (uiConfig) {
        renderUI(uiConfig);
    }
};

renderSellCross();
