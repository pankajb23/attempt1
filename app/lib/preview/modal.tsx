import './style.css';
import type { CommonStyling, Product } from "app/types";

function Component({ product, shouldAddSignSymbol, commonStyling }: { product: Product, shouldAddSignSymbol: boolean, commonStyling: CommonStyling }) {
    return (
        <>
            <div className="product">
                <div className="checkbox-container">
                    <input type="checkbox" className="product-checkbox" defaultChecked />
                </div>
                <img
                    src={product.img}
                    alt="Product 2"
                    className="product-image"
                />
                <div className="product-title">
                    <span style={{ color: commonStyling?.textColor }} >
                        {product.title}
                    </span>
                </div>
                <div className="product-price">
                    <span style={{ color: commonStyling?.salePriceColor || "#FF0000" }}>{product.price}</span>
                </div>
            </div>
            {shouldAddSignSymbol && <div className="plus-symbol">+</div>}
        </>
    );
}
/**
 * 
 * @param products array of {id, title, priceTitle, priceValue, img}
 * @returns 
 */


function Web({ products, commonStyling }: { products: Product[], commonStyling: CommonStyling }) {
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
                        products.map((product, index) => {
                            return <Component
                                key={index}
                                product={product}
                                shouldAddSignSymbol={index !== products.length - 1}
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


function Mobile({ products, commonStyling }: { products: Product[], commonStyling: CommonStyling }) {
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
                        products.map((product, index) => {
                            return <Component
                                key={index}
                                product={product}
                                shouldAddSignSymbol={index !== products.length - 1}
                                commonStyling={commonStyling}
                            />
                        })
                    }
                </div>
            </div>
            {/* Footer Section */}
            <div id="mobile-footer">
                <div className="total-price">
                    <span style={{ color: commonStyling?.textColor || "#FFFFFF"}} >
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

export default function ProductPreview({ products, commonStyling, isWeb }: { products: Product[], commonStyling: CommonStyling, isWeb: Boolean }) {
    return (

        <>
            {isWeb ? <Web products={products} commonStyling={commonStyling} /> : <Mobile products={products} commonStyling={commonStyling} />}
        </>
    )
}
