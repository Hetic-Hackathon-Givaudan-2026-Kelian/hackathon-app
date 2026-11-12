import Conversation from "./screens/Conversation";
import { useChat } from "./useChat";

export default function App() {
  const chat = useChat();

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
