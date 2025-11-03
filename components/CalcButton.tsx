// components/CalcButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from "react-native";

type Props = {
  label: string;
  onPress: (label: string, e?: GestureResponderEvent) => void;
  flex?: number; // Ważne: ten flex będzie teraz 2 dla "0" w krajobrazie
  isZero?: boolean;
  isLandscape?: boolean;
};

export default function CalcButton({
  label,
  onPress,
  flex = 1,
  isZero = false,
  isLandscape = false,
}: Props): JSX.Element {

  // --- DEFINICJE KOLORÓW ---
  const ACCENT_ORANGE = "#FF9500";
  const LIGHT_GRAY = "#A6A6A6";
  const DARK_GRAY_SCI = "#505050";
  const DARK_GRAY_NUM = "#333333";
  const WHITE = "#fff";
  const BLACK = "#000";

  // --- LOGIKA USTALANIA KOLORU TŁA ---
  const getButtonBackgroundColor = (buttonLabel: string): string => {
    if (["/", "×", "-", "+", "="].includes(buttonLabel)) {
      return ACCENT_ORANGE;
    }
    if (["AC", "±", "%"].includes(buttonLabel)) {
      return LIGHT_GRAY;
    }
    if (isLandscape && !["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ",", "=", "÷", "×", "-", "+", "AC", "±", "%"].includes(buttonLabel)) {
      return DARK_GRAY_SCI;
    }
    return DARK_GRAY_NUM;
  };

  // --- LOGIKA USTALANIA KOLORU TEKSTU ---
  const getButtonTextColor = (buttonLabel: string): string => {
    if (getButtonBackgroundColor(buttonLabel) === LIGHT_GRAY) {
      return BLACK;
    }
    return WHITE;
  };

  const finalBackgroundColor = getButtonBackgroundColor(label);
  const finalTextColor = getButtonTextColor(label);

  // W trybie krajobrazowym używamy flex przekazanego przez props. W portretowym, jeśli isZero, to flex: 2.
  const finalFlex = isLandscape ? flex : (isZero && label === "0" ? 2 : 1);

  // --- MINIMALNE MARGINESY I OKRĄGŁE PRZYCISKI ---
  const finalMarginBottom = isLandscape ? 1 : 10;
  const finalMarginHorizontal = isLandscape ? 1 : 5;
  const finalBorderRadius = isLandscape ? 35 : (isZero && label === "0" ? 50 : 35); // Okrągłe w obu trybach

  let finalFontSize = 20;
  if (isLandscape) {
      finalFontSize = 16;
      if (label.length > 3) finalFontSize = 14;
  }


  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          backgroundColor: finalBackgroundColor,
          flex: finalFlex, // Tutaj flex jest 2 dla "0" w obu trybach, gdy jest to zdefiniowane
          marginHorizontal: finalMarginHorizontal,
          marginBottom: finalMarginBottom,
          borderRadius: finalBorderRadius,
        },
      ]}
      onPress={(e) => onPress(label, e)}
      activeOpacity={0.75}
    >
      <Text style={[styles.btnText, { color: finalTextColor, fontSize: finalFontSize }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontWeight: "500",
  },
});