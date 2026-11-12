/** Petites icônes au trait, dessinées en SVG pour éviter une dépendance. */

const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ChatIcon() {
  return (
    <svg {...base}>
      <path d="M4 5h16v11H9l-5 4z" />
      <path d="M8 9h8M8 12h5" />
    </svg>
  );
}

export function ExploreIcon() {
  return (
    <svg {...base}>
      <path d="M4 15l9-6 2 3-9 6z" />
      <path d="M13 9l4-3 2 3-4 3" />
      <path d="M8 18l-2 3M10 17l2 4" />
    </svg>
  );
}

export function SendIcon() {
  return (
    <svg {...base}>
      <path d="M21 3L10 14" />
      <path d="M21 3l-7 18-4-7-7-4z" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg {...base} width={16} height={16}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
    </svg>
  );
}
