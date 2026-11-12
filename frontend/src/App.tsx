import { useState } from "react";

import Conversation from "./screens/Conversation";
import Landing from "./screens/Landing";
import Login from "./screens/Login";
import { useChat } from "./useChat";

type Screen = "landing" | "login" | "conversation";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const chat = useChat();

  if (screen === "landing") {
    return <Landing onStart={() => setScreen("login")} />;
  }

  if (screen === "login") {
    return (
      <Login
        onLogin={() => setScreen("conversation")}
        onBack={() => setScreen("landing")}
      />
    );
  }

  return (
    <Conversation
      messages={chat.messages}
      suggestions={chat.suggestions}
      loading={chat.loading}
      error={chat.error}
      onSend={chat.send}
      onCancel={chat.reset}
      onSummary={() => {}}
    />
  );
}
