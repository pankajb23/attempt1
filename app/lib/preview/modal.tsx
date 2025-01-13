import './style.css';
import type { Product } from "app/types";
import { useState, useEffect } from 'react';
import * as  CommonConfigsName from 'app/components/customize/commonSettings/CommonConfigsName';

function Component({ product, shouldAddSignSymbol, commonStyling, updateProductToPriceMap, removeProductFromPriceMap, currencyFormat }: { product: Product, shouldAddSignSymbol: boolean, commonStyling, updateProductToPriceMap: (productId: string, price: number) => void, removeProductFromPriceMap: (productId: string) => void, currencyFormat: string}) {
    const [selectVariant, setSelectVariant] = useState(product.variants[0].id);
    const [opacity, setOpacity] = useState(1);

    const regex = /{{(.*?)}}/g;

    const handleVariantChange = (e) => {
        const selectedId = e.target.value;
        const variant = product.variants.find((v) => v.id === selectedId);
        console.log("selectId", selectedId, variant.id);


        setSelectVariant(variant.id); // Update the selected variant
        alterProducts(true);
    };

    

    const alterProducts = (isChecked: boolean) => {
        if (isChecked) {
            updateProductToPriceMap(product.id, product.variants.find(variant => variant.id === selectVariant).price);
        } else {
            removeProductFromPriceMap(product.id);
        }
    }

    useEffect(() => {
        // Initialize with the first variant's price
        console.log("product", product);
        alterProducts(true);
    }, []); // Empty dependency array means this runs once on mount


    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        alterProducts(isChecked);
        setOpacity(isChecked ? 1 : 0.5);
    };

    const selectV = product.variants.find(variant => variant.id === selectVariant);
    return (
        <>
            <div className="cross-sell-product" style={{opacity: opacity}}>

                <div className="cross-sell-product-image-container">
                    <div className="cross-sell-checkbox-container">
                        <input type="checkbox" className="cross-sell-product-checkbox" defaultChecked onClick={handleCheckboxChange} />
                    </div>
                    <img
                        src={product.img}
                        alt="Product 2"
                        className="cross-sell-product-image"
                    />
                </div>
                <div className="cross-sell-product-title">
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
                <div className="cross-sell-variant-and-price" >
                    <div className="cross-sell-variant">
                        {
                            (
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
                    <div className="cross-sell-product-price">
                        <span style={{ color: commonStyling[CommonConfigsName.TotalPriceComponentTextColor] }}>{currencyFormat.replace(regex, selectV.price)}</span>
                    </div>
                </div>

            </div >
            {shouldAddSignSymbol && <div className="cross-sell-plus-symbol">+</div>
            }
        </>
    );
}


function Button({ commonStyling, isCartEmpty }: { commonStyling, isCartEmpty: boolean }) {
    return <button className="cross-sell-add-to-cart-btn" style={{
        "--button-border-radius": `${commonStyling[CommonConfigsName.ButtonBorderRadius]}px`,
        "--button-background-color": `${commonStyling[CommonConfigsName.ButtonBackgroundColor]}`,
        "--button-border-width": `${commonStyling[CommonConfigsName.ButtonBorderWidth]}px`,
        "--button-text-color": `${commonStyling[CommonConfigsName.ButtonTextColor]}`,
        "--button-border-color": `${commonStyling[CommonConfigsName.ButtonBorderColor]}`,
        "--button-text-family": `${commonStyling[CommonConfigsName.ButtonTextFamily]}`
    }}>{"Add to Cart"}</button>
}
/**
 * 
 * @param products array of {id, title, priceTitle, priceValue, img}
 * @returns 
 */


function Footer({ commonStyling, isWeb, productToPriceMap, currencyFormat }: { commonStyling, isWeb: Boolean, productToPriceMap: Record<string, number>, currencyFormat: string }) {
    const mobileClassName = isWeb ? 'cross-sell-footer' : 'cross-sell-mobile-footer';
    const sumOfPrices = Object.values(productToPriceMap).reduce((sum, price) =>{
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        return sum + numericPrice;
    }, 0);
    const nintyPercentOff = sumOfPrices * 0.9;

    const formattedTotal = isNaN(nintyPercentOff) ? '0.00' : nintyPercentOff.toFixed(2).toString();
    const formattedOriginal = isNaN(sumOfPrices) ? '0.00' : sumOfPrices.toFixed(2).toString();

    const regex = /{{(.*?)}}/g;

    console.log("productToPriceMap", productToPriceMap);
    console.log("currencyFormat", formattedTotal, formattedOriginal, '  ',sumOfPrices, '   ',nintyPercentOff);
    return (
        <div id={mobileClassName}>
            <div className="cross-sell-total-price">
                <span >
                    Total price:
                </span>
                <span style={{ color: commonStyling[CommonConfigsName.TotalPriceTextColor] }}>
                    {currencyFormat.replace(regex, formattedTotal)}
                </span>
                <span className='cross-sell-total-price-cross' style={{ marginLeft: '6px', color: commonStyling[CommonConfigsName.TotalPriceCrossedOutTextColor] }}>
                    {currencyFormat.replace(regex, formattedOriginal)}
                </span>
            </div>
            <Button commonStyling={commonStyling} isCartEmpty={productToPriceMap.length === 0 }/>
        </div>
    )
}

function Web({ products, commonStyling, productsCount, isWeb, currencyFormat }: { products: Product[], commonStyling, productsCount: number, isWeb: Boolean, currencyFormat: string  }) {
    const slicedArray = products.slice(0, productsCount);
    const borderWidth = commonStyling[CommonConfigsName.CanvasBorderWidth] ?? 0; // Default to 0 if null/undefined
    const borderColor = commonStyling[CommonConfigsName.CanvasBorderColor] ?? '#000000'; // Default to black
    const borderRadius = commonStyling[CommonConfigsName.CanvasBorderRadius] ?? 0; // Default to 0 if null/undefined

    const [productToPriceMap, setProductToPriceMap] = useState<Record<string, number>>({});

    const removeProductFromPriceMap = (productId: string) => {
        setProductToPriceMap((prevMap) => {
            const { [productId]: _, ...rest } = prevMap;
            return rest;
        });
    };


    const updateProductToPriceMap = (productId, price) => {
        setProductToPriceMap((prevMap) => ({
            ...prevMap,
            [productId]: price
        }));
    };

    const style = {
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: `${borderRadius}px`,
    };

    const footer = <Footer commonStyling={commonStyling} isWeb={isWeb} productToPriceMap={productToPriceMap} currencyFormat={currencyFormat} />

    return (
        <div id="cross-sell-container" style={{
            backgroundColor: commonStyling[CommonConfigsName.CanvasBackgroundColor],
            padding: [
                commonStyling[CommonConfigsName.CanvasTopPadding],
                commonStyling[CommonConfigsName.CanvasRightPadding],
                commonStyling[CommonConfigsName.CanvasBottomPadding],
                commonStyling[CommonConfigsName.CanvasLeftPadding]
            ].filter(value => value !== undefined).map(value => `${value}px`).join(' ') || undefined,
            margin: [
                commonStyling[CommonConfigsName.CanvasTopMargin],
                commonStyling[CommonConfigsName.CanvasRightMargin],
                commonStyling[CommonConfigsName.CanvasBottomMargin],
                commonStyling[CommonConfigsName.CanvasLeftMargin]
            ].filter(value => value !== undefined).map(value => `${value}px`).join(' ') || undefined,
            border: `${commonStyling[CommonConfigsName.CanvasBorderWidth]}px solid ${commonStyling[CommonConfigsName.CanvasBorderColor]}`,
            borderRadius: `${commonStyling[CommonConfigsName.CanvasBorderRadius]}px`
        }}>
            {/* Heading Section */}
            <div id="cross-sell-heading">
                <div id="cross-sell-title" style={{ fontSize: commonStyling[CommonConfigsName.CanvasTextSize] + 'px', fontFamily: commonStyling[CommonConfigsName.CanvasTextFamily], color: commonStyling[CommonConfigsName.CanvasTextColor] }}>
                    <span  >
                        Frequently Bought Together
                    </span>
                </div>
                <div id="cross-sell-discount-text">
                    <span >
                        Buy with 10% off
                    </span>
                </div>
            </div>

            {/* Products Section */}
            <div id="cross-sell-content" style={{ justifyContent: isWeb ? 'normal' : 'center' }}>
                {/* <div id="cross-sell-products"> */}
                {
                    slicedArray.map((product, index) => {
                        return <Component
                            key={index}
                            product={product}
                            shouldAddSignSymbol={index !== slicedArray.length - 1}
                            commonStyling={commonStyling}
                            updateProductToPriceMap={updateProductToPriceMap}
                            removeProductFromPriceMap={removeProductFromPriceMap}
                            currencyFormat={currencyFormat}
                        />
                    })
                }
                {/* </div> */}

                {/* Footer Section */}
                {isWeb && footer}
            </div>
            {!isWeb && footer}
        </div>
    );
}




export default function ProductPreview({ products, commonStyling, isWeb, productCounts, currencyFormat }: { products: Product[], commonStyling, isWeb: Boolean, productCounts: number, currencyFormat: string }) {

    return (

        <div>
            {<Web products={products} commonStyling={commonStyling} productsCount={productCounts} isWeb={isWeb} currencyFormat={currencyFormat} />}
        </div>
    )
}
