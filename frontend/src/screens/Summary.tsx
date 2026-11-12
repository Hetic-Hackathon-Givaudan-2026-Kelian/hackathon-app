import { useState } from "react";

import type { AromaCardData } from "../aromas";
import AromaCard from "../components/AromaCard";
import Header from "../components/Header";

type Props = {
  answers: string[];
  aromas: AromaCardData[];
  sending: boolean;
  error: string | null;
  onBack: () => void;
  onSend: (message: string) => void;
};

/** Synthèse de la demande, en lecture seule, avant l'envoi aux experts. */
export default function Summary({
  answers,
  aromas,
  sending,
  error,
  onBack,
  onSend,
}: Props) {
  const [message, setMessage] = useState("");

  return (
    <div className="page summary-page">
      <Header trail={["Umi", "Synthèse"]}>
        <button className="btn btn-outline" onClick={onBack}>
          <span aria-hidden="true">←</span> Revenir à la conversation
        </button>
      </Header>

      <main className="summary">
        <div className="summary-head anim-up">
          <p className="eyebrow">Synthèse</p>
          <h1>Votre demande, avant envoi aux experts Givaudan</h1>
          <p className="summary-sub">
            Vérifiez que tout est juste. Pour préciser un point, revenez à la
            conversation avec Umi.
          </p>
        </div>

        <section
          className="summary-block anim-up"
          style={{ "--delay": "120ms" } as React.CSSProperties}
        >
          <h2>Votre projet</h2>
          {answers.length > 0 ? (
            <ul className="summary-list">
              {answers.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          ) : (
            <p className="summary-empty">
              Vous n'avez encore rien décrit à Umi.
            </p>
          )}
        </section>

        <section
          className="summary-block anim-up"
          style={{ "--delay": "220ms" } as React.CSSProperties}
        >
          <h2>Arômes joints à la demande</h2>
          {aromas.length > 0 ? (
            <div className="arome-grid is-compact">
              {aromas.map((aroma, i) => (
                <AromaCard key={aroma.id} aroma={aroma} index={i} compact />
              ))}
            </div>
          ) : (
            <p className="summary-empty">
              Aucun arôme sélectionné : les experts partiront de la description
              de votre projet.
            </p>
          )}
        </section>

        <section
          className="summary-block anim-up"
          style={{ "--delay": "320ms" } as React.CSSProperties}
        >
          <h2>
            Un mot pour les experts{" "}
            <span className="optional">(facultatif)</span>
          </h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Volumes envisagés, calendrier de lancement, contrainte particulière…"
          />
        </section>

        {error && <p className="error">{error}</p>}

        <div
          className="summary-actions anim-up"
          style={{ "--delay": "420ms" } as React.CSSProperties}
        >
          <button
            className="btn btn-outline"
            onClick={onBack}
            disabled={sending}
          >
            Revenir à la conversation
          </button>
          <button
            className="btn btn-plum btn-cta"
            onClick={() => onSend(message)}
            disabled={sending || answers.length === 0}
          >
            {sending ? "Envoi en cours…" : "Valider et envoyer ma demande"}
          </button>
        </div>
      </main>
    </div>
  );
}
