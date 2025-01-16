export class ProductContainer extends HTMLElement {
    constructor(UIConfigs, currencyFormat, footer) {
        super();
        this.UIConfigs = UIConfigs;
        this.pid = null;
        this.footer = footer;
        // Create a template and set innerHTML once
        const template = document.createElement("template");
        template.innerHTML = `
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
        this.product = null;
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

    add(container, productWithVariants) {

        const product = productWithVariants?.product;
        this.product = productWithVariants?.product;


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

        function getPriceForVariantId(variantId) {
            const variant = product.variants?.nodes?.find(v => v.id === variantId);
            return variant?.price?.amount ?? 0;
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

        this.priceSpan.style.color = this.UIConfigs[ConfigNames.TotalPriceComponentTextColor];
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

            const element = this.querySelector(".cross-sell-product");
            console.log(" changing opacity to ", this.isChecked(), element);
            if (this.isChecked()) {
                element.style.opacity = 1;
            } else {
                element.style.opacity = 0.5;
            }
        });

        function resize() {
            const height = this.querySelector(".cross-sell-product-image").style.height
            console.log("height", height);
            this.querySelector(".cross-sell-plus-symbol").style.paddingTop = height / 2;
        }

        window.addEventListener("resize", () => {
            resize();
        });

        resize();
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

