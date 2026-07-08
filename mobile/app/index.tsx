import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";

// Placeholder home route so "/" exists for router.replace("/") in
// login.tsx and register.tsx to resolve against. Chat/dashboard UI is
// separate Sprint work - this just confirms the auth flow completes.
export default function HomeScreen() {
  const { currentUser, logout } = useAuth();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Welcome, {currentUser?.first_name ?? "student"}!</Text>
      <Text style={styles.subtitle}>{currentUser?.email}</Text>

      <Pressable style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, backgroundColor: colors.background },
  title: { fontSize: 22, fontWeight: "800", color: colors.navy, marginBottom: 4 },
  subtitle: { color: colors.textSecondary, marginBottom: 24 },
  button: { borderWidth: 1, borderColor: colors.navy, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 24 },
  buttonText: { fontWeight: "700", color: colors.navy },
});
