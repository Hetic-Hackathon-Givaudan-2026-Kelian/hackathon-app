/** Client de démonstration. Prototype : pas de vraie authentification,
 *  les identifiants sont vérifiés ici, dans le navigateur. En V1, la connexion
 *  passera par le SSO / l'annuaire clients de Givaudan. */
export type User = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
};

export const DEMO_USER: User = {
  firstName: "Léonie",
  lastName: "Durand",
  email: "leonie.durand@company.com",
  company: "Maison Durand",
};

export const DEMO_PASSWORD = "umi2026";

export function checkLogin(email: string, password: string): User | null {
  const sameEmail = email.trim().toLowerCase() === DEMO_USER.email;
  return sameEmail && password === DEMO_PASSWORD ? DEMO_USER : null;
}

export function initials(user: User): string {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
}
