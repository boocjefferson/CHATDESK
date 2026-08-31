import { StyleSheet, Text, type TextStyle } from "react-native";
import { colors } from "../theme/colors";

type BrandTitleProps = {
  style?: TextStyle | TextStyle[];
  chatColor?: string;
};

// "Chat" white / "Desk" gold, Plus Jakarta Sans Bold. The auth screens (login,
// register, forgot-password) always sit on the same dark photo backdrop, so
// they omit chatColor and get the static white default. Screens that follow
// the user's light/dark preference (nav menu, chat interface) pass chatColor
// explicitly so "Chat" stays legible against either surface.
export function BrandTitle({ style, chatColor }: BrandTitleProps) {
  return (
    <Text style={style}>
      <Text style={[styles.chat, chatColor ? { color: chatColor } : null]}>Chat</Text>
      <Text style={styles.desk}>Desk</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  chat: { fontFamily: "PlusJakartaSans_700Bold", color: colors.white },
  desk: { fontFamily: "PlusJakartaSans_700Bold", color: colors.gold },
});