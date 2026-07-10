import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavMenu } from "../components/nav-menu";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../lib/axiosClient";
import { colors } from "../theme/colors";

// Matches the FAQ categories already modeled on the backend
// (Enrollment, Scholarship, Clearance, Discipline, General).
const SUGGESTED_QUESTIONS = [
  "How do I apply for a scholarship?",
  "What are the enrollment requirements?",
  "How do I get my clearance signed?",
];

type ChatMessage = { role: "user" | "assistant"; text: string };

export default function StudentChatScreen() {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const userInitial = currentUser?.first_name?.[0]?.toUpperCase() ?? "?";

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setMessage("");
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

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.white, colors.white, colors.navy]}
        locations={[0, 0.6, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Pressable onPress={() => setIsMenuOpen(true)} hitSlop={12}>
            <MaterialIcons name="menu" size={26} color={colors.navy} />
          </Pressable>
          <Text style={styles.title}>ChatDesk</Text>
          <Pressable onPress={() => setIsMenuOpen(true)} hitSlop={12} style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </Pressable>
        </View>

        <KeyboardAvoidingView
          style={styles.body}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {messages.length === 0 ? (
            <View style={styles.welcomeBlock}>
              <Text style={styles.welcomeTitle}>
                What can I help with, {currentUser?.first_name ?? "user"}?
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.messageList} contentContainerStyle={styles.messageListContent}>
              {messages.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageBubble,
                    item.role === "user" ? styles.messageBubbleUser : styles.messageBubbleAssistant,
                  ]}
                >
                  <Text
                    style={
                      item.role === "user" ? styles.messageTextUser : styles.messageTextAssistant
                    }
                  >
                    {item.text}
                  </Text>
                </View>
              ))}
              {isSending ? <ActivityIndicator color={colors.navy} style={{ marginTop: 8 }} /> : null}
            </ScrollView>
          )}

          {messages.length === 0 ? (
            <View style={styles.suggestions}>
              {SUGGESTED_QUESTIONS.map((question) => (
                <Pressable
                  key={question}
                  style={styles.suggestionRow}
                  onPress={() => setMessage(question)}
                >
                  <Text style={styles.suggestionText}>{question}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              placeholder="Ask ChatDesk"
              placeholderTextColor={colors.textMuted}
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <Pressable style={styles.sendButton} onPress={handleSend} disabled={isSending}>
              <MaterialIcons name="send" size={20} color={colors.white} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>

        <NavMenu
          visible={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          userInitial={userInitial}
          onLogout={logout}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 20, fontFamily: "RobotoSlab_700Bold", color: colors.navy },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontFamily: "Montserrat_700Bold", color: colors.navy, fontSize: 12 },
  body: { flex: 1, paddingHorizontal: 20 },
  welcomeBlock: { flex: 1, alignItems: "center", justifyContent: "center" },
  welcomeTitle: {
    fontSize: 28,
    fontFamily: "RobotoSlab_700Bold",
    color: colors.textPrimary,
    textAlign: "center",
  },
  messageList: { flex: 1 },
  messageListContent: { paddingVertical: 12, gap: 10 },
  messageBubble: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, maxWidth: "85%" },
  messageBubbleUser: { backgroundColor: colors.navy, alignSelf: "flex-end" },
  messageBubbleAssistant: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: "flex-start",
  },
  messageTextUser: { color: colors.white, fontFamily: "Montserrat_400Regular", fontSize: 15 },
  messageTextAssistant: {
    color: colors.textPrimary,
    fontFamily: "Montserrat_400Regular",
    fontSize: 15,
  },
  suggestions: { paddingBottom: 12, gap: 4 },
  suggestionRow: { paddingVertical: 10 },
  suggestionText: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 15,
    color: colors.white,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: "Montserrat_400Regular",
    color: colors.textPrimary,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
});
