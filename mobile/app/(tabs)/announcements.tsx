import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavMenu } from "../../components/nav-menu";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import axiosClient from "../../lib/axiosClient";
import type { ThemePalette } from "../../theme/colors";

type Announcement = {
  announcement_id: number;
  title: string;
  content: string;
  created_by: number;
  created_at: string;
  updated_at: string;
};

const formatDate = (isoString: string) =>
  new Date(isoString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function AnnouncementsScreen() {
  const { currentUser, logout } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userInitial = currentUser?.first_name?.[0]?.toUpperCase() ?? "?";

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosClient.get("/announcements/");
        setAnnouncements(data.results ?? data);
      } catch {
        setLoadFailed(true);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => setIsMenuOpen(true)}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <MaterialIcons name="menu" size={26} color={colors.accentText} />
        </Pressable>
        <Text style={styles.title}>Announcements</Text>
        <Pressable
          onPress={() => router.push("/profile")}
          hitSlop={12}
          style={styles.avatar}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
        >
          {currentUser?.profile_picture ? (
            <Image source={{ uri: currentUser.profile_picture }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{userInitial}</Text>
          )}
        </Pressable>
      </View>

      {loadFailed ? (
        <Text style={styles.centerState}>
          {"Announcements aren't available yet - please check back soon."}
        </Text>
      ) : announcements === null ? (
        <ActivityIndicator style={styles.centerState} color={colors.accentText} />
      ) : announcements.length === 0 ? (
        <Text style={styles.centerState}>No announcements yet.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {announcements.map((announcement) => (
            <View key={announcement.announcement_id} style={styles.card}>
              <Text style={styles.cardTitle}>{announcement.title}</Text>
              <Text style={styles.cardContent}>{announcement.content}</Text>
              <Text style={styles.cardDate}>{formatDate(announcement.created_at)}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <NavMenu
        visible={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        userInitial={userInitial}
        onLogout={logout}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.surface },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    title: { fontSize: 20, fontFamily: "PlusJakartaSans_700Bold", color: colors.textPrimary },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: colors.accentText,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    avatarImage: { width: 30, height: 30 },
    avatarText: { fontFamily: "Montserrat_700Bold", color: colors.accentText, fontSize: 12 },
    centerState: {
      marginTop: 40,
      textAlign: "center",
      color: colors.textSecondary,
      fontFamily: "Montserrat_400Regular",
      fontSize: 14,
      paddingHorizontal: 24,
    },
    listContent: { paddingHorizontal: 20, paddingBottom: 24, gap: 12 },
    card: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
    },
    cardTitle: {
      fontFamily: "Montserrat_700Bold",
      fontSize: 15,
      color: colors.textPrimary,
      marginBottom: 6,
    },
    cardContent: {
      fontFamily: "Montserrat_400Regular",
      fontSize: 14,
      color: colors.textPrimary,
      lineHeight: 20,
      marginBottom: 10,
    },
    cardDate: {
      fontFamily: "Montserrat_400Regular",
      fontSize: 12,
      color: colors.textMuted,
    },
  });
