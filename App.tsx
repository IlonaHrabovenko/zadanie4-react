// App.tsx
import React, { useState } from "react";
import { View, StatusBar } from "react-native";
import SplashScreen from "./SplashScreen";
import Calculator from "./Calculator";

export default function App(): JSX.Element {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <Calculator />
      )}
    </View>
  );
}
