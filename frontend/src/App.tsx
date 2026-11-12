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
    return (
      <div key="landing" className="screen-fade">
        <Landing onStart={() => setScreen("login")} />
      </div>
    );
  }

  if (screen === "login") {
    return (
      <div key="login" className="screen-fade">
        <Login
          onLogin={() => setScreen("conversation")}
          onBack={() => setScreen("landing")}
        />
      </div>
    );
  }

  return (
    <div key="conversation" className="screen-fade">
      <Conversation
        messages={chat.messages}
        suggestions={chat.suggestions}
        loading={chat.loading}
        error={chat.error}
        onSend={chat.send}
        onCancel={chat.reset}
        onSummary={() => {}}
      />
    </div>
  );
}
