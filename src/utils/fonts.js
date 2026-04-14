export const SYSTEM_FONTS = [
  'Inter',
  'Arial',
  'Helvetica',
  'Georgia',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
  'Tahoma',
  'Courier New',
  'system-ui',
  'sans-serif',
  'serif',
  'monospace',
];

export const FONT_OPTIONS = [
  'Inter',
  'DM Sans',
  'Fraunces',
  'Lora',
  'Merriweather',
  'Playfair Display',
  'Libre Baskerville',
  'Work Sans',
  'Space Grotesk',
  'Manrope',
  'Plus Jakarta Sans',
  'Source Sans 3',
  'Outfit',
  'Poppins',
  'Montserrat',
  'Raleway',
  'Cormorant Garamond',
  'Nunito Sans',
  'Archivo',
  'Karla',
  ...SYSTEM_FONTS,
].filter((font, index, arr) => arr.indexOf(font) === index);

const SYSTEM_FONT_SET = new Set(SYSTEM_FONTS.map((font) => font.toLowerCase()));

export function buildGoogleFontsUrl(fontFamilies = []) {
  const families = fontFamilies
    .map((font) => String(font || '').trim())
    .filter((font) => font && !SYSTEM_FONT_SET.has(font.toLowerCase()))
    .filter((font, index, arr) => arr.indexOf(font) === index)
    .map((font) => `${font.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800`);

  if (!families.length) {
    return '';
  }

  return `https://fonts.googleapis.com/css2?family=${families.join('&family=')}&display=swap`;
}

export function toFontSelectOptions() {
  return FONT_OPTIONS.map((font) => ({
    label: font,
    value: font,
  }));
}
