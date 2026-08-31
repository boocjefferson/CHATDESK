import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { AuthHeader } from "../components/auth-header";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AuthHeader />

      <ScrollView
        contentContainerStyle={styles.sheet}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Log in</Text>
        <Text style={styles.subheading}>Sign in to continue to ChatDesk</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@ustp.edu.ph"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordField}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            hitSlop={10}
            style={styles.eyeButton}
          >
            <MaterialIcons
              name={isPasswordVisible ? "visibility-off" : "visibility"}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <Pressable onPress={() => router.push("/forgot-password")} style={styles.forgotRow}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleLogin} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Log in</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.push("/register")}>
          <Text style={styles.signupText}>
            No account? <Text style={styles.signupLink}>Sign up here</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  sheet: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 24,
    fontFamily: "PlusJakartaSans_700Bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    color: colors.textSecondary,
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 16,
    fontSize: 15,
    fontFamily: "Montserrat_400Regular",
    color: colors.textPrimary,
  },
  passwordField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    fontFamily: "Montserrat_400Regular",
    color: colors.textPrimary,
  },
  eyeButton: { paddingLeft: 8, paddingVertical: 8 },
  forgotRow: { alignSelf: "flex-end", marginTop: 8, marginBottom: 20 },
  forgotPasswordText: {
    fontSize: 13,
    fontFamily: "Montserrat_700Bold",
    color: colors.gold,
  },
  button: {
    backgroundColor: colors.navy,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { fontSize: 16, fontFamily: "Montserrat_700Bold", color: colors.white },
  signupText: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: colors.textSecondary,
  },
  signupLink: { fontFamily: "Montserrat_700Bold", color: colors.navy },
  errorText: {
    color: colors.errorRed,
    fontSize: 13,
    marginBottom: 4,
    textAlign: "center",
  },
});
