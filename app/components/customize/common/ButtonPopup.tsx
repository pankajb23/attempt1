import {
  Popover,
  Button,
  Card,
  Text,
  ColorPicker,
  type HSBAColor,
  BlockStack,
} from '@shopify/polaris';
import { useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { useFormContext } from 'react-hook-form';

export default function ButtonPopup({
  popoverActive,
  setPopoverActive,
  togglePopoverActive,
  activator,
  property,
  setButtonColor,
}) {
  const { setValue } = useFormContext();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPopoverActive(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const [color, setColor] = useState<string>('#ff0000');

  const hslToHexConverter = (hsl: HSBAColor) => {
    return chroma
      .hsl(hsl.hue, hsl.saturation, hsl.brightness)
      .alpha(hsl.alpha)
      .hex('rgba');
  };

  const hexToHslConverter = (hex: string) => {
    const color = chroma(hex);
    const hsl = color.hsl();
    const alpha = color.alpha();
    const hslColor: HSBAColor = {
      hue: hsl[0],
      saturation: hsl[1],
      brightness: hsl[2],
      alpha: alpha,
    };
    return hslColor;
  };

  return (
    <Popover
      active={popoverActive}
      activator={activator}
      onClose={togglePopoverActive}
    >
      <Card roundedAbove="xs">
        <BlockStack gap="100">
          <Text as="p" variant="bodySm" fontWeight="bold">
            Pick Color
          </Text>
          <ColorPicker
            onChange={(c) => {
              const hex = hslToHexConverter(c);
              setColor(hex);
              setButtonColor(hex);
              // setValue(property, hex);
            }}
            color={hexToHslConverter(color)}
            allowAlpha
          />
          <div>
            <div>
              <Button
                size="slim"
                onClick={() => {
                  setValue(property, color);
                  setPopoverActive(false);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </BlockStack>
      </Card>
    </Popover>
  );
}
