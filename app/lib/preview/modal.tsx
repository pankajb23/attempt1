import './style.css';
import type { Product } from "app/types";
import { useState } from 'react';
import * as  CommonConfigsName from 'app/components/customize/commonSettings/CommonConfigsName';

function Component({ product, shouldAddSignSymbol, commonStyling }: { product: Product, shouldAddSignSymbol: boolean, commonStyling }) {
    const [selectVariant, setSelectVariant] = useState(product.variants[0].id);

    // console.log("variants", product.variants);
    const handleVariantChange = (e) => {
        const selectedId = e.target.value;
        const variant = product.variants.find((v) => v.id === selectedId);
        console.log("selectId", selectedId, variant.id);


        setSelectVariant(variant.id); // Update the selected variant
    };

    const selectV = product.variants.find(variant => variant.id === selectVariant);
    // console.log("selectV", selectV);
    return (
        <>
            <div className="product">

                <div className="product-image-container">
                    <div className="checkbox-container">
                        <input type="checkbox" className="product-checkbox" defaultChecked />
                    </div>
                    <img
                        src={product.img}
                        alt="Product 2"
                        className="product-image"
                    />
                </div>
                <div className="product-title">
                    <span style={{ color: commonStyling?.textColor }} >
                        <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {product.title}
                        </a>
                    </span>
                </div>
                <div className="variant-and-price" >
                    <div className="variant">

                        {
                            // product.variants.length === 1
                            // ? (
                            //     // If there's only one variant, just show its title
                            //     product.variants[0].title
                            // )
                            (
                                // Otherwise, render a dropdown of all variants
                                <select onChange={handleVariantChange}>
                                    {product.variants.map((variant, index) => (
                                        <option key={index} value={variant.id}>
                                            {variant.title}
                                        </option>
                                    ))}
                                </select>
                            )
                        }
                    </div>
                    <div className="product-price">
                        <span style={{ color: commonStyling[CommonConfigsName.TotalPriceComponentTextColor] }}>{selectV.price}</span>
                    </div>
                </div>

            </div >
            {shouldAddSignSymbol && <div className="plus-symbol">+</div>
            }
        </>
    );
}


function Button({ commonStyling }: { commonStyling }) {
    return <button className="add-to-cart-btn" style={{
        "--button-border-radius": `${commonStyling[CommonConfigsName.ButtonBorderRadius]}px`,
        "--button-background-color": `${commonStyling[CommonConfigsName.ButtonBackgroundColor]}`,
        "--button-border-width": `${commonStyling[CommonConfigsName.ButtonBorderWidth]}px`,
        "--button-text-color": `${commonStyling[CommonConfigsName.ButtonTextColor]}`,
        "--button-border-color": `${commonStyling[CommonConfigsName.ButtonBorderColor]}`,
        "--button-text-family": `${commonStyling[CommonConfigsName.ButtonTextFamily]}`
    }}>Add to Cart</button>
}
/**
 * 
 * @param products array of {id, title, priceTitle, priceValue, img}
 * @returns 
 */



function Web({ products, commonStyling, productsCount }: { products: Product[], commonStyling, productsCount: number }) {
    const slicedArray = products.slice(0, productsCount);
    const borderWidth = commonStyling[CommonConfigsName.CanvasBorderWidth] ?? 0; // Default to 0 if null/undefined
    const borderColor = commonStyling[CommonConfigsName.CanvasBorderColor] ?? '#000000'; // Default to black
    const borderRadius = commonStyling[CommonConfigsName.CanvasBorderRadius] ?? 0; // Default to 0 if null/undefined

    const style = {
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: `${borderRadius}px`,
    };

    return (
        <div id="sell-cross-container" style={{
            backgroundColor: commonStyling[CommonConfigsName.CanvasBackgroundColor],
            padding: [
                commonStyling[CommonConfigsName.CanvasTopPadding],
                commonStyling[CommonConfigsName.CanvasRightPadding],
                commonStyling[CommonConfigsName.CanvasBottomPadding],
                commonStyling[CommonConfigsName.CanvasLeftPadding]
            ].filter(value => value !== undefined).map(value => `${value}px`).join(' ') || undefined,
            border: `${commonStyling[CommonConfigsName.CanvasBorderWidth]}px solid ${commonStyling[CommonConfigsName.CanvasBorderColor]}`,
            borderRadius: `${commonStyling[CommonConfigsName.CanvasBorderRadius]}px`
        }}>
            {/* Heading Section */}
            <div id="heading">
            <div id="sell-title" style={{fontSize: commonStyling[CommonConfigsName.CanvasTextSize] + 'px', fontFamily: commonStyling[CommonConfigsName.CanvasTextFamily] , color: commonStyling[CommonConfigsName.CanvasTextColor] }}>
                    <span  >
                        Frequently Bought Together
                    </span>
                </div>
            </div>

            {/* Products Section */}
            <div id="content">
                <div id="products">
                    {
                        slicedArray.map((product, index) => {
                            return <Component
                                key={index}
                                product={product}
                                shouldAddSignSymbol={index !== slicedArray.length - 1}
                                commonStyling={commonStyling}
                            />
                        })
                    }
                </div>

                {/* Footer Section */}
                <div id="footer">
                    <div className="total-price">
                        <span style={{ color: "#000000" }} >
                            Total price:
                        </span>
                        <span style={{ color: commonStyling[CommonConfigsName.TotalPriceTextColor] }}>
                            ₹2,323.00
                        </span>
                        <span className='total-price-cross' style={{ marginLeft: '6px', color: commonStyling[CommonConfigsName.TotalPriceCrossedOutTextColor] }}>
                            ₹2,623.00
                        </span>
                    </div>
                    <Button commonStyling={commonStyling} />
                </div>
            </div>
        </div>
    );
}


function Mobile({ products, commonStyling, productsCount }: { products: Product[], commonStyling, productsCount: number }) {
    const slicedArray = products.slice(0, productsCount);
    return (
        <div id="sell-cross-container" style={{
            backgroundColor: commonStyling[CommonConfigsName.CanvasBackgroundColor],
            padding: [
                commonStyling[CommonConfigsName.CanvasTopPadding],
                commonStyling[CommonConfigsName.CanvasRightPadding],
                commonStyling[CommonConfigsName.CanvasBottomPadding],
                commonStyling[CommonConfigsName.CanvasLeftPadding]
            ].filter(value => value !== undefined).map(value => `${value}px`).join(' ') || undefined
        }}>
            {/* Heading Section */}
            <div id="heading">
                <div id="sell-title" style={{fontSize: commonStyling[CommonConfigsName.CanvasTextSize] + 'px', fontFamily: commonStyling[CommonConfigsName.CanvasTextFamily] , color: commonStyling[CommonConfigsName.CanvasTextColor] }}>
                    <span  >
                        Frequently Bought Together
                    </span>
                </div>
            </div>

            {/* Products Section */}
            <div id="content">
                <div id="products">
                    {
                        slicedArray.map((product, index) => {
                            return <Component
                                key={index}
                                product={product}
                                shouldAddSignSymbol={index !== slicedArray.length - 1}
                                commonStyling={commonStyling}
                            />
                        })
                    }
                </div>
            </div>
            {/* Footer Section */}
            <div id="mobile-footer">
                <div className="total-price">
                    <span style={{ color: "#FFFFFF" }} >
                        Total price:
                    </span>
                    <span style={{ color: commonStyling[CommonConfigsName.TotalPriceTextColor] || "#FF0000" }}>
                        ₹2,323.00
                    </span>
                    <span className='total-price-cross' style={{ marginLeft: '6px', color: commonStyling[CommonConfigsName.TotalPriceCrossedOutTextColor] }}>
                        ₹2,623.00
                    </span>
                </div>
                <Button commonStyling={commonStyling} />
            </div>
        </div>
    );
}

export default function ProductPreview({ products, commonStyling, isWeb, productCounts }: { products: Product[], commonStyling, isWeb: Boolean, productCounts: number }) {

    return (

        <div>
            {isWeb ? <Web products={products} commonStyling={commonStyling} productsCount={productCounts} /> : <Mobile products={products} commonStyling={commonStyling} productsCount={productCounts} />}
        </div>
    )
}
