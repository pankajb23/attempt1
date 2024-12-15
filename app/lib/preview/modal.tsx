import './style.css';

export default function ProductPreview() {
    return (
        <div id="sell-cross-container">
            {/* Heading Section */}
            <div id="heading">
                <div id="sell-title">Frequently Bought Together</div>
                <div id="sell-title-sub">Get 10% off on add-ons.</div>
            </div>

            {/* Products Section */}
            <div id="content">
                <div id="products">
                    {/* Product 1 */}
                    <div className="product">
                        <div className="checkbox-container">
                            <input type="checkbox" className="product-checkbox" defaultChecked />
                        </div>
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Product 1"
                            className="product-image"
                        />
                        <div className="product-title">
                            Toddler Monkey Caps Winter Woolen Knit Hat
                        </div>
                        <div className="product-price">₹399.00</div>
                    </div>

                    {/* Plus Symbol */}
                    <div className="plus-symbol">+</div>

                    {/* Product 2 */}
                    <div className="product">
                        <div className="checkbox-container">
                            <input type="checkbox" className="product-checkbox" defaultChecked />
                        </div>
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Product 2"
                            className="product-image"
                        />
                        <div className="product-title">
                            Pampers All Round Protection Baby Diapers
                        </div>
                        <div className="product-price">₹1,924.00</div>
                    </div>

                    {/* <div className="plus-symbol">+</div> */}

                    {/* Product 3 */}
                    {/* <div className="product">
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Product 2"
                            className="product-image"
                        />
                        <div className="product-title">
                            Pampers All Round Protection Baby Diapers
                        </div>
                        <div className="product-price">₹1,924.00</div>
                    </div> */}
                </div>

                {/* Footer Section */}
                <div id="footer">
                    <div className="total-price">
                        Total price: <span>₹2,323.00</span>
                    </div>
                    <button className="add-to-cart-btn">Add both to Cart</button>
                </div>
            </div>
        </div>
    );
}
