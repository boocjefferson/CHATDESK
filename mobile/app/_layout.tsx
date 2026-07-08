import { useFonts, RobotoSlab_700Bold } from "@expo-google-fonts/roboto-slab";
import { Montserrat_400Regular, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

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

  return <Stack screenOptions={{ headerShown: false }} />;
}
