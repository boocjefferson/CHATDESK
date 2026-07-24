import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import axiosClient from "../lib/axiosClient";
import type { ThemePalette } from "../theme/colors";

type Ticket = {
  ticket_id: number;
  subject_category: string;
  issue_description: string;
  status: string;
  created_at: string;
};

export default function TicketsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosClient.get("/tickets/", { params: { creator: "me" } });
        setTickets(data.results ?? data);
      } catch {
        setLoadFailed(true);
      }
    })();
  }, []);

  const handleView = (ticket: Ticket) => {
    Alert.alert(ticket.subject_category, ticket.issue_description);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Ticket</Text>
        <View style={{ width: 24 }} />
      </View>

      {loadFailed ? (
        <Text style={styles.centerState}>
          {"Tickets aren't available yet - please check back soon."}
        </Text>
      ) : tickets === null ? (
        <ActivityIndicator style={styles.centerState} color={colors.accentText} />
      ) : tickets.length === 0 ? (
        <Text style={styles.centerState}>No tickets yet.</Text>
      ) : (
        <>
          <View style={styles.columnHeaderRow}>
            <Text style={[styles.columnHeader, styles.labelColumn]} />
            <Text style={[styles.columnHeader, styles.statusColumn]}>Status</Text>
            <Text style={[styles.columnHeader, styles.actionColumn]}>Action</Text>
          </View>
          <ScrollView>
            {tickets.map((ticket) => {
              const isResolved = ticket.status !== "pending";
              return (
                <View key={ticket.ticket_id} style={styles.row}>
                  <Text style={[styles.rowLabel, styles.labelColumn]}>Ticket {ticket.ticket_id}</Text>
                  <View style={styles.statusColumn}>
                    {isResolved ? (
                      <MaterialIcons name="check" size={20} color={colors.textPrimary} />
                    ) : (
                      <Text style={styles.pendingText}>Pending</Text>
                    )}
                  </View>
                  <View style={styles.actionColumn}>
                    <Pressable
                      style={[styles.viewButton, !isResolved && styles.viewButtonDisabled]}
                      onPress={() => handleView(ticket)}
                      disabled={!isResolved}
                    >
                      <Text style={[styles.viewButtonText, !isResolved && styles.viewButtonTextDisabled]}>
                        View
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </>
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
    columnHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 12,
    },
    columnHeader: { fontFamily: "Montserrat_700Bold", fontSize: 15, color: colors.textPrimary },
    labelColumn: { flex: 1.1 },
    statusColumn: { flex: 1, alignItems: "center" },
    actionColumn: { flex: 1, alignItems: "center" },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    rowLabel: { fontFamily: "Montserrat_400Regular", fontSize: 15, color: colors.textPrimary },
    pendingText: { fontFamily: "Montserrat_400Regular", fontSize: 14, color: colors.textSecondary },
    viewButton: {
      borderWidth: 1,
      borderColor: colors.textPrimary,
      borderRadius: 16,
      paddingVertical: 6,
      paddingHorizontal: 16,
    },
    viewButtonDisabled: { borderColor: colors.border },
    viewButtonText: { fontFamily: "Montserrat_700Bold", fontSize: 13, color: colors.textPrimary },
    viewButtonTextDisabled: { color: colors.textMuted },
  });
