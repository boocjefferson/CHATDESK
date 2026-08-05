import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import axiosClient from "../lib/axiosClient";

export type ChatMessage = { role: "user" | "assistant"; text: string };

export type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
};

const TITLE_MAX_LENGTH = 40;

function makeTitle(messages: ChatMessage[]) {
  const firstUserMessage = messages.find((item) => item.role === "user")?.text ?? "New chat";
  return firstUserMessage.length > TITLE_MAX_LENGTH
    ? `${firstUserMessage.slice(0, TITLE_MAX_LENGTH)}...`
    : firstUserMessage;
}

type ChatContextValue = {
  messages: ChatMessage[];
  history: ChatSession[];
  isSending: boolean;
  sendMessage: (text: string) => Promise<void>;
  startNewChat: () => void;
  resumeSession: (sessionId: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Keyed per-user so one student's chat history never shows up for
  // another student logging into the same device.
  const storageKey = currentUser ? `chatdesk_chat_history_${currentUser.user_id}` : null;

  useEffect(() => {
    setMessages([]);
    setHistory([]);
    if (!storageKey) return;
    (async () => {
      const stored = await AsyncStorage.getItem(storageKey);
      if (!stored) return;
      try {
        setHistory(JSON.parse(stored));
      } catch {
        // Corrupted local cache - ignore and start fresh.
      }
    })();
  }, [storageKey]);

  const persistHistory = async (next: ChatSession[]) => {
    setHistory(next);
    if (storageKey) {
      await AsyncStorage.setItem(storageKey, JSON.stringify(next));
    }
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setIsSending(true);
    try {
      const { data } = await axiosClient.post("/chat/ask/", { message: trimmed });
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Chat isn't available yet - please check back soon." },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const startNewChat = () => {
    if (messages.length > 0) {
      const session: ChatSession = {
        id: Date.now().toString(),
        title: makeTitle(messages),
        messages,
        updatedAt: new Date().toISOString(),
      };
      persistHistory([session, ...history]);
    }
    setMessages([]);
  };

  const resumeSession = (sessionId: string) => {
    const session = history.find((item) => item.id === sessionId);
    if (!session) return;

    let nextHistory = history.filter((item) => item.id !== sessionId);
    if (messages.length > 0) {
      const currentSession: ChatSession = {
        id: Date.now().toString(),
        title: makeTitle(messages),
        messages,
        updatedAt: new Date().toISOString(),
      };
      nextHistory = [currentSession, ...nextHistory];
    }

    persistHistory(nextHistory);
    setMessages(session.messages);
  };

  return (
    <ChatContext.Provider
      value={{ messages, history, isSending, sendMessage, startNewChat, resumeSession }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
