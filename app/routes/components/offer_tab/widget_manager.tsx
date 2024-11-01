import { Layout, Card, Text, Button, InlineStack } from "@shopify/polaris";
import OfferWidget from "./widget";

const widgets = [
    {
        id: "1",
        heading: "Frequently bought together",
        content: "Create a pre-selected bundle offer displayed below Shopify's Add to cart button",
        img: "https://lb-apps-media.s3.amazonaws.com/Selleasy-media/FBT.png",
        grps: "Product"
    },
    {
        id: "2",
        heading: "Product add-ons",
        content: "Display related product as quick add-ons above Shopify's Add to cart button",
        img: "https://lb-apps-media.s3.amazonaws.com/Selleasy-media/Product+Addon.png",
        grps: "Product"
    },
    {
        id: "3",
        heading: "Cart add-ons",
        content: "Display multiple products as quick add-ons just before checkout.",
        img: "https://lb-apps-media.s3.amazonaws.com/Selleasy-media/Cart+Addon.png",
        grps: "Cart"
    },
    {
        id: "4",
        heading: "Cart upsell & downsell",
        content: "Display upsell and downsell offer based on customer accepting or declining a offer.",
        img: "	https://lb-apps-media.s3.amazonaws.com/Selleasy-media/Funnel.png",
        grps: "Cart"
    },
    {
        id: "5",
        heading: "Post purchase upsell",
        content: "Display one click upsell offer after order confirmation & payment.",
        img: "https://lb-apps-media.s3.amazonaws.com/Selleasy-media/Post+Purchase.png",
        grps: "Post"
    },
    {
        id: "6",
        heading: "Thank you page add-ons",
        content: "Display multiple products related to confirmed order on Thank you page.",
        img: "https://lb-apps-media.s3.amazonaws.com/Selleasy-media/Thankyou+page.png",
        grps: "Post"
    }
]

function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + 3));
    }
    return chunks;
}

export default function WidgetManager({ filter }) {
    const allWidgetsAsChunks = chunk(widgets
        .filter(widget => filter === "All" || widget.grps === filter), 3);
    
    console.log("allwidgets " + allWidgetsAsChunks);    
    const page = (
        <>
            {allWidgetsAsChunks.map((widgets, index) => (
                <InlineStack key={index} wrap={false} gap='300' direction={'row'} >
                    {widgets.map((w) => (
                        <OfferWidget
                            header={w.heading}
                            message={w.content}
                            img={w.img}
                            key={w.id}
                        />
                    ))}
                </InlineStack>
            ))}
        </>
    );

    return (
        <>
            <div className="cardContainer">
                {page}
            </div>

            <style>{`
            .cardContainer {
              display: flex;
              flex-wrap: wrap;
              gap: 16px;
            }
            
    

            @media (max-width: 768px) {
              .cardContainer > div {
                flex: 1 1 calc(50% - 16px); /* 2 cards per row */
              }
            }
    
            @media (max-width: 480px) {
              .cardContainer > div {
                flex: 1 1 calc(100% - 16px); /* 1 card per row */
              }
            }
          `}</style>
        </>
    );
}