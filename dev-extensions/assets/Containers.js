import { getHost } from "./Host";
import * as ConfigNames from "./CommonConfigNames";
import { Footer } from "./FooterContainer";
import { ProductContainer, PlusSign } from "./ProductContainer";
import { log, error } from "./Logging";

export class SellCrossContainer extends HTMLElement {
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
        heading.style.color = this.UIConfigs[ConfigNames.CanvasTextColor];
        heading.style.fontSize = this.appendPx(this.UIConfigs[ConfigNames.CanvasTextSize]);
        // heading.style.fontWeight = this.UIConfigs[ConfigNames.CanvasTextWeight];
        heading.style.fontFamily = this.UIConfigs[ConfigNames.CanvasTextFamily];



        container.style.backgroundColor = this.UIConfigs[ConfigNames.CanvasBackgroundColor];

        container.style.borderRadius = this.appendPx(this.UIConfigs[ConfigNames.CanvasBorderRadius]);
        container.style.borderColor = this.UIConfigs[ConfigNames.CanvasBorderColor];
        container.style.borderWidth = this.appendPx(this.UIConfigs[ConfigNames.CanvasBorderWidth]);

        container.style.paddingLeft = this.appendPx(this.UIConfigs[ConfigNames.CanvasLeftPadding]);
        container.style.paddingRight = this.appendPx(this.UIConfigs[ConfigNames.CanvasRightPadding]);
        container.style.paddingTop = this.appendPx(this.UIConfigs[ConfigNames.CanvasTopPadding]);
        container.style.paddingBottom = this.appendPx(this.UIConfigs[ConfigNames.CanvasBottomPadding]);

        container.style.marginLeft = this.appendPx(this.UIConfigs[ConfigNames.CanvasLeftMargin]);
        container.style.marginRight = this.appendPx(this.UIConfigs[ConfigNames.CanvasRightMargin]);
        container.style.marginTop = this.appendPx(this.UIConfigs[ConfigNames.CanvasTopMargin]);
        container.style.marginBottom = this.appendPx(this.UIConfigs[ConfigNames.CanvasBottomMargin]);

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

    addFooter(offerId, discountAmount, discountMode, variantsLength, discountTitle) {
        log("discountTitle in containers", discountTitle);
        this.footer = new Footer(this.UIConfigs, this.currencyFormat, offerId, discountAmount, discountMode, variantsLength, discountTitle);
    }

    resize() {
        const componentHeight = document.querySelector(".cross-sell-product-image")?.height

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
            const footer = this.querySelector("cross-sell-footer");
            console.log("footer", footer);
            const crossSellContent = this.querySelector("#cross-sell-content");
            const crossSellContainer = this.querySelector("#cross-sell-container");

            log("window.innerWidth", window.innerWidth);

            if (window.innerWidth < 768 && footer.parentNode === crossSellContent) {
                // move footer outside, append the css classes
                crossSellContainer.appendChild(footer);
                footer.classList.add("cross-sell-footer-mobile");
                footer.classList.add("right-padding-5");
                // footer.classList.remove("cross-sell-footer");
            } else if (window.innerWidth > 768 && footer.parentNode !== crossSellContent) {
                // move footer inside.
                crossSellContent.appendChild(footer);
                // footer.classList.add("cross-sell-footer");
                footer.classList.remove("cross-sell-footer-mobile");
                footer.classList.remove("right-padding-5");
            }
        });

        window.addEventListener("resize", () => {
            // console.log("resizing");
            this.resize();
        });

        requestAnimationFrame(() => {   
            console.log("initializing resize");
            this.resize();
        });
    }
}
