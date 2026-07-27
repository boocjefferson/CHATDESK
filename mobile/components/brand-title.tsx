import { StyleSheet, Text, type TextStyle } from "react-native";
import { colors } from "../theme/colors";

type BrandTitleProps = {
  style?: TextStyle | TextStyle[];
};

// "Chat" white / "Desk" gold, Plus Jakarta Sans Bold - same split regardless
// of light/dark theme since both colors.white and colors.gold are theme-invariant.
export function BrandTitle({ style }: BrandTitleProps) {
  return (
    <Text style={style}>
      <Text style={styles.chat}>Chat</Text>
      <Text style={styles.desk}>Desk</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  chat: { fontFamily: "PlusJakartaSans_700Bold", color: colors.white },
  desk: { fontFamily: "PlusJakartaSans_700Bold", color: colors.gold },
});