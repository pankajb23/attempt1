import {
    InlineStack
} from "@shopify/polaris";
import OfferWidget from "./widget";
import OfferWidgets from "app/lib/data/OfferWidgets";

function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + 3));
    }
    return chunks;
}

export default function WidgetManager({ filter, navigateTo }) {
    const widgets = OfferWidgets();

    const allWidgetsAsChunks = chunk(widgets
        .filter(widget => filter === "All" || widget.grps === filter), 3);

    const page = (
        <>
            {allWidgetsAsChunks.map((widgets, index) => (
                <InlineStack key={index} wrap={false} gap='300' direction={'row'} align="start">
                    {widgets.map((w) => (
                        <OfferWidget
                            header={w.heading}
                            message={w.content}
                            img={w.img}
                            key={w.id}
                            navigateTo={navigateTo}
                            offerType={w.offerType}
                            badge={w.badge}
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