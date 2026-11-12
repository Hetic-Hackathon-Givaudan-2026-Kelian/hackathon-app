type Props = {
  trail?: string[];
  children?: React.ReactNode;
};

export default function Header({ trail = [], children }: Props) {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-name">Givaudan</span>
        <span className="brand-sep" />
        <span className="brand-division">Taste &amp; Wellbeing</span>
        {trail.map((step) => (
          <span key={step} className="trail">
            <span className="trail-arrow">›</span>
            {step}
          </span>
        ))}
      </div>
      <div className="header-actions">{children}</div>
    </header>
  );
}
