import { useFonts, RobotoSlab_700Bold } from "@expo-google-fonts/roboto-slab";
import { Montserrat_400Regular, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { router, Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";

function RootNavigator() {
  const { currentUser, isLoading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isAuthScreen = pathname === "/login" || pathname === "/register";

    if (!currentUser && !isAuthScreen) {
      router.replace("/login");
    } else if (currentUser && isAuthScreen) {
      router.replace("/");
    }
  }, [currentUser, isLoading, pathname]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // All screens are always declared here - Stack requires every direct
  // child to be a Stack.Screen (wrapping some in a Fragment/conditional
  // silently breaks it, which was the actual bug). Redirecting happens
  // imperatively above via router.replace(), not by adding/removing
  // screens from this list.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    RobotoSlab_700Bold,
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
