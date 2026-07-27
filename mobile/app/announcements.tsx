import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import axiosClient from "../lib/axiosClient";
import type { ThemePalette } from "../theme/colors";

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
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

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
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Announcements</Text>
        <View style={{ width: 24 }} />
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
    </View>
  );
}

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.surface, paddingTop: 48 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    title: { fontSize: 22, fontFamily: "PlusJakartaSans_700Bold", color: colors.textPrimary },
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