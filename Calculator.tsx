// Calculator.tsx
import React, { useState } from "react";
import { StyleSheet, Text, View, StatusBar, useWindowDimensions, ScrollView } from "react-native";
import CalcButton from "./components/CalcButton";

export default function Calculator(): JSX.Element {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [display, setDisplay] = useState<string>("0");
  const [result, setResult] = useState<string>("");
  const [memory, setMemory] = useState<number>(0);

  const degToRad = (deg: number) => deg * (Math.PI / 180); // stopnie → radiany

  const press = (val: string) => {
    const operators = ["+", "-", "×", "÷"];

    if (val === "AC") {
      setDisplay("0");
      setResult("");
      return;
    }

    if (val === "mc") { setMemory(0); return; }
    if (val === "m+") { setMemory(memory + parseFloat(display.replace(",", "."))); return; }
    if (val === "m-") { setMemory(memory - parseFloat(display.replace(",", "."))); return; }
    if (val === "mr") { setDisplay(memory.toString().replace(".", ",")); setResult(""); return; }

    if (val === "π") { setDisplay(Math.PI.toString().replace(".", ",")); setResult(""); return; }
    if (val === "e") { setDisplay(Math.E.toString().replace(".", ",")); setResult(""); return; }
    if (val === "Rand") { setDisplay(Math.random().toString().replace(".", ",")); setResult(""); return; }

    const unaryOps: Record<string, (x: number) => number> = {
      "±": x => -x,
      "%": x => x / 100,
      "x²": x => x ** 2,
      "x³": x => x ** 3,
      "²√x": x => Math.sqrt(x),
      "³√x": x => Math.cbrt(x),
      "ʸ√x": x => Math.pow(x, 1 / 2),
      "1/x": x => 1 / x,
      "ln": x => Math.log(x),
      "log₁₀": x => Math.log10(x),
      "sin": x => Math.sin(degToRad(x)),  // stopnie → radiany
      "cos": x => Math.cos(degToRad(x)),
      "tan": x => Math.tan(degToRad(x)),
      "sinh": x => Math.sinh(x),          // hiperboliczne działają w JS
      "cosh": x => Math.cosh(x),
      "tanh": x => Math.tanh(x),
      "x!": x => { let n = Math.floor(x); let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; },
      "eˣ": x => Math.exp(x),
      "10ˣ": x => Math.pow(10, x),
    };

    if (unaryOps[val]) {
      try {
        const current = parseFloat(display.replace(",", "."));
        const res = unaryOps[val](current);
        setDisplay(res.toString().replace(".", ","));
        setResult("");
      } catch {
        setDisplay("Error");
        setResult("");
      }
      return;
    }

    if (val === ",") {
      if (!display.includes(",")) {
        setDisplay(display + ",");
        setResult("");
      }
      return;
    }

    if (operators.includes(val)) {
      const lastChar = display[display.length - 1];
      if (operators.includes(lastChar)) setDisplay(display.slice(0, -1) + val);
      else setDisplay(display + val);
      setResult("");
      return;
    }

    if (val === "=") {
      try {
        const formula = display.replace(/×/g, "*").replace(/÷/g, "/").replace(/,/g, ".");
        // eslint-disable-next-line no-eval
        const res = eval(formula);
        setResult(res.toString().replace(".", ","));
      } catch {
        setResult("Error");
      }
      return;
    }

    setDisplay(display === "0" ? val : display + val);
    setResult("");
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

  const getFlexValue = (label: string): number => isLandscape && label === "0" ? 2 : 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Ekran kalkulatora */}
      <View style={[styles.display, isLandscape && styles.displayLandscape]}>
        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}>
          <Text style={styles.displayExample}>{display}</Text>
        </ScrollView>
        <Text style={styles.displayResult}>{result}</Text>
      </View>

      {/* Klawiatura */}
      <View style={styles.keypadContainer}>
        {isLandscape ? (
          <View style={styles.landscapeKeypad}>
            {landscapeButtonsRows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.landscapeRow}>
                {row.map((label) => (
                  <CalcButton key={label} label={label} isZero={label === "0"} isLandscape={isLandscape} onPress={press} flex={getFlexValue(label)} />
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.keypad}>
            {standardButtonsPortrait.map((row, i) => (
              <View key={i} style={styles.row}>
                {row.map((label) => (
                  <CalcButton key={label} label={label} isZero={label === "0"} isLandscape={isLandscape} onPress={press} />
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
  container: { flex: 1, backgroundColor: "#000", justifyContent: "flex-end" },
  display: { minHeight: 120, backgroundColor: "#000", justifyContent: "flex-end", paddingHorizontal: 20, paddingVertical: 10 },
  displayLandscape: { minHeight: 60 },
  displayExample: { color: "#fff", fontSize: 28, textAlign: "right" },
  displayResult: { color: "#fff", fontSize: 40, fontWeight: "500", textAlign: "right" },
  keypadContainer: { flexDirection: "row", paddingBottom: 10 },
  landscapeKeypad: { flex: 1, paddingHorizontal: 1, marginTop: 10 },
  landscapeRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 0 },
  keypad: { flex: 1 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, paddingHorizontal: 5 },
});
