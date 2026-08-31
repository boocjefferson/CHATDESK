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
import axiosClient from "../lib/axiosClient";
import { colors } from "../theme/colors";

// No mockup for this screen in ui-prototype/ - matches Login/Register's
// structure and USTP branding. Two steps: request a code by email, then
// enter that code with a new password.
export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestCode = async () => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const { data } = await axiosClient.post("/auth/password-reset/request/", { email });
      // dev_code only appears while the backend's Gmail App Password isn't
      // configured yet (see backend/.env) - it's the code shown directly
      // here instead of being emailed. Remove this once real email is on.
      if (data.dev_code) {
        setInfoMessage(`Dev mode: email isn't configured yet. Your code is ${data.dev_code}.`);
        setCode(data.dev_code);
      } else {
        setInfoMessage(data.message || "If that email is registered, a code has been sent.");
      }
      setStep("confirm");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Unable to send a reset code right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReset = async () => {
    setErrorMessage("");
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      await axiosClient.post("/auth/password-reset/confirm/", {
        email,
        code,
        new_password: newPassword,
      });
      router.replace("/login");
    } catch (error: any) {
      const details = error.response?.data?.details;
      const firstDetail = details ? (Object.values(details)[0] as string[])?.[0] : null;
      setErrorMessage(firstDetail || error.response?.data?.message || "Unable to reset password right now.");
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
        <Text style={styles.heading}>{step === "request" ? "Reset password" : "Enter code"}</Text>
        <Text style={styles.subheading}>
          {step === "request" ? "We'll send a code to your email" : "Enter the code we sent you"}
        </Text>

        {step === "request" ? (
          <>
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

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <Pressable style={styles.button} onPress={handleRequestCode} disabled={isSubmitting || !email}>
              {isSubmitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Send reset code</Text>
              )}
            </Pressable>
          </>
        ) : (
          <>
            {infoMessage ? <Text style={styles.infoText}>{infoMessage}</Text> : null}

            <Text style={styles.label}>6-digit code</Text>
            <TextInput
              style={styles.input}
              placeholder="123456"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
            />

            <Text style={styles.label}>New password</Text>
            <View style={styles.passwordField}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!isNewPasswordVisible}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <Pressable
                onPress={() => setIsNewPasswordVisible((prev) => !prev)}
                hitSlop={10}
                style={styles.eyeButton}
              >
                <MaterialIcons
                  name={isNewPasswordVisible ? "visibility-off" : "visibility"}
                  size={20}
                  color={colors.textMuted}
                />
              </Pressable>
            </View>

            <Text style={styles.label}>Confirm new password</Text>
            <View style={styles.passwordField}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!isConfirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <Pressable
                onPress={() => setIsConfirmPasswordVisible((prev) => !prev)}
                hitSlop={10}
                style={styles.eyeButton}
              >
                <MaterialIcons
                  name={isConfirmPasswordVisible ? "visibility-off" : "visibility"}
                  size={20}
                  color={colors.textMuted}
                />
              </Pressable>
            </View>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <Pressable
              style={styles.button}
              onPress={handleConfirmReset}
              disabled={isSubmitting || !code || !newPassword || !confirmPassword}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Reset password</Text>
              )}
            </Pressable>

            <Pressable onPress={() => setStep("request")}>
              <Text style={styles.signupText}>
                Didn&apos;t get a code? <Text style={styles.signupLink}>Try again</Text>
              </Text>
            </Pressable>
          </>
        )}

        <Pressable onPress={() => router.replace("/login")}>
          <Text style={styles.signupText}>
            Back to <Text style={styles.signupLink}>Log in</Text>
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
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    fontFamily: "Montserrat_400Regular",
    color: colors.textPrimary,
  },
  eyeButton: { paddingLeft: 8, paddingVertical: 8 },
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
    marginTop: 4,
  },
  signupLink: { fontFamily: "Montserrat_700Bold", color: colors.navy },
  errorText: {
    color: colors.errorRed,
    fontSize: 13,
    marginBottom: 12,
    textAlign: "center",
  },
  infoText: {
    color: colors.textPrimary,
    fontSize: 13,
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "Montserrat_400Regular",
  },
});
