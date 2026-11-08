import { useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [input, setInput] = useState("");

  async function send() {
    const question = input;
    const history = messages;
    let answer = "";

    setInput("");
    setTools([]);
    setMessages([...history, { role: "user", content: question }]);

    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: question, history }),
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value);
      const lines = buffer.split("\n\n");
      buffer = lines.pop()!;

      for (const line of lines) {
        const event = JSON.parse(line.replace("data: ", ""));

        if (event.type === "tool_call") {
          setTools((t) => [
            ...t,
            `🔧 ${event.tool_name} ${JSON.stringify(event.arguments)}`,
          ]);
        }
        if (event.type === "text") {
          answer += event.content;
        }
        if (event.type === "error") {
          answer += `⚠️ ${event.message}`;
        }

        setMessages([
          ...history,
          { role: "user", content: question },
          { role: "assistant", content: answer },
        ]);
      }
    }
  }

  return (
    <div className="app">
      <h1>Givaudan · Assistant</h1>

      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.content}
          </div>
        ))}
        {tools.map((t, i) => (
          <div key={i} className="tool">
            {t}
          </div>
        ))}
      </div>

      <form
        className="input"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question…"
        />
        <button>Envoyer</button>
      </form>
    </div>
  );
}
