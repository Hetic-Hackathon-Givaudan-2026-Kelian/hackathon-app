import { useState } from "react";

import Header from "../components/Header";
import Visual from "../components/Visual";
import { checkLogin, DEMO_PASSWORD, DEMO_USER, type User } from "../user";

type Props = {
  onLogin: (user: User) => void;
  onBack: () => void;
};

/** Connexion d'après la maquette « Authentification ».
 *  Prototype : un seul compte de démo, vérifié côté navigateur (voir user.ts). */
export default function Login({ onLogin, onBack }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const user = checkLogin(email, password);
    if (user) onLogin(user);
    else setError("Adresse mail ou mot de passe incorrect.");
  }

  return (
    <div className="page login-page">
      <Header>
        <button className="btn btn-outline btn-small" onClick={onBack}>
          <span aria-hidden="true">←</span> Retour à l'accueil
        </button>
      </Header>

      <main className="login">
        <Visual
          variant="berry"
          image="/images/login.png"
          className="login-visual"
        />

        <form
          className="login-form anim-up"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <h1>Accédez à votre espace client</h1>
          <p className="login-sub">
            Connectez-vous pour formuler et suivre vos commandes.
          </p>

          <label>
            Adresse mail
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="leonie.durand@company.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <div className="login-row">
            <label className="check">
              <input type="checkbox" /> Se souvenir de moi
            </label>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Mot de passe oublié ?
            </a>
          </div>

          <button className="btn btn-dark btn-block">Se connecter</button>

          <p className="login-demo">
            Compte de démonstration :{" "}
            <button
              type="button"
              className="link-button"
              onClick={() => {
                setEmail(DEMO_USER.email);
                setPassword(DEMO_PASSWORD);
                setError(null);
              }}
            >
              remplir automatiquement
            </button>
          </p>

          <p className="or">
            <span>ou</span>
          </p>
          <button
            type="button"
            className="btn btn-outline btn-block"
            onClick={() => onLogin(DEMO_USER)}
          >
            Créer un compte client
          </button>
        </form>
      </main>
    </div>
  );
}
