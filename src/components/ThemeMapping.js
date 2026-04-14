const mappings = [
  {
    key: 'core',
    title: 'WordPress Core',
    details: '--wp--preset--color--primary, --wp--preset--font-family--*',
  },
  {
    key: 'kadence',
    title: 'Kadence',
    details: 'Global Palette (palette1..palette9), Kadence typography presets',
  },
  {
    key: 'generatepress',
    title: 'GeneratePress',
    details: 'Global Colors + Typography module settings',
  },
];

export default function ThemeMapping({ detectedLabel = '__MZV_THEME_FRAMEWORK__' }) {
  return (
    <section className="mzv-style-tile__section mzv-style-tile__mapping" aria-label="Theme framework mapping">
      <h2 className="mzv-style-tile__section-title">Theme Framework Mapping</h2>
      <p className="mzv-style-tile__framework-detected">Detected framework: <strong>{detectedLabel}</strong></p>
      <ul className="mzv-style-tile__mapping-list">
        {mappings.map((mapping) => (
          <li key={mapping.key} className="mzv-style-tile__mapping-item">
            <span className="mzv-style-tile__mapping-title">{mapping.title}</span>
            <span className="mzv-style-tile__mapping-details">{mapping.details}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
