import { useEffect, useRef, useState } from "react";

import type { AromaCardData } from "../aromas";
import AromaCard from "../components/AromaCard";
import Header from "../components/Header";
import Ribbon from "../components/Ribbon";
import type { Message } from "../useChat";

type Props = {
  messages: Message[];
  suggestions: string[];
  loading: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onCancel: () => void;
  onSummary: () => void;
  aromas: AromaCardData[];
  selected: string[];
  onToggle: (id: string) => void;
};

const OPENING =
  "Parlez-moi de votre projet : quel produit préparez-vous, et quel goût imaginez-vous ?";

/** Écran « Nouvelle demande » : une seule question à la fois, au centre. */
export default function Conversation({
  messages,
  suggestions,
  loading,
  error,
  onSend,
  onCancel,
  onSummary,
  aromas,
  selected,
  onToggle,
}: Props) {
  const [input, setInput] = useState("");

  const answersRef = useRef<HTMLOListElement>(null);

  // La dernière question d'Umi s'affiche en grand. Au-dessus, les réponses
  // déjà données par le client, en pastilles, pour qu'il garde le fil.
  const last = messages.at(-1);
  const question = last?.role === "assistant" ? last.content : OPENING;
  const isQuestion = question.trim().endsWith("?");
  const answers = messages
    .map((m, i) => ({ ...m, index: i }))
    .filter((m) => m.role === "user")
    .map((m) => ({
      text: m.content,
      // la question à laquelle le client répondait, affichée au survol
      askedBefore:
        messages
          .slice(0, m.index)
          .reverse()
          .find((x) => x.role === "assistant")?.content ?? OPENING,
    }));

  // Sur petit écran, les pastilles défilent jusqu'à la dernière.
  useEffect(() => {
    const list = answersRef.current;
    if (list) list.scrollLeft = list.scrollWidth;
  }, [answers.length]);

  function submit(text: string) {
    if (!text.trim() || loading) return;
    onSend(text);
    setInput("");
  }

  return (
    <div className="page page-conversation">
      <Header trail={["Umi", "Nouvelle demande"]}>
        <button className="btn btn-outline" onClick={onCancel}>
          Annuler la demande
        </button>
        <button
          className="btn btn-plum"
          onClick={onSummary}
          disabled={messages.length === 0}
        >
          Voir la synthèse
        </button>
      </Header>

      <main className="conversation">
        <Ribbon />

        <section className="question-zone" aria-live="polite">
          {answers.length > 0 && (
            <div className="answers-wrap">
              <p className="answers-label">Votre projet</p>
              <ol
                ref={answersRef}
                className="answers"
                aria-label="Ce que vous avez déjà indiqué à Umi"
              >
                {answers.map((a, i) => (
                  <li key={i} className="answer-pill" title={a.askedBefore}>
                    <span className="answer-text">{a.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {loading ? (
            <p className="thinking anim-up">
              Umi cherche dans le catalogue
              <span className="dots">
                <span />
                <span />
                <span />
              </span>
            </p>
          ) : aromas.length > 0 ? (
            <div key="resultats" className="anim-up results">
              <h1 className="question">
                Voici les arômes du catalogue qui correspondent à votre projet
              </h1>
              <p className="hint">
                Sélectionnez ceux que vous souhaitez joindre à votre demande.
              </p>
              <div className="arome-grid">
                {aromas.map((aroma, i) => (
                  <AromaCard
                    key={aroma.id}
                    aroma={aroma}
                    index={i}
                    selected={selected.includes(aroma.id)}
                    onToggle={() => onToggle(aroma.id)}
                  />
                ))}
              </div>
              <button className="btn btn-plum btn-cta" onClick={onSummary}>
                Voir la synthèse de ma demande
                <span aria-hidden="true"> →</span>
              </button>
              <p className="results-note">
                Un détail à préciser ? Répondez simplement à Umi ci-dessous.
              </p>
            </div>
          ) : (
            <div key={question} className="anim-up">
              <h1 className="question">{question}</h1>
              {isQuestion && (
                <p className="hint">
                  Vous pouvez répondre librement
                  {suggestions.length > 0 &&
                    " ou vous aider de ces suggestions"}
                  .
                </p>
              )}
              {suggestions.length > 0 && (
                <div className="chips">
                  {suggestions.map((s, i) => (
                    <button
                      key={s}
                      className="chip"
                      style={{ "--i": i } as React.CSSProperties}
                      onClick={() => submit(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && <p className="error">{error}</p>}
        </section>

        <form
          className="composer"
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Décrivez votre idée, vos envies, vos contraintes…"
            disabled={loading}
            aria-label="Votre réponse"
          />
          <button
            className="send"
            aria-label="Envoyer"
            disabled={loading || !input.trim()}
          >
            ↑
          </button>
        </form>
      </main>
    </div>
  );
}
