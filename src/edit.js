import {
  BlockControls,
  InspectorControls,
  useBlockProps,
} from '@wordpress/block-editor';
import {
  Button,
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  TextareaControl,
  ToolbarButton,
  ToolbarGroup,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import Header from './components/Header';
import ColorPalette from './components/ColorPalette';
import Typography from './components/Typography';
import Buttons from './components/Buttons';
import Textures from './components/Textures';
import SpacingScale from './components/SpacingScale';
import ThemeMapping from './components/ThemeMapping';
import TokenImport from './components/TokenImport';
import { buildGoogleFontsUrl, toFontSelectOptions } from './utils/fonts';
import { exportTokensJson } from './utils/tokens';

const layoutOptions = [
  { label: 'Vertical (800px)', value: 'vertical' },
  { label: 'Horizontal (1440px)', value: 'horizontal' },
];

const themeOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

const textureTypeOptions = [
  { label: 'Solid', value: 'solid' },
  { label: 'Gradient', value: 'gradient' },
  { label: 'Pattern', value: 'pattern' },
];

function parseAdjectives(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSpacing(value) {
  return String(value || '')
    .split(',')
    .map((item) => Number.parseInt(item.trim(), 10))
    .filter((item) => Number.isFinite(item) && item > 0)
    .slice(0, 12);
}

export default function Edit({ attributes, setAttributes }) {
  const {
    brandName,
    tagline,
    adjectives,
    layout,
    theme,
    colors,
    headingFont,
    headingWeight,
    bodyFont,
    bodyWeight,
    buttonRadius,
    buttonTextColor,
    primaryButtonColor,
    secondaryButtonColor,
    textures,
    spacingScale,
  } = attributes;

  useEffect(() => {
    const url = buildGoogleFontsUrl([headingFont, bodyFont]);
    const id = 'mzv-style-tile-editor-fonts';
    const existing = document.getElementById(id);

    if (!url) {
      if (existing) {
        existing.remove();
      }
      return;
    }

    if (existing) {
      existing.setAttribute('href', url);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.id = id;
    link.href = url;
    document.head.appendChild(link);
  }, [headingFont, bodyFont]);

  const updateColor = (index, key, value) => {
    const next = [...colors];
    next[index] = {
      ...next[index],
      [key]: value,
    };
    setAttributes({ colors: next });
  };

  const updateTexture = (index, key, value) => {
    const next = [...textures];
    next[index] = {
      ...next[index],
      [key]: value,
    };
    setAttributes({ textures: next });
  };

  const onTokenImport = (rawJson, updates) => {
    setAttributes({
      ...updates,
      tokensJson: rawJson,
    });
  };

  const onExport = () => {
    const exportPayload = exportTokensJson(attributes);
    const file = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'style-tile.tokens.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const textColor = colors.find((item) => item.role === 'text')?.hex || '#1A1A2E';
  const backgroundColor = colors.find((item) => item.role === 'background')?.hex || '#FAF8F5';

  const blockProps = useBlockProps({
    className: `mzv-style-tile is-layout-${layout} is-theme-${theme}`,
    style: {
      '--mzv-font-heading': headingFont,
      '--mzv-font-body': bodyFont,
      '--mzv-heading-weight': headingWeight,
      '--mzv-body-weight': bodyWeight,
      '--mzv-text-color': textColor,
      '--mzv-surface-color': backgroundColor,
    },
  });

  return (
    <>
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton icon="download" label="Export Tokens JSON" onClick={onExport} />
        </ToolbarGroup>
      </BlockControls>

      <InspectorControls>
        <PanelBody title="Brand" initialOpen>
          <TextControl
            label="Brand Name"
            value={brandName}
            onChange={(value) => setAttributes({ brandName: value })}
          />
          <TextControl
            label="Tagline"
            value={tagline}
            onChange={(value) => setAttributes({ tagline: value })}
          />
          <TextareaControl
            label="Adjectives"
            help="Comma-separated"
            value={(adjectives || []).join(', ')}
            onChange={(value) => setAttributes({ adjectives: parseAdjectives(value) })}
          />
          <SelectControl
            label="Layout"
            value={layout}
            options={layoutOptions}
            onChange={(value) => setAttributes({ layout: value })}
          />
          <SelectControl
            label="Theme"
            value={theme}
            options={themeOptions}
            onChange={(value) => setAttributes({ theme: value })}
          />
        </PanelBody>

        <PanelBody title="Colors" initialOpen={false}>
          {(colors || []).map((color, index) => (
            <div key={`${color.name}-${index}`} className="mzv-style-tile__inspector-row">
              <TextControl
                label={`Color ${index + 1} Name`}
                value={color.name}
                onChange={(value) => updateColor(index, 'name', value)}
              />
              <TextControl
                label="Hex"
                value={color.hex}
                onChange={(value) => updateColor(index, 'hex', value)}
              />
              <TextControl
                label="Role"
                value={color.role}
                onChange={(value) => updateColor(index, 'role', value)}
              />
              <Button
                variant="secondary"
                isDestructive
                onClick={() => setAttributes({
                  colors: colors.filter((_, colorIndex) => colorIndex !== index),
                })}
              >
                Remove Color
              </Button>
            </div>
          ))}
          <Button
            variant="primary"
            onClick={() => setAttributes({
              colors: [
                ...colors,
                { name: `Color ${colors.length + 1}`, hex: '#CCCCCC', role: `custom-${colors.length + 1}` },
              ],
            })}
            disabled={colors.length >= 8}
          >
            Add Color
          </Button>
        </PanelBody>

        <PanelBody title="Typography" initialOpen={false}>
          <SelectControl
            label="Heading Font"
            value={headingFont}
            options={toFontSelectOptions()}
            onChange={(value) => setAttributes({ headingFont: value })}
          />
          <RangeControl
            label="Heading Weight"
            value={headingWeight}
            min={300}
            max={900}
            step={100}
            onChange={(value) => setAttributes({ headingWeight: value })}
          />
          <SelectControl
            label="Body Font"
            value={bodyFont}
            options={toFontSelectOptions()}
            onChange={(value) => setAttributes({ bodyFont: value })}
          />
          <RangeControl
            label="Body Weight"
            value={bodyWeight}
            min={300}
            max={900}
            step={100}
            onChange={(value) => setAttributes({ bodyWeight: value })}
          />
        </PanelBody>

        <PanelBody title="Buttons" initialOpen={false}>
          <TextControl
            label="Primary Color"
            value={primaryButtonColor}
            onChange={(value) => setAttributes({ primaryButtonColor: value })}
          />
          <TextControl
            label="Secondary Color"
            value={secondaryButtonColor}
            onChange={(value) => setAttributes({ secondaryButtonColor: value })}
          />
          <TextControl
            label="Text Color"
            value={buttonTextColor || '#FFFFFF'}
            onChange={(value) => setAttributes({ buttonTextColor: value })}
          />
          <RangeControl
            label="Border Radius"
            value={buttonRadius}
            min={0}
            max={32}
            step={1}
            onChange={(value) => setAttributes({ buttonRadius: value })}
          />
        </PanelBody>

        <PanelBody title="Textures" initialOpen={false}>
          {(textures || []).map((texture, index) => (
            <div key={`${texture.name}-${index}`} className="mzv-style-tile__inspector-row">
              <TextControl
                label={`Texture ${index + 1} Name`}
                value={texture.name}
                onChange={(value) => updateTexture(index, 'name', value)}
              />
              <SelectControl
                label="Type"
                value={texture.type}
                options={textureTypeOptions}
                onChange={(value) => updateTexture(index, 'type', value)}
              />
              <TextControl
                label="Value"
                value={texture.value}
                onChange={(value) => updateTexture(index, 'value', value)}
              />
              <Button
                variant="secondary"
                isDestructive
                onClick={() => setAttributes({
                  textures: textures.filter((_, textureIndex) => textureIndex !== index),
                })}
              >
                Remove Texture
              </Button>
            </div>
          ))}
          <Button
            variant="primary"
            onClick={() => setAttributes({
              textures: [
                ...textures,
                { name: `Texture ${textures.length + 1}`, type: 'solid', value: '#E2E8F0' },
              ],
            })}
            disabled={textures.length >= 4}
          >
            Add Texture
          </Button>
        </PanelBody>

        <PanelBody title="Spacing Scale" initialOpen={false}>
          <TextControl
            label="Spacing values"
            help="Comma-separated px values"
            value={(spacingScale || []).join(', ')}
            onChange={(value) => setAttributes({ spacingScale: parseSpacing(value) })}
          />
        </PanelBody>

        <PanelBody title="Token Import" initialOpen={false}>
          <TokenImport onImport={onTokenImport} />
        </PanelBody>
      </InspectorControls>

      <section {...blockProps}>
        <Header brandName={brandName} tagline={tagline} adjectives={adjectives} />
        <ColorPalette colors={colors} />
        <Typography
          headingFont={headingFont}
          headingWeight={headingWeight}
          bodyFont={bodyFont}
          bodyWeight={bodyWeight}
        />
        <Buttons
          primaryColor={primaryButtonColor}
          secondaryColor={secondaryButtonColor}
          textColor={buttonTextColor || textColor}
          radius={buttonRadius}
        />
        <Textures textures={textures} />
        <SpacingScale spacingScale={spacingScale} />
        <ThemeMapping detectedLabel="Editor Preview" />
      </section>
    </>
  );
}
