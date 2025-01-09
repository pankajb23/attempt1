import './style.css';
import type { CommonStyling, Product } from "app/types";
import { useState } from 'react';
function Component({ product, shouldAddSignSymbol, commonStyling }: { product: Product, shouldAddSignSymbol: boolean, commonStyling: CommonStyling }) {
    const [selectVariant, setSelectVariant] = useState(product.variants[0].id);

    console.log("variants", product.variants);
    const handleVariantChange = (e) => {
        const selectedId = e.target.value;
        const variant = product.variants.find((v) => v.id === selectedId);
        console.log("selectId", selectedId, variant.id);


        setSelectVariant(variant.id); // Update the selected variant
    };

    const selectV = product.variants.find(variant => variant.id === selectVariant);
    console.log("selectV", selectV);
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
                        <span style={{ color: commonStyling?.salePriceColor || "#FF0000" }}>{selectV.price}</span>
                    </div>
                </div>

            </div >
            {shouldAddSignSymbol && <div className="plus-symbol">+</div>
            }
        </>
    );
}
/**
 * 
 * @param products array of {id, title, priceTitle, priceValue, img}
 * @returns 
 */


function Web({ products, commonStyling, productsCount }: { products: Product[], commonStyling: CommonStyling, productsCount: number }) {
    const slicedArray = products.slice(0, productsCount);
    return (
        <div id="sell-cross-container">
            {/* Heading Section */}
            <div id="heading">
                <div id="sell-title">
                    <span style={{ color: commonStyling?.textColor }} >
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
                        <span style={{ color: commonStyling?.textColor }} >
                            Total price:
                        </span>
                        <span style={{ color: commonStyling?.salePriceColor || "#FF0000" }}>
                            ₹2,323.00
                        </span>
                        <span className='total-price-cross' style={{ marginLeft: '6px', color: commonStyling?.compareAtPriceColor }}>
                            ₹2,623.00
                        </span>
                    </div>
                    <button className="add-to-cart-btn" style={{
                        "--custom-radius": `${commonStyling?.borderRadius}px`,
                        "--btn-bg-color": `${commonStyling?.buttonBgColor}`,
                        "--btn-wth": `${commonStyling?.buttonBorderWidth}px`,
                        "--btn-text-color": `${commonStyling?.buttonTextColor}`,
                        "--btn-brdr-color": `${commonStyling?.buttonBorderColor}`
                    }}>Add to Cart</button>
                </div>
            </div>
        </div>
    );
}


function Mobile({ products, commonStyling, productsCount }: { products: Product[], commonStyling: CommonStyling, productsCount: number }) {
    const slicedArray = products.slice(0, productsCount);
    return (
        <div id="sell-cross-container">
            {/* Heading Section */}
            <div id="heading">
                <div id="sell-title">
                    <span style={{ color: commonStyling?.textColor }} >
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
                    <span style={{ color: commonStyling?.textColor || "#FFFFFF" }} >
                        Total price:
                    </span>
                    <span style={{ color: commonStyling?.salePriceColor || "#FF0000" }}>
                        ₹2,323.00
                    </span>
                    <span className='total-price-cross' style={{ marginLeft: '6px', color: commonStyling?.compareAtPriceColor }}>
                        ₹2,623.00
                    </span>
                </div>
                <button className="add-to-cart-btn" style={{
                    "--custom-radius": `${commonStyling?.borderRadius}px`,
                    "--btn-bg-color": `${commonStyling?.buttonBgColor}`,
                    "--btn-wth": `${commonStyling?.buttonBorderWidth}px`,
                    "--btn-text-color": `${commonStyling?.buttonTextColor}`,
                    "--btn-brdr-color": `${commonStyling?.buttonBorderColor}`,
                    "--btn-width": '100%'
                }}>Add to Cart</button>
            </div>
        </div>
    );
}

export default function ProductPreview({ products, commonStyling, isWeb, productCounts }: { products: Product[], commonStyling: CommonStyling, isWeb: Boolean, productCounts: number }) {

    return (

        <div>
            {isWeb ? <Web products={products} commonStyling={commonStyling} productsCount={productCounts} /> : <Mobile products={products} commonStyling={commonStyling} productsCount={productCounts} />}
        </div>
    )
}
