import Header from "../components/Header";
import Visual from "../components/Visual";

type Props = {
  onLogin: () => void;
  onBack: () => void;
};

/** Connexion d'après la maquette « Authentification ».
 *  Statique pour le prototype : aucun identifiant n'est vérifié ni envoyé. */
export default function Login({ onLogin, onBack }: Props) {
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
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
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
              placeholder="leonie.durand@company.com"
              autoComplete="email"
            />
          </label>
          <label>
            Mot de passe
            <input
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          <div className="login-row">
            <label className="check">
              <input type="checkbox" /> Se souvenir de moi
            </label>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Mot de passe oublié ?
            </a>
          </div>

          <button className="btn btn-dark btn-block">Se connecter</button>
          <p className="or">
            <span>ou</span>
          </p>
          <button
            type="button"
            className="btn btn-outline btn-block"
            onClick={onLogin}
          >
            Créer un compte client
          </button>
        </form>
      </main>
    </div>
  );
}
