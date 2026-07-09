import { useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.replace("/");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
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

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <Pressable style={styles.button} onPress={handleLogin} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Log in</Text>
          )}
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
  errorText: { color: colors.errorRed, fontSize: 13, marginBottom: 8, textAlign: "center" },
});
