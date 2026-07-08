import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { colors } from "../theme/colors";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // TODO(Keith): wire this up to the backend once feature/project-setup
    // and feature/jwt-authentication are merged. For now this is UI only.
  };

  return (
    <View style={styles.screen}>
      {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
      <Image source={require("../assets/ustp-logo.png")} style={styles.logo} resizeMode="contain" />
      <Text style={styles.brandTitle}>ChatDesk</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log in</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/register")}>
          <Text style={styles.signupText}>
            No account? Sign up <Text style={styles.signupLink}>here</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: { width: 120, height: 120, marginBottom: 8 },
  // Slab-serif to echo the "USTP" wordmark's blocky weight. Requires fonts
  // loaded via useFonts in _layout.tsx - see fonts.ts in this delivery.
  brandTitle: {
    fontSize: 30,
    fontFamily: "RobotoSlab_700Bold",
    color: colors.navy,
    marginBottom: 20,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.gold,
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: { fontSize: 16, fontFamily: "Montserrat_700Bold", color: colors.white },
  signupText: {
    textAlign: "center",
    marginTop: 14,
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: colors.textSecondary,
  },
  signupLink: { fontFamily: "Montserrat_700Bold", color: colors.navy },
});
