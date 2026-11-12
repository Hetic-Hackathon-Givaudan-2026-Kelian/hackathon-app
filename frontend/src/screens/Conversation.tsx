import { useState } from "react";

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
}: Props) {
  const [input, setInput] = useState("");

  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const question = lastAssistant?.content ?? OPENING;

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
          {lastUser && <p className="echo">« {lastUser.content} »</p>}

          {loading ? (
            <p className="thinking">
              Umi cherche dans le catalogue
              <span className="dots">
                <span />
                <span />
                <span />
              </span>
            </p>
          ) : (
            <>
              <h1 className="question">{question}</h1>
              <p className="hint">
                Vous pouvez répondre librement
                {suggestions.length > 0 && " ou vous aider de ces suggestions"}.
              </p>
              {suggestions.length > 0 && (
                <div className="chips">
                  {suggestions.map((s) => (
                    <button key={s} className="chip" onClick={() => submit(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </>
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
