export default function Typography({ headingFont, headingWeight, bodyFont, bodyWeight }) {
  return (
    <section className="mzv-style-tile__section mzv-style-tile__typography" aria-label="Typography specimens">
      <h2 className="mzv-style-tile__section-title">Typography</h2>
      <div className="mzv-style-tile__type-samples">
        <div className="mzv-style-tile__type-row">
          <p className="mzv-style-tile__type-meta">H1 · {headingFont} · {headingWeight}</p>
          <p className="mzv-style-tile__sample-h1">Design that feels inevitable.</p>
        </div>
        <div className="mzv-style-tile__type-row">
          <p className="mzv-style-tile__type-meta">H2 · {headingFont} · {headingWeight}</p>
          <p className="mzv-style-tile__sample-h2">Brand direction and visual language.</p>
        </div>
        <div className="mzv-style-tile__type-row">
          <p className="mzv-style-tile__type-meta">Body · {bodyFont} · {bodyWeight}</p>
          <p className="mzv-style-tile__sample-body">
            A style tile defines the visual tone of a brand without implying page layout.
          </p>
        </div>
        <div className="mzv-style-tile__type-row">
          <p className="mzv-style-tile__type-meta">Caption · {bodyFont} · {bodyWeight}</p>
          <p className="mzv-style-tile__sample-caption">Used for metadata, labels, and supporting details.</p>
        </div>
      </div>
    </section>
  );
}
