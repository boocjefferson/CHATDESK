import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import axiosClient from "../lib/axiosClient";
import type { ThemePalette } from "../theme/colors";

const COURSE_LABELS: Record<string, string> = {
  BSIT: "BS Information Technology",
  BSCS: "BS Computer Science",
  BSN: "BS Nursing",
  BSBA: "BS Business Administration",
  BSED: "BS Secondary Education",
  BSA: "BS Accountancy",
  BSCE: "BS Civil Engineering",
  BSEE: "BS Electrical Engineering",
};

export default function ProfileScreen() {
  const { currentUser, logout } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [nickname, setNickname] = useState(currentUser?.first_name ?? "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userInitial = currentUser?.first_name?.[0]?.toUpperCase() ?? "?";
  const fullName = `${currentUser?.first_name ?? ""} ${currentUser?.last_name ?? ""}`.trim();
  const courseLabel = currentUser?.course ? COURSE_LABELS[currentUser.course] ?? currentUser.course : "—";

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await axiosClient.patch("/auth/me/", { first_name: nickname });
    } catch {
      Alert.alert("Unavailable", "Profile updates aren't available yet - please check back soon.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={colors.accentText} />
        </Pressable>
        <Text style={styles.title}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.identityRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitial}</Text>
        </View>
        <View>
          <Text style={styles.name}>{fullName || "Student"}</Text>
          <Text style={styles.detail}>{courseLabel}</Text>
          <Text style={styles.detail}>School ID: {currentUser?.school_id ?? "—"}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>What should we call you?</Text>
      <TextInput
        style={styles.input}
        value={nickname}
        onChangeText={setNickname}
        placeholder="Nickname"
        placeholderTextColor={colors.textMuted}
      />
      <Pressable style={styles.button} onPress={handleUpdate} disabled={isUpdating}>
        <Text style={styles.buttonText}>{isUpdating ? "Updating..." : "Update"}</Text>
      </Pressable>

      <Text style={styles.sectionLabel}>Account Actions</Text>
      <Pressable style={styles.button} onPress={handleLogout} disabled={isLoggingOut}>
        <Text style={styles.buttonText}>{isLoggingOut ? "Logging out..." : "Log Out"}</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.surface, paddingTop: 48, paddingHorizontal: 20 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 24,
    },
    title: { fontSize: 22, fontFamily: "PlusJakartaSans_700Bold", color: colors.textPrimary },
    identityRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 32 },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.accentText,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: { fontFamily: "Montserrat_700Bold", color: colors.accentText, fontSize: 20 },
    name: { fontFamily: "Montserrat_700Bold", fontSize: 16, color: colors.textPrimary },
    detail: { fontFamily: "Montserrat_400Regular", fontSize: 13, color: colors.textSecondary },
    sectionLabel: {
      fontFamily: "Montserrat_400Regular",
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginBottom: 12,
      fontSize: 15,
      fontFamily: "Montserrat_400Regular",
      color: colors.textPrimary,
    },
    button: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
      marginBottom: 28,
    },
    buttonText: { fontFamily: "Montserrat_700Bold", fontSize: 15, color: colors.textPrimary },
  });
