// SplashScreen.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, GestureResponderEvent } from "react-native";

type Props = {
  onFinish: (e?: GestureResponderEvent) => void;
};

export default function SplashScreen({ onFinish }: Props): JSX.Element {

  // Użyjemy useEffect do ustawienia timera
  useEffect(() => {
    const timer = setTimeout(() => {
        // Wywołaj onFinish po 3 sekundach
        onFinish();
    }, 3000); // 3000 milisekund = 3 sekundy

    // Funkcja czyszcząca, która uruchamia się przy odmontowaniu komponentu,
    // zapobiegając wywołaniu onFinish, jeśli komponent zostanie usunięty wcześniej.
    return () => clearTimeout(timer);
  }, [onFinish]); // onFinish jest zależnością, ale jest stałe, więc wykona się raz

  return (
    <View style={styles.container}>

      <Text style={styles.title}>KALKULATOR</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  logo: { width: 120, height: 120, marginBottom: 24 },
  title: { color: "#FF9500", fontSize: 44, fontWeight: "700", letterSpacing: 2 },
  subtitle: { color: "#A5A5A5", fontSize: 16, marginTop: 8, marginBottom: 36 },

});