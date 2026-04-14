import { contrastRatio, wcagLevel } from '../utils/contrast';

export default function ColorPalette({ colors = [] }) {
  const background = colors.find((color) => color.role === 'background')?.hex || '#FFFFFF';
  const text = colors.find((color) => color.role === 'text')?.hex || '#111111';

  return (
    <section className="mzv-style-tile__section mzv-style-tile__palette" aria-label="Color palette">
      <h2 className="mzv-style-tile__section-title">Color Palette</h2>
      <div className="mzv-style-tile__swatches">
        {(colors || []).slice(0, 8).map((color, index) => {
          const ratio = contrastRatio(text, color.hex);
          const bgRatio = contrastRatio(color.hex, background);

          return (
            <article className="mzv-style-tile__swatch" key={`${color.name}-${index}`}>
              <div className="mzv-style-tile__swatch-chip" style={{ background: color.hex }} />
              <p className="mzv-style-tile__swatch-name">{color.name}</p>
              <p className="mzv-style-tile__swatch-meta">{color.hex}</p>
              <p className="mzv-style-tile__swatch-meta">role: {color.role}</p>
              <div className="mzv-style-tile__contrast-stack">
                <p className="mzv-style-tile__contrast-item">
                  Text on swatch: {ratio.toFixed(2)}:1 <strong>{wcagLevel(ratio)}</strong>
                </p>
                <p className="mzv-style-tile__contrast-item">
                  Swatch on bg: {bgRatio.toFixed(2)}:1 <strong>{wcagLevel(bgRatio, true)}</strong>
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
