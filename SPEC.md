# Style Tiles — WordPress Plugin Spec

## Overview
A WordPress Gutenberg block plugin that renders **style tiles** — the mid-fidelity design deliverable that communicates visual brand direction through colors, fonts, textures, and interface elements without implying layout.

Users drop a Style Tile block into any post or page, configure it with design tokens (manually or via JSON import), and get a beautiful, responsive style tile rendered on the frontend.

## What Is a Style Tile?
A style tile shows: color palette, typography specimens, button styles, texture/pattern swatches, brand adjectives, and imagery direction — all without any page layout. It's "paint chips for your website." Think of it as a visual language reference card.

Reference: Samantha Warren's framework from A List Apart (2012). See `references/` directory.

## Target Users
- Web designers presenting visual direction to clients
- Design agencies running brand exploration workshops
- WordPress theme developers documenting their design systems
- Content creators defining brand guidelines

## Core Features (MVP)

### 1. Style Tile Gutenberg Block
- Custom block: `mzv/style-tile`
- Block category: "design" (register custom category)
- Renders a complete style tile with these sections:
  - **Header**: Brand name, tagline, adjective pills
  - **Color Palette**: 4-8 color swatches with hex codes and role labels
  - **Typography**: H1, H2, Body, Caption specimens with font name/weight/size
  - **Buttons**: Primary (filled), Secondary (outline), with hover/disabled states
  - **Textures**: 2-4 texture/pattern swatches (solid colors, gradients, or CSS patterns)
  - **Spacing Scale**: Visual bar chart of spacing values (4px→64px)

### 2. Block Editor UI (Sidebar)
- **Token Import**: Upload a JSON file following the W3C Design Token Community Group format (DTCG)
- **Manual Entry**: Each section also editable via InspectorControls:
  - Colors: repeater field — name, hex value, role
  - Typography: font family (dropdown of Google Fonts + system fonts), weight, size
  - Buttons: primary color, secondary color, border radius, text color
  - Adjectives: comma-separated text field
  - Brand name + tagline text fields
- **Layout Toggle**: Horizontal (1440px, for wide content areas) or Vertical (800px, for standard posts)
- **Theme**: Light / Dark toggle (affects tile background and text colors)

### 3. Design Token JSON Import/Export
Support the W3C DTCG format:
```json
{
  "color": {
    "primary": { "$value": "#8B4A6B", "$type": "color", "$description": "Fig Purple" },
    "secondary": { "$value": "#6E3A55", "$type": "color", "$description": "Deep Fig" },
    "background": { "$value": "#FAF8F5", "$type": "color", "$description": "Cream" },
    "text": { "$value": "#1C1917", "$type": "color", "$description": "Ink" }
  },
  "typography": {
    "heading": {
      "fontFamily": { "$value": "Fraunces", "$type": "fontFamily" },
      "fontWeight": { "$value": 700, "$type": "fontWeight" }
    },
    "body": {
      "fontFamily": { "$value": "DM Sans", "$type": "fontFamily" },
      "fontWeight": { "$value": 400, "$type": "fontWeight" }
    }
  },
  "spacing": {
    "xs": { "$value": "4px", "$type": "dimension" },
    "sm": { "$value": "8px", "$type": "dimension" },
    "md": { "$value": "16px", "$type": "dimension" },
    "lg": { "$value": "32px", "$type": "dimension" },
    "xl": { "$value": "64px", "$type": "dimension" }
  },
  "borderRadius": {
    "default": { "$value": "8px", "$type": "dimension" }
  }
}
```

Also support Figma's "Variables REST API" JSON export format (the format you get from Figma → Plugins → Design Tokens).

Export: Button in block toolbar to export the current tile's tokens as DTCG JSON.

### 4. Frontend Rendering
- Pure CSS rendering (no JS on frontend)
- Google Fonts loaded dynamically based on selected fonts (via `wp_enqueue_style` with Google Fonts URL)
- Responsive: tile sections stack vertically on mobile
- Print-friendly: `@media print` styles for clean PDF export
- Accessible: proper color contrast ratios displayed, WCAG AA/AAA indicators next to text-on-color combos

### 5. Theme Framework Awareness
- Detect active theme and show how tokens map to it:
  - **WordPress Core**: Show CSS custom properties (`--wp--preset--color--primary`)
  - **Kadence**: Show Kadence global palette integration
  - **GeneratePress**: Show GP global colors/typography integration
- This is informational only (displayed below the tile) — not auto-applied

## Technical Architecture

### File Structure
```
style-tiles/
├── style-tiles.php              # Main plugin file
├── readme.txt                   # WP readme
├── LICENSE                      # MIT
├── .distignore                  # Release zip exclusions
├── package.json                 # Node deps (build only)
├── webpack.config.js            # Block build config
├── src/
│   ├── index.js                 # Block registration
│   ├── edit.js                  # Editor component
│   ├── save.js                  # Save component (static HTML)
│   ├── style.scss               # Frontend styles
│   ├── editor.scss              # Editor-only styles
│   ├── components/
│   │   ├── ColorPalette.js      # Color swatches section
│   │   ├── Typography.js        # Type specimens section
│   │   ├── Buttons.js           # Button states section
│   │   ├── Textures.js          # Texture swatches section
│   │   ├── SpacingScale.js      # Spacing bar chart
│   │   ├── Header.js            # Brand name + adjectives
│   │   ├── TokenImport.js       # JSON import modal
│   │   └── ThemeMapping.js      # Theme framework detection
│   └── utils/
│       ├── tokens.js            # DTCG parser + validator
│       ├── fonts.js             # Google Fonts URL builder
│       └── contrast.js          # WCAG contrast calculator
├── build/                       # Compiled output (git-ignored, included in release)
└── languages/                   # i18n
```

### WordPress Requirements
- WordPress 6.4+
- PHP 7.4+
- No external PHP dependencies (no Composer)
- Block built with `@wordpress/scripts` (standard WP block build toolchain)

### Block Attributes (block.json)
```json
{
  "name": "mzv/style-tile",
  "title": "Style Tile",
  "category": "design",
  "icon": "art",
  "description": "A visual direction tile showing colors, typography, buttons, and textures.",
  "attributes": {
    "brandName": { "type": "string", "default": "Brand Name" },
    "tagline": { "type": "string", "default": "" },
    "adjectives": { "type": "array", "default": ["Modern", "Clean", "Bold"] },
    "layout": { "type": "string", "default": "vertical", "enum": ["horizontal", "vertical"] },
    "theme": { "type": "string", "default": "light", "enum": ["light", "dark"] },
    "colors": {
      "type": "array",
      "default": [
        { "name": "Primary", "hex": "#2B4C7E", "role": "primary" },
        { "name": "Accent", "hex": "#FF6B35", "role": "accent" },
        { "name": "Background", "hex": "#F7F7F7", "role": "background" },
        { "name": "Text", "hex": "#1A1A2E", "role": "text" }
      ]
    },
    "headingFont": { "type": "string", "default": "Inter" },
    "headingWeight": { "type": "number", "default": 700 },
    "bodyFont": { "type": "string", "default": "Inter" },
    "bodyWeight": { "type": "number", "default": 400 },
    "buttonRadius": { "type": "number", "default": 8 },
    "primaryButtonColor": { "type": "string", "default": "#2B4C7E" },
    "secondaryButtonColor": { "type": "string", "default": "#666666" },
    "textures": {
      "type": "array",
      "default": [
        { "name": "Flat", "type": "solid", "value": "#F0F0F0" },
        { "name": "Gradient", "type": "gradient", "value": "linear-gradient(135deg, #2B4C7E, #FF6B35)" }
      ]
    },
    "spacingScale": {
      "type": "array",
      "default": [4, 8, 12, 16, 24, 32, 48, 64]
    },
    "tokensJson": { "type": "string", "default": "" }
  }
}
```

### Build & Release
- Build: `npm run build` (uses `@wordpress/scripts`)
- Dev: `npm run start` (watch mode)
- Release: Tag → GitHub Actions creates zip (respecting `.distignore`)
- `.distignore`: exclude `src/`, `node_modules/`, `package*.json`, `webpack.config.js`, `.github/`, `SPEC.md`

### Future (v2+)
- Figma REST API integration (pull tokens directly from a Figma file URL)
- Multiple tiles per page (comparison view)
- PDF export button
- Variation mode (toggle between 2-3 tiles on the same block)
- Update Machine integration for premium distribution

## Design Notes
- The block should render as beautifully as the Figma style tiles we've already built
- Dark theme should match the UM style tile aesthetic (#0a0a0a bg, amber accents)
- Light theme should match the Little Figgy aesthetic (#FAF8F5 bg, warm plum accents)
- Typography specimens should render ACTUAL TEXT in the chosen fonts, not just font names
- Color swatches should be large enough to evaluate the color (min 60x60px)
- Adjective pills should look like tags/badges
- The whole thing should feel premium — this is a design tool for designers

## References
- Samantha Warren's Style Tiles: https://alistapart.com/article/style-tiles-and-how-they-work/
- W3C DTCG format: https://tr.designtokens.org/format/
- Our Figma style tiles: UM (mYFgFSgZmjl4XNkVnVu2kZ), Little Figgy (N9SOzGFLnWQOhR6VJXHV87)
