import { initials, type User } from "../user";

type Props = {
  trail?: string[];
  user?: User | null;
  children?: React.ReactNode;
};

export default function Header({ trail = [], user, children }: Props) {
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
      <div className="header-actions">
        {children}
        {user && (
          <div
            className="user-chip"
            title={`${user.firstName} ${user.lastName} · ${user.email}`}
          >
            <span className="user-avatar" aria-hidden="true">
              {initials(user)}
            </span>
            <span className="user-text">
              <span className="user-name">
                {user.firstName} {user.lastName}
              </span>
              <span className="user-company">{user.company}</span>
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
