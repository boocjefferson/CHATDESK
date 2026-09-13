import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import axiosClient from "../lib/axiosClient";
import type { ThemePalette } from "../theme/colors";

type Ticket = {
  ticket_id: number;
  subject_category: string;
  issue_description: string;
  status: string;
  resolution: string | null;
  created_at: string;
};

export default function TicketsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);

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
    setViewingTicket(ticket);
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
              const isResolved = ticket.status === "resolved";
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

      <Modal
        visible={viewingTicket !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setViewingTicket(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setViewingTicket(null)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            {viewingTicket ? (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderText}>
                    <Text style={styles.modalEyebrow}>Ticket {viewingTicket.ticket_id}</Text>
                    <Text style={styles.modalTitle}>{viewingTicket.subject_category}</Text>
                  </View>
                  <View style={styles.modalStatusBadge}>
                    <MaterialIcons name="check-circle" size={14} color={colors.accentText} />
                    <Text style={styles.modalStatusText}>Resolved</Text>
                  </View>
                </View>

                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalSectionLabel}>You asked</Text>
                  <Text style={styles.modalSectionText}>{viewingTicket.issue_description}</Text>

                  <Text style={[styles.modalSectionLabel, styles.modalSectionLabelSpaced]}>Answer</Text>
                  <Text style={styles.modalSectionText}>
                    {viewingTicket.resolution ?? "No response yet."}
                  </Text>
                </ScrollView>

                <Pressable style={styles.modalCloseButton} onPress={() => setViewingTicket(null)}>
                  <Text style={styles.modalCloseButtonText}>Close</Text>
                </Pressable>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
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
    columnHeader: {
      fontFamily: "Montserrat_700Bold",
      fontSize: 15,
      color: colors.textPrimary,
      textAlign: "center",
    },
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
    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    modalCard: {
      width: "100%",
      maxWidth: 420,
      maxHeight: "75%",
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 16,
    },
    modalHeaderText: { flex: 1 },
    modalEyebrow: {
      fontFamily: "Montserrat_400Regular",
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 2,
    },
    modalTitle: {
      fontFamily: "PlusJakartaSans_700Bold",
      fontSize: 19,
      color: colors.textPrimary,
    },
    modalStatusBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.accent + "1A",
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    modalStatusText: {
      fontFamily: "Montserrat_700Bold",
      fontSize: 12,
      color: colors.accentText,
    },
    modalBody: { marginBottom: 16 },
    modalSectionLabel: {
      fontFamily: "Montserrat_700Bold",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: 0.4,
      color: colors.textSecondary,
      marginBottom: 6,
    },
    modalSectionLabelSpaced: { marginTop: 16 },
    modalSectionText: {
      fontFamily: "Montserrat_400Regular",
      fontSize: 15,
      lineHeight: 21,
      color: colors.textPrimary,
    },
    modalCloseButton: {
      backgroundColor: colors.accent,
      borderRadius: 14,
      paddingVertical: 13,
      alignItems: "center",
    },
    modalCloseButtonText: {
      fontFamily: "Montserrat_700Bold",
      fontSize: 15,
      color: colors.white,
    },
  });
