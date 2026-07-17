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
import { useTheme } from "../context/ThemeContext";
import axiosClient from "../lib/axiosClient";
import type { ThemePalette } from "../theme/colors";

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
  const { colors } = useTheme();
  const styles = createStyles(colors);
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
        colors={[colors.surface, colors.surface, colors.accent]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => setIsMenuOpen(true)}
            hitSlop={12}
            style={({ pressed }) => [pressed && styles.pressedIcon]}
          >
            <MaterialIcons name="menu" size={26} color={colors.accentText} />
          </Pressable>
          <Text style={styles.title}>ChatDesk</Text>
          <Pressable
            onPress={() => setIsMenuOpen(true)}
            hitSlop={12}
            style={({ pressed }) => [styles.avatar, pressed && styles.pressedIcon]}
          >
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
            <ScrollView
              style={styles.messageList}
              contentContainerStyle={styles.messageListContent}
              showsVerticalScrollIndicator={false}
            >
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
              {isSending ? (
                <View style={[styles.messageBubble, styles.messageBubbleAssistant, styles.typingBubble]}>
                  <ActivityIndicator size="small" color={colors.accentText} />
                </View>
              ) : null}
            </ScrollView>
          )}

          {messages.length === 0 ? (
            <View style={styles.suggestions}>
              {SUGGESTED_QUESTIONS.map((question) => (
                <Pressable
                  key={question}
                  style={({ pressed }) => [styles.suggestionRow, pressed && styles.suggestionRowPressed]}
                  onPress={() => setMessage(question)}
                >
                  <Text style={styles.suggestionText}>{question}</Text>
                  <MaterialIcons name="chevron-right" size={18} color={colors.white} style={styles.suggestionChevron} />
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
            <Pressable
              style={({ pressed }) => [
                styles.sendButton,
                !message.trim() && styles.sendButtonDisabled,
                pressed && styles.sendButtonPressed,
              ]}
              onPress={handleSend}
              disabled={isSending || !message.trim()}
            >
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

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    root: { flex: 1 },
    screen: { flex: 1 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    pressedIcon: { opacity: 0.5 },
    title: { fontSize: 20, fontFamily: "RobotoSlab_700Bold", color: colors.accentText },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: colors.accentText,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    avatarText: { fontFamily: "Montserrat_700Bold", color: colors.accentText, fontSize: 12 },
    body: { flex: 1, paddingHorizontal: 20 },
    welcomeBlock: { flex: 1, alignItems: "center", justifyContent: "center" },
    welcomeTitle: {
      fontSize: 28,
      lineHeight: 36,
      fontFamily: "RobotoSlab_700Bold",
      color: colors.textPrimary,
      textAlign: "center",
    },
    messageList: { flex: 1 },
    messageListContent: { paddingVertical: 12, gap: 10 },
    messageBubble: {
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 10,
      maxWidth: "85%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 1,
    },
    messageBubbleUser: { backgroundColor: colors.accent, alignSelf: "flex-end" },
    messageBubbleAssistant: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignSelf: "flex-start",
    },
    typingBubble: { paddingVertical: 12, paddingHorizontal: 16 },
    messageTextUser: { color: colors.white, fontFamily: "Montserrat_400Regular", fontSize: 15 },
    messageTextAssistant: {
      color: colors.textPrimary,
      fontFamily: "Montserrat_400Regular",
      fontSize: 15,
    },
    suggestions: { paddingBottom: 16, gap: 6 },
    suggestionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
    },
    suggestionRowPressed: { opacity: 0.55 },
    suggestionText: {
      flex: 1,
      fontFamily: "Montserrat_400Regular",
      fontSize: 15,
      color: colors.white,
    },
    suggestionChevron: { opacity: 0.7, marginLeft: 8 },
    inputBar: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 12,
      marginBottom: 8,
    },
    input: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 15,
      fontFamily: "Montserrat_400Regular",
      color: colors.textPrimary,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.gold,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    sendButtonDisabled: { opacity: 0.5 },
    sendButtonPressed: { opacity: 0.85 },
  });
