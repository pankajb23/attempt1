import { InlineStack } from '@shopify/polaris';
import OfferWidget from './widget';
import OfferWidgets from 'app/lib/data/OfferWidgets';
import { useMemo, useState, useEffect } from 'react';

export default function WidgetManager({ filter, navigateTo }) {
  const widgets = OfferWidgets();
  const [chunkSize, setChunkSize] = useState(3);
  // Determine chunk size based on window width (example)
  const updateChunkSize = () => {
    const width = window.innerWidth;
    // console.log("width", width);
    if (width < 480) {
      setChunkSize(1);
    } else if (width < 768) {
      setChunkSize(2);
    } else {
      setChunkSize(3);
    }
  };

  const chunk = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  useEffect(() => {
    updateChunkSize();
    window.addEventListener('resize', updateChunkSize);
    return () => window.removeEventListener('resize', updateChunkSize);
  }, []);

  const allWidgetsFromGrpToWMap = useMemo(() => {
    const map = new Map();
    widgets.forEach((w) => {
      const widgetElement = (
        <OfferWidget
          header={w.heading}
          message={w.content}
          img={w.img}
          key={w.id}
          navigateTo={navigateTo}
          offerType={w.offerType}
          badge={w.badge}
        />
      );

      if (!map.has(w.grps)) {
        map.set(w.grps, [widgetElement]);
      } else {
        map.get(w.grps).push(widgetElement);
      }
    });

    return map;
  }, [widgets]);

  const allWidgetsAsChunks = useMemo(() => {
    if (filter === 'All') {
      const allWidgetsArray = Array.from(
        allWidgetsFromGrpToWMap.values()
      ).flat();
      return chunk(allWidgetsArray, chunkSize);
    } else {
      return chunk(allWidgetsFromGrpToWMap.get(filter) ?? [], chunkSize);
    }
  }, [chunkSize]);

  const page = (
    <>
      {allWidgetsAsChunks.map((widgets, index) => (
        <InlineStack
          key={index}
          wrap={false}
          gap="300"
          direction={'row'}
          align="start"
        >
          {widgets}
        </InlineStack>
      ))}
    </>
  );

  return (
    <>
      <div className="cardContainer">{page}</div>

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
