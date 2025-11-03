// Calculator.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import CalcButton from "./components/CalcButton";

type BtnData = { label: string; color?: string; flex?: number; isZero?: boolean; type?: string };

export default function Calculator(): JSX.Element {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [display, setDisplay] = useState<string>("0");
  const [firstValue, setFirstValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondValue, setWaitingForSecondValue] = useState<boolean>(false);

  // ... (Funkcje calculate, formatResult i press pozostają bez zmian)

  const calculate = (op: string, val1: number, val2?: number): number => {
    switch (op) {
      case "+": return val1 + (val2 ?? 0);
      case "-": return val1 - (val2 ?? 0);
      case "×": return val1 * (val2 ?? 1);
      case "÷": return (val2 !== undefined && val2 !== 0) ? val1 / val2 : 0;
      case "±": return val1 * -1;
      case "%": return val1 / 100;
      case "x²": return val1 * val1;
      case "²√x": return Math.sqrt(val1);
      case "log₁₀": return Math.log10(val1);
      case "sin": return Math.sin(val1);
      case "cos": return Math.cos(val1);
      case "tan": return Math.tan(val1);
      default: return 0;
    }
  };

  const formatResult = (res: number): string => {
    const fixedRes = parseFloat(res.toFixed(9));
    let out = fixedRes.toString();

    if (Math.abs(fixedRes) > 9999999999999 || (Math.abs(fixedRes) < 0.000000001 && fixedRes !== 0)) {
      out = fixedRes.toExponential(6);
    } else {
      out = fixedRes.toString();
    }

    return out.replace(".", ",").replace(/,?0+$/, "");
  };

  const press = (val: string) => {
    if (val === "AC") {
      setDisplay("0");
      setOperator(null);
      setFirstValue(null);
      setWaitingForSecondValue(false);
      return;
    }

    if (["±", "%", "x²", "²√x", "log₁₀", "sin", "cos", "tan"].includes(val)) {
      const current = parseFloat(display.replace(",", "."));
      const res = calculate(val, current);
      setDisplay(formatResult(res));
      setFirstValue(null);
      setOperator(null);
      setWaitingForSecondValue(false);
      return;
    }

    if (val === "π") {
      setDisplay(formatResult(Math.PI));
      return;
    }

    if (val === "Rand") {
      setDisplay(formatResult(Math.random()));
      return;
    }

    if (val === ",") {
      if (waitingForSecondValue) {
        setDisplay("0,");
        setWaitingForSecondValue(false);
      } else if (!display.includes(",")) {
        setDisplay(display + ",");
      }
      return;
    }

    if (["+", "-", "×", "÷"].includes(val)) {
      if (firstValue !== null && operator && !waitingForSecondValue) {
        const second = parseFloat(display.replace(",", "."));
        const res = calculate(operator, firstValue, second);
        setFirstValue(res);
        setDisplay(formatResult(res));
      } else if (firstValue === null) {
        setFirstValue(parseFloat(display.replace(",", ".")));
      }

      setOperator(val);
      setWaitingForSecondValue(true);
      return;
    }

    if (val === "=") {
      if (operator && firstValue !== null) {
        const second = parseFloat(display.replace(",", "."));
        const res = calculate(operator, firstValue, second);
        setDisplay(formatResult(res));
        setOperator(null);
        setFirstValue(null);
        setWaitingForSecondValue(false);
      }
      return;
    }

    if (waitingForSecondValue) {
      setDisplay(val);
      setWaitingForSecondValue(false);
    } else {
      setDisplay(display === "0" ? val : display + val);
    }
  };

  const standardButtonsPortrait: string[][] = [
    ["AC", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ",", "="],
  ];

  const landscapeButtonsRows: string[][] = [
    ["(", ")", "mc", "m+", "m-", "mr", "AC", "±", "%", "÷"],
    ["2ⁿᵈ", "x²", "x³", "xʸ", "eˣ", "10ˣ", "7", "8", "9", "×"],
    ["1/x", "²√x", "³√x", "ʸ√x", "ln", "log₁₀", "4", "5", "6", "-"],
    ["x!", "sin", "cos", "tan", "e", "EE", "1", "2", "3", "+"],
    ["Rad", "sinh", "cosh", "tanh", "π", "Rand", "0", ",", "="],
  ];

  const getFlexValue = (label: string): number => {
      if (isLandscape && label === "0") {
          return 2;
      }
      return 1;
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[
        styles.display,
        isLandscape && styles.displayLandscape
      ]}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.displayText}>
          {display}
        </Text>
      </View>

      <View style={styles.keypadContainer}>
        {isLandscape ? (
          <View style={styles.landscapeKeypad}>
            {landscapeButtonsRows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.landscapeRow}>
                {row.map((label) => (
                  <CalcButton
                    key={label}
                    label={label}
                    isZero={label === "0"}
                    isLandscape={isLandscape}
                    onPress={press}
                    flex={getFlexValue(label)}
                  />
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.keypad}>
            {standardButtonsPortrait.map((row, i) => (
              <View key={i} style={styles.row}>
                {row.map((label) => (
                  <CalcButton
                    key={label}
                    label={label}
                    isZero={label === "0"}
                    isLandscape={isLandscape}
                    onPress={press}
                  />
                ))}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "flex-end"
  },
  display: {
    // ⭐️ ZMIANA: Zmieniono tło na czarne (#000)
    minHeight: 150,
    backgroundColor: "#000",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  displayLandscape: {
    minHeight: 80,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  displayText: { color: "#fff", fontSize: 70, fontWeight: "200" },
  keypadContainer: {
    flexDirection: "row",
    paddingBottom: 10
  },
  landscapeKeypad: {
    flex: 1,
    paddingHorizontal: 1,
    marginTop: 10,
  },
  landscapeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  keypad: { flex: 1 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, paddingHorizontal: 5 },
});