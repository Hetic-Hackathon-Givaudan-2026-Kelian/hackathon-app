/** Visuel décoratif : un voile pêche et quelques bulles, en pur CSS. */
export default function Ribbon() {
  return (
    <div className="ribbon" aria-hidden="true">
      <div className="ribbon-wave" />
      <div className="ribbon-glow" />
      {[
        [18, 38, 14],
        [30, 22, 26],
        [44, 60, 10],
        [62, 30, 18],
        [74, 52, 12],
        [86, 34, 8],
      ].map(([left, top, size]) => (
        <span
          key={`${left}-${top}`}
          className="bubble"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: size,
            height: size,
          }}
        />
      ))}
    </div>
  );
}
