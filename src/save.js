import { useBlockProps } from '@wordpress/block-editor';
import Header from './components/Header';
import ColorPalette from './components/ColorPalette';
import Typography from './components/Typography';
import Buttons from './components/Buttons';
import Textures from './components/Textures';
import SpacingScale from './components/SpacingScale';
import ThemeMapping from './components/ThemeMapping';

export default function save({ attributes }) {
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

  const textColor = colors.find((item) => item.role === 'text')?.hex || '#1A1A2E';
  const backgroundColor = colors.find((item) => item.role === 'background')?.hex || '#FAF8F5';

  const blockProps = useBlockProps.save({
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
      <ThemeMapping />
    </section>
  );
}
