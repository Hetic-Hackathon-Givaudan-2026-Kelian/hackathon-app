import type { AromaCardData } from "../aromas";

type Props = {
  aroma: AromaCardData;
  selected?: boolean;
  onToggle?: () => void;
  compact?: boolean;
  index?: number;
};

export default function AromaCard({
  aroma,
  selected,
  onToggle,
  compact,
  index = 0,
}: Props) {
  const details = [
    [
      "Sucrosité",
      aroma.sweetness && /^\d+([.,]\d+)?$/.test(aroma.sweetness)
        ? `${aroma.sweetness} / 5`
        : aroma.sweetness,
    ],
    ["Tenue à la chaleur", aroma.heat],
    ["Applications", aroma.applications],
  ].filter(([, v]) => v);

  const content = (
    <>
      <div className="arome-top">
        {aroma.family && <span className="arome-famille">{aroma.family}</span>}
        {onToggle && (
          <span
            className={`arome-check ${selected ? "is-on" : ""}`}
            aria-hidden="true"
          >
            {selected ? "✓" : "+"}
          </span>
        )}
      </div>
      <h3 className="arome-nom">{aroma.name}</h3>
      {aroma.notes && !compact && <p className="arome-notes">{aroma.notes}</p>}
      {!compact && details.length > 0 && (
        <dl className="arome-details">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {!compact && (aroma.price || aroma.leadTime) && (
        <p className="arome-conditions">
          {aroma.price && <>{aroma.price} €/kg indicatif</>}
          {aroma.price && aroma.leadTime && " · "}
          {aroma.leadTime && <>{aroma.leadTime} jours</>}
        </p>
      )}
      {aroma.demo && !compact && (
        <p className="arome-demo">Donnée de démonstration</p>
      )}
    </>
  );

  const style = { "--i": index } as React.CSSProperties;

  if (!onToggle) {
    return (
      <article
        className={`arome-card ${compact ? "is-compact" : ""}`}
        style={style}
      >
        {content}
      </article>
    );
  }

  return (
    <button
      type="button"
      className={`arome-card is-selectable ${selected ? "is-selected" : ""}`}
      style={style}
      aria-pressed={selected}
      onClick={onToggle}
    >
      {content}
    </button>
  );
}
