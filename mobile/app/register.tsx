import { useState } from "react";
import { ActivityIndicator, FlatList, Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
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
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCoursePickerOpen, setIsCoursePickerOpen] = useState(false);
  const { register } = useAuth();

  const selectedCourseLabel = COURSE_OPTIONS.find((option) => option.value === course)?.label;

  const handleRegister = async () => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await register({ first_name: firstName, last_name: lastName, email, password, course });
      router.replace("/");
    } catch (error: any) {
      const details = error.response?.data?.details;
      const firstDetail = details ? (Object.values(details)[0] as string[])?.[0] : null;
      setErrorMessage(firstDetail || error.response?.data?.message || "Unable to register right now.");
    } finally {
      setIsSubmitting(false);
    }
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

        <Pressable style={styles.pickerWrapper} onPress={() => setIsCoursePickerOpen(true)}>
          <Text style={styles.pickerValueText}>{selectedCourseLabel}</Text>
          <Text style={styles.pickerChevron}>▾</Text>
        </Pressable>

        <Modal visible={isCoursePickerOpen} transparent animationType="fade" onRequestClose={() => setIsCoursePickerOpen(false)}>
          <Pressable style={styles.modalBackdrop} onPress={() => setIsCoursePickerOpen(false)}>
            <View style={styles.modalSheet}>
              <FlatList
                data={COURSE_OPTIONS}
                keyExtractor={(option) => option.value}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.modalOption}
                    onPress={() => {
                      setCourse(item.value);
                      setIsCoursePickerOpen(false);
                    }}
                  >
                    <Text style={[styles.modalOptionText, item.value === course && styles.modalOptionTextSelected]}>
                      {item.label}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          </Pressable>
        </Modal>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <Pressable style={styles.button} onPress={handleRegister} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  pickerValueText: {
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    color: colors.textPrimary,
  },
  pickerChevron: { color: colors.textSecondary, fontSize: 16 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalSheet: {
    maxHeight: 360,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 8,
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    color: colors.textPrimary,
  },
  modalOptionTextSelected: {
    fontFamily: "Montserrat_700Bold",
    color: colors.navy,
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
