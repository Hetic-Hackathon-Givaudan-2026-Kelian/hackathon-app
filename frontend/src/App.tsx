import { useState } from "react";

import { toCardData } from "./aromas";
import Confirmation from "./screens/Confirmation";
import Conversation from "./screens/Conversation";
import Landing from "./screens/Landing";
import Login from "./screens/Login";
import Summary from "./screens/Summary";
import { useChat } from "./useChat";
import type { User } from "./user";

type Screen = "landing" | "login" | "conversation" | "summary" | "sent";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [selection, setSelection] = useState<string[] | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [briefId, setBriefId] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const chat = useChat();

  const aromas = chat.aromas.map(toCardData);
  const selected = selection ?? aromas.map((a) => a.id);
  const attached = aromas.filter((a) => selected.includes(a.id));
  const answers = chat.messages
    .filter((m) => m.role === "user")
    .map((m) => m.content);

  function toggle(id: string) {
    setSelection(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );
  }

  function newRequest() {
    chat.reset();
    setSelection(null);
    setBriefId("");
    setScreen("conversation");
  }

  async function sendBrief(message: string) {
    setSending(true);
    setSendError(null);
    try {
      const response = await fetch("/briefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          client: user
            ? {
                name: `${user.firstName} ${user.lastName}`,
                company: user.company,
                email: user.email,
              }
            : null,
          aromas: attached.map((a) => ({ source_id: a.id, name: a.name })),
          message: message.trim() || null,
        }),
      });
      if (!response.ok) throw new Error();
      const brief = (await response.json()) as { id: string };
      setBriefId(brief.id);
      setScreen("sent");
    } catch {
      setSendError(
        "L'envoi n'a pas abouti. Vérifiez votre connexion et réessayez.",
      );
    } finally {
      setSending(false);
    }
  }

  if (screen === "landing") {
    return (
      <div key="landing" className="screen-fade">
        <Landing onStart={() => setScreen(user ? "conversation" : "login")} />
      </div>
    );
  }

  if (screen === "login") {
    return (
      <div key="login" className="screen-fade">
        <Login
          onLogin={(u) => {
            setUser(u);
            setScreen("conversation");
          }}
          onBack={() => setScreen("landing")}
        />
      </div>
    );
  }

  if (screen === "summary") {
    return (
      <div key="summary" className="screen-fade">
        <Summary
          user={user}
          answers={answers}
          aromas={attached}
          sending={sending}
          error={sendError}
          onBack={() => setScreen("conversation")}
          onSend={sendBrief}
        />
      </div>
    );
  }

  if (screen === "sent") {
    return (
      <div key="sent" className="screen-fade">
        <Confirmation
          user={user}
          id={briefId}
          aromaCount={attached.length}
          onNew={newRequest}
          onHome={() => {
            newRequest();
            setScreen("landing");
          }}
        />
      </div>
    );
  }

  return (
    <div key="conversation" className="screen-fade">
      <Conversation
        user={user}
        messages={chat.messages}
        suggestions={chat.suggestions}
        loading={chat.loading}
        error={chat.error}
        onSend={chat.send}
        onCancel={() => {
          chat.reset();
          setSelection(null);
        }}
        onSummary={() => setScreen("summary")}
        aromas={aromas}
        selected={selected}
        onToggle={toggle}
      />
    </div>
  );
}
