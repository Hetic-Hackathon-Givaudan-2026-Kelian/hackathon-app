import Header from "../components/Header";
import Ribbon from "../components/Ribbon";
import type { User } from "../user";

type Props = {
  user: User | null;
  id: string;
  aromaCount: number;
  onNew: () => void;
  onHome: () => void;
};

export default function Confirmation({
  user,
  id,
  aromaCount,
  onNew,
  onHome,
}: Props) {
  return (
    <div className="page confirmation-page">
      <Header trail={["Umi", "Demande transmise"]} user={user}>
        <button className="btn btn-outline" onClick={onHome}>
          Retour à l'accueil
        </button>
      </Header>

      <main className="conversation">
        <Ribbon />
        <section className="confirmation anim-up">
          <span className="confirm-icon" aria-hidden="true">
            ✓
          </span>
          <h1>Votre demande a bien été transmise</h1>
          <p className="confirm-id">
            Numéro de demande <strong>{id}</strong>
          </p>
          <p className="confirm-text">
            Votre brief
            {aromaCount > 0 &&
              ` et ${aromaCount} arôme${aromaCount > 1 ? "s" : ""} du catalogue`}{" "}
            {aromaCount > 0 ? "ont été envoyés" : "a été envoyé"} aux experts
            Givaudan. Un expert va étudier votre demande et reviendra vers vous.
            Gardez ce numéro pour vos échanges avec nous.
          </p>
          <button className="btn btn-plum btn-cta" onClick={onNew}>
            Démarrer une nouvelle demande
          </button>
        </section>
      </main>
    </div>
  );
}
