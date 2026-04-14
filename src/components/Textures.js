const textureStyle = (texture) => {
  if (!texture?.value) {
    return { background: '#e5e7eb' };
  }

  if (texture.type === 'pattern' && texture.value === 'dots') {
    return {
      backgroundColor: '#f5f5f5',
      backgroundImage: 'radial-gradient(#bbb 1.2px, transparent 1.2px)',
      backgroundSize: '12px 12px',
    };
  }

  if (texture.type === 'pattern' && texture.value === 'stripes') {
    return {
      backgroundImage: 'repeating-linear-gradient(45deg, #d4d4d8 0, #d4d4d8 8px, #f4f4f5 8px, #f4f4f5 16px)',
    };
  }

  if (texture.type === 'gradient') {
    return {
      backgroundImage: texture.value,
    };
  }

  return {
    background: texture.value,
  };
};

export default function Textures({ textures = [] }) {
  return (
    <section className="mzv-style-tile__section mzv-style-tile__textures" aria-label="Textures and patterns">
      <h2 className="mzv-style-tile__section-title">Textures</h2>
      <div className="mzv-style-tile__textures-grid">
        {(textures || []).slice(0, 4).map((texture, index) => (
          <article key={`${texture.name}-${index}`} className="mzv-style-tile__texture-item">
            <div className="mzv-style-tile__texture-swatch" style={textureStyle(texture)} />
            <p className="mzv-style-tile__texture-name">{texture.name}</p>
            <p className="mzv-style-tile__texture-type">{texture.type}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
