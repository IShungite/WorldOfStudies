import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function Page() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home page </Text>
      <StatusBar style="auto" />
    </View>
  );
}
