import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { BrandTitle } from "../components/brand-title";
import axiosClient from "../lib/axiosClient";
import { colors, darkTheme } from "../theme/colors";

// No mockup for this screen in ui-prototype/ - matches Login/Register's
// structure and USTP branding. Two steps: request a code by email, then
// enter that code with a new password.
export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    <ImageBackground
      source={require("../assets/login.jpg")}
      style={styles.screen}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <Image source={require("../assets/ustp-logo.png")} style={styles.logo} resizeMode="contain" />
      <BrandTitle style={styles.brandTitle} />
      <Text style={styles.subtitle}>
        {step === "request" ? "Reset your password" : "Enter the code we emailed you"}
      </Text>

      <View style={styles.card}>
        {step === "request" ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={darkTheme.textMuted}
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

            <TextInput
              style={styles.input}
              placeholder="6-digit code"
              placeholderTextColor={darkTheme.textMuted}
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
            />
            <TextInput
              style={styles.input}
              placeholder="New password"
              placeholderTextColor={darkTheme.textMuted}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor={darkTheme.textMuted}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

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
                Didn't get a code? <Text style={styles.signupLink}>Try again</Text>
              </Text>
            </Pressable>
          </>
        )}

        <Pressable onPress={() => router.replace("/login")}>
          <Text style={styles.signupText}>
            Back to <Text style={styles.signupLink}>Log in</Text>
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 16, 46, 0.45)",
  },
  logo: { width: 90, height: 90, marginBottom: 4 },
  brandTitle: {
    fontSize: 26,
    textShadowColor: "rgba(0, 0, 0, 0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontFamily: "Montserrat_400Regular",
    color: colors.white,
    marginBottom: 16,
    marginTop: 4,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: darkTheme.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  input: {
    backgroundColor: "#0E1224",
    borderWidth: 1,
    borderColor: darkTheme.textSecondary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    color: darkTheme.textPrimary,
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
    color: colors.white,
  },
  signupLink: { fontFamily: "Montserrat_700Bold", color: colors.white },
  errorText: { color: colors.errorRed, fontSize: 13, marginBottom: 8, textAlign: "center" },
  infoText: {
    color: darkTheme.textPrimary,
    fontSize: 13,
    marginBottom: 12,
    textAlign: "center",
    fontFamily: "Montserrat_400Regular",
  },
});
