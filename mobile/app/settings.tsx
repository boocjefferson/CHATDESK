import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

export default function SettingsScreen() {
  const { colors, isDark, toggleDarkMode } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={colors.accentText} />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>Dark Mode</Text>
          <Text style={styles.rowDescription}>Switch ChatDesk to a dark color scheme.</Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleDarkMode}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor={colors.white}
        />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.surface },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    title: { fontSize: 18, fontFamily: "PlusJakartaSans_700Bold", color: colors.accentText },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    rowText: { flex: 1, marginRight: 12 },
    rowLabel: {
      fontFamily: "Montserrat_700Bold",
      fontSize: 15,
      color: colors.textPrimary,
      marginBottom: 2,
    },
    rowDescription: {
      fontFamily: "Montserrat_400Regular",
      fontSize: 13,
      color: colors.textSecondary,
    },
  });
