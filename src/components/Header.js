import { Fragment } from '@wordpress/element';

export default function Header({ brandName, tagline, adjectives = [] }) {
  return (
    <header className="mzv-style-tile__header mzv-style-tile__section">
      <h1 className="mzv-style-tile__brand">{brandName || 'Brand Name'}</h1>
      {tagline ? <p className="mzv-style-tile__tagline">{tagline}</p> : null}
      <div className="mzv-style-tile__adjectives" aria-label="Brand adjectives">
        {(adjectives || []).filter(Boolean).map((adjective, index) => (
          <Fragment key={`${adjective}-${index}`}>
            <span className="mzv-style-tile__pill">{adjective}</span>
          </Fragment>
        ))}
      </div>
    </header>
  );
}
