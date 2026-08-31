import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
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

// No Registration mockup existed in ui-prototype/ - matches Login's structure
// and the same USTP branding. Course list confirmed by Jefferson against the
// official USTP CDO program list - must stay in sync with the Course
// TextChoices in backend/users/models.py, or registration will 400 on any
// value the backend doesn't recognize.
const COURSE_OPTIONS = [
  // Information Technology / Computer Science
  { label: "BS Information Technology", value: "BSIT" },
  { label: "BS Computer Science", value: "BSCS" },
  { label: "BS Data Science", value: "BSDS" },
  { label: "Bachelor in Technology Communication Management", value: "BTCM" },
  // Engineering
  { label: "BS Architecture", value: "BSARCH" },
  { label: "BS Civil Engineering", value: "BSCE" },
  { label: "BS Computer Engineering", value: "BSCPE" },
  { label: "BS Electrical Engineering", value: "BSEE" },
  { label: "BS Electronics Engineering", value: "BSECE" },
  { label: "BS Geodetic Engineering", value: "BSGE" },
  { label: "BS Mechanical Engineering", value: "BSME" },
  // Technology
  { label: "BS Autotronics", value: "BSAUTO" },
  { label: "BS Electro-Mechanical Technology", value: "BSEMT" },
  { label: "BS Electronics Technology", value: "BSELT" },
  { label: "BS Energy Systems and Management", value: "BSESM" },
  { label: "BS Manufacturing Engineering Technology", value: "BSMFG" },
  { label: "Bachelor of Technology, Operations, and Management", value: "BTOM" },
  // Education
  { label: "Bachelor in Technology and Livelihood Education", value: "BTLED" },
  { label: "Bachelor in Technical-Vocational Teacher Education", value: "BTVTED" },
  { label: "BS Secondary Education", value: "BSED" },
  { label: "BS Elementary Education", value: "BEED" },
  // Not yet confirmed on the official list
  { label: "BS Nursing", value: "BSN" },
];

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
      await register({
        first_name: firstName,
        last_name: lastName,
        school_id: schoolId,
        email,
        password,
        course,
      });
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
        <Text style={styles.heading}>Sign up</Text>
        <Text style={styles.subheading}>Create your student account</Text>

        <Text style={styles.label}>First name</Text>
        <TextInput
          style={styles.input}
          placeholder="Juan"
          placeholderTextColor={colors.textMuted}
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last name</Text>
        <TextInput
          style={styles.input}
          placeholder="Dela Cruz"
          placeholderTextColor={colors.textMuted}
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>School ID</Text>
        <TextInput
          style={styles.input}
          placeholder="2026-00001"
          placeholderTextColor={colors.textMuted}
          value={schoolId}
          onChangeText={setSchoolId}
        />

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

        <Text style={styles.label}>Course</Text>
        <Pressable style={styles.pickerWrapper} onPress={() => setIsCoursePickerOpen(true)}>
          <Text style={styles.pickerValueText}>{selectedCourseLabel}</Text>
          <MaterialIcons name="expand-more" size={20} color={colors.textMuted} />
        </Pressable>

        <Modal
          visible={isCoursePickerOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsCoursePickerOpen(false)}
        >
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
                    <Text
                      style={[
                        styles.modalOptionText,
                        item.value === course && styles.modalOptionTextSelected,
                      ]}
                    >
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
            Already have an account? <Text style={styles.signupLink}>Log in here</Text>
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
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 20,
  },
  pickerValueText: {
    fontSize: 15,
    fontFamily: "Montserrat_400Regular",
    color: colors.textPrimary,
  },
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
    marginBottom: 12,
    textAlign: "center",
  },
});
