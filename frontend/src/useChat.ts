import { useState } from "react";

export type Message = { role: "user" | "assistant"; content: string };

export type Aroma = {
  source_type: string;
  source_id: string;
  is_synthetic: boolean;
  text: string;
  score: number;
  // champs séparés, si l'API data les envoie
  nom?: string;
  famille?: string;
  notes?: string;
  applications?: string[] | string;
  sucrosite?: number | string;
  tenue_chaleur?: string;
  prix?: number | string;
  delai?: number | string;
  prix_indicatif_eur_kg?: number | string;
  delai_jours?: number | string;
};

type AgentEvent =
  | { type: "text"; content: string }
  | { type: "tool_call"; tool_name: string; arguments: Record<string, unknown> }
  | { type: "tool_result"; tool_name: string; result: unknown }
  | { type: "error"; message: string }
  | { type: "done" };

/** Gère la conversation avec Umi : envoi du message et lecture du flux SSE de /chat. */
export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [aromas, setAromas] = useState<Aroma[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(question: string) {
    const text = question.trim();
    if (!text || loading) return;

    const history = messages;
    let answer = "";

    setError(null);
    setSuggestions([]);
    setLoading(true);
    setMessages([...history, { role: "user", content: text }]);

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      if (!response.ok || !response.body) throw new Error();

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() ?? "";

        for (const block of blocks) {
          if (!block.startsWith("data: ")) continue;
          const event = JSON.parse(block.slice(6)) as AgentEvent;

          if (event.type === "text") {
            answer += event.content;
            setMessages([
              ...history,
              { role: "user", content: text },
              { role: "assistant", content: answer },
            ]);
          }
          if (
            event.type === "tool_result" &&
            event.tool_name === "suggestions"
          ) {
            setSuggestions(event.result as string[]);
          }
          if (
            event.type === "tool_result" &&
            event.tool_name === "recommend_aromas"
          ) {
            setAromas(event.result as Aroma[]);
          }
          if (event.type === "error") {
            setError(event.message);
          }
        }
      }
    } catch {
      setError(
        "Umi est momentanément indisponible. Réessayez dans un instant.",
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessages([]);
    setSuggestions([]);
    setAromas([]);
    setError(null);
  }

  return { messages, suggestions, aromas, loading, error, send, reset };
}
