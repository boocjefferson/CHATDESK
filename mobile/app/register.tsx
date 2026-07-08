import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { colors } from "../theme/colors";

// No Registration mockup existed in ui-prototype/ - matches Login's structure
// and the same USTP branding. Course list agreed with Jefferson.
const COURSE_OPTIONS = [
  { label: "BS Information Technology", value: "BSIT" },
  { label: "BS Computer Science", value: "BSCS" },
  { label: "BS Nursing", value: "BSN" },
  { label: "BS Business Administration", value: "BSBA" },
  { label: "BS Secondary Education", value: "BSED" },
  { label: "BS Accountancy", value: "BSA" },
  { label: "BS Civil Engineering", value: "BSCE" },
  { label: "BS Electrical Engineering", value: "BSEE" },
];

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState(COURSE_OPTIONS[0].value);

  const handleRegister = () => {
    // TODO(Keith): wire this up to the backend once feature/project-setup
    // and feature/jwt-authentication are merged. For now this is UI only.
  };

  return (
    <View style={styles.screen}>
      {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
      <Image source={require("../assets/ustp-logo.png")} style={styles.logo} resizeMode="contain" />
      <Text style={styles.brandTitle}>ChatDesk</Text>
      <Text style={styles.subtitle}>Create your student account</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="First name"
          placeholderTextColor={colors.textMuted}
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last name"
          placeholderTextColor={colors.textMuted}
          value={lastName}
          onChangeText={setLastName}
        />
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

        <View style={styles.pickerWrapper}>
          <Picker selectedValue={course} onValueChange={setCourse} style={{ color: colors.textPrimary }}>
            {COURSE_OPTIONS.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>

        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/login")}>
          <Text style={styles.signupText}>
            Already have an account? Log in <Text style={styles.signupLink}>here</Text>
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
  logo: { width: 90, height: 90, marginBottom: 4 },
  // Slab-serif to echo the "USTP" wordmark's blocky weight. Requires fonts
  // loaded via useFonts in _layout.tsx - see fonts.ts in this delivery.
  brandTitle: {
    fontSize: 26,
    fontFamily: "RobotoSlab_700Bold",
    color: colors.navy,
  },
  subtitle: {
    fontFamily: "Montserrat_400Regular",
    color: colors.textSecondary,
    marginBottom: 16,
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
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
