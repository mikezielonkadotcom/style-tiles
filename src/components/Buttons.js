export default function Buttons({ primaryColor, secondaryColor, textColor, radius }) {
  return (
    <section className="mzv-style-tile__section mzv-style-tile__buttons" aria-label="Button styles">
      <h2 className="mzv-style-tile__section-title">Buttons</h2>
      <div className="mzv-style-tile__button-grid">
        <div className="mzv-style-tile__button-stack">
          <button
            type="button"
            className="mzv-style-tile__button mzv-style-tile__button--primary"
            style={{
              backgroundColor: primaryColor,
              borderColor: primaryColor,
              color: textColor,
              borderRadius: `${radius}px`,
            }}
          >
            Primary
          </button>
          <button
            type="button"
            className="mzv-style-tile__button mzv-style-tile__button--primary is-hover"
            style={{
              backgroundColor: primaryColor,
              borderColor: primaryColor,
              color: textColor,
              borderRadius: `${radius}px`,
            }}
          >
            Primary Hover
          </button>
          <button
            type="button"
            disabled
            className="mzv-style-tile__button mzv-style-tile__button--primary"
            style={{
              backgroundColor: primaryColor,
              borderColor: primaryColor,
              color: textColor,
              borderRadius: `${radius}px`,
            }}
          >
            Disabled
          </button>
        </div>

        <div className="mzv-style-tile__button-stack">
          <button
            type="button"
            className="mzv-style-tile__button mzv-style-tile__button--secondary"
            style={{
              borderColor: secondaryColor,
              color: secondaryColor,
              borderRadius: `${radius}px`,
            }}
          >
            Secondary
          </button>
          <button
            type="button"
            className="mzv-style-tile__button mzv-style-tile__button--secondary is-hover"
            style={{
              borderColor: secondaryColor,
              color: secondaryColor,
              borderRadius: `${radius}px`,
            }}
          >
            Secondary Hover
          </button>
          <button
            type="button"
            disabled
            className="mzv-style-tile__button mzv-style-tile__button--secondary"
            style={{
              borderColor: secondaryColor,
              color: secondaryColor,
              borderRadius: `${radius}px`,
            }}
          >
            Disabled
          </button>
        </div>
      </div>
    </section>
  );
}
