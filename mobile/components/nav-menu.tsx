import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

// "Recent Chat N" rows are static placeholders matching the approved
// wireframe - there's no chat history endpoint yet to source real data
// from (backend only has auth + faqs so far).
const RECENT_CHATS = Array.from({ length: 11 }, (_, i) => `Recent Chat ${i + 1}`);

const MENU_ITEMS: { label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { label: "Start Chat", icon: "chat-bubble-outline" },
  { label: "Settings", icon: "settings" },
  { label: "View Tickets", icon: "confirmation-number" },
  { label: "More", icon: "more-horiz" },
];

const PANEL_WIDTH_RATIO = 0.62;
const ANIMATION_DURATION = 260;

type NavMenuProps = {
  visible: boolean;
  onClose: () => void;
  userInitial: string;
  onLogout: () => Promise<void>;
};

export function NavMenu({ visible, onClose, userInitial, onLogout }: NavMenuProps) {
  const { width } = useWindowDimensions();
  const panelWidth = width * PANEL_WIDTH_RATIO;
  const [isMounted, setIsMounted] = useState(visible);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const translateX = useSharedValue(-panelWidth);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      translateX.value = withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      translateX.value = withTiming(
        -panelWidth,
        { duration: ANIMATION_DURATION, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(setIsMounted)(false);
        }
      );
    }
  }, [visible, panelWidth, translateX]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleMenuItemPress = (label: string) => {
    if (label === "Start Chat") {
      onClose();
      return;
    }
    Alert.alert(label, "Coming soon.");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isMounted) return null;

  return (
    <Modal transparent visible={isMounted} animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose}>
        <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFillObject} />
      </Pressable>

      <Animated.View style={[styles.panel, { width: panelWidth }, panelStyle]}>
        <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
          <View style={styles.header}>
            <Pressable onPress={onClose} hitSlop={12}>
              <MaterialIcons name="close" size={24} color={colors.navy} />
            </Pressable>
            <Text style={styles.title}>ChatDesk</Text>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userInitial}</Text>
            </View>
          </View>

          <View style={styles.menuList}>
            {MENU_ITEMS.map((item) => (
              <Pressable
                key={item.label}
                style={styles.menuRow}
                onPress={() => handleMenuItemPress(item.label)}
              >
                <MaterialIcons name={item.icon} size={20} color={colors.navy} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.historyHeading}>History</Text>
          <ScrollView style={styles.historyList} contentContainerStyle={styles.historyListContent}>
            {RECENT_CHATS.map((label) => (
              <View key={label} style={styles.historyRow}>
                <Text style={styles.historyLabel}>{label}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.logoutButton} onPress={handleLogout} disabled={isLoggingOut}>
              <Text style={styles.logoutText}>{isLoggingOut ? "Logging out..." : "Log Out"}</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  screen: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  title: { fontSize: 17, fontFamily: "RobotoSlab_700Bold", color: colors.navy },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontFamily: "Montserrat_700Bold", color: colors.navy, fontSize: 11 },
  menuList: { marginTop: 4 },
  menuRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  menuLabel: { fontFamily: "Montserrat_400Regular", fontSize: 15, color: colors.textPrimary },
  historyHeading: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
    color: colors.navy,
    marginTop: 18,
    marginBottom: 6,
  },
  historyList: { flex: 1 },
  historyListContent: { paddingBottom: 12 },
  historyRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  historyLabel: { fontFamily: "Montserrat_400Regular", fontSize: 14, color: colors.textPrimary },
  footer: { alignItems: "flex-end", paddingVertical: 14 },
  logoutButton: {
    borderWidth: 1,
    borderColor: colors.navy,
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 18,
  },
  logoutText: { fontFamily: "Montserrat_700Bold", color: colors.navy, fontSize: 13 },
});
