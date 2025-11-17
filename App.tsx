// App.tsx
import React, { useState } from "react";
import { View, StatusBar } from "react-native";
import SplashScreen from "./SplashScreen";
import Calculator from "./Calculator";
import { SafeAreaProvider } from "react-native-safe-area-context"; // 👈 DODAJ TEN IMPORT

export default function App(): JSX.Element {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  return (
    // CAŁA APLIKACJA MUSI BYĆ OPAKOWANA PRZEZ SafeAreaProvider
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : (
          <Calculator />
        )}
      </View>
    </SafeAreaProvider> // 👈 DODAJ TEN KOMPONENT
  );
}