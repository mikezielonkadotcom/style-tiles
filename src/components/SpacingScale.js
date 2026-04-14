export default function SpacingScale({ spacingScale = [] }) {
  const max = Math.max(...spacingScale, 1);

  return (
    <section className="mzv-style-tile__section mzv-style-tile__spacing" aria-label="Spacing scale">
      <h2 className="mzv-style-tile__section-title">Spacing Scale</h2>
      <div className="mzv-style-tile__spacing-list">
        {(spacingScale || []).map((space, index) => (
          <div className="mzv-style-tile__spacing-row" key={`${space}-${index}`}>
            <span className="mzv-style-tile__spacing-label">{space}px</span>
            <div className="mzv-style-tile__spacing-track">
              <span
                className="mzv-style-tile__spacing-bar"
                style={{
                  width: `${Math.max((space / max) * 100, 4)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
