import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from "react-native";

export default function App() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [display, setDisplay] = useState("0");
  const [firstValue, setFirstValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondValue, setWaitingForSecondValue] = useState(false);

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

      if (Math.abs(fixedRes) > 9999999999999 || Math.abs(fixedRes) < 0.000000001 && fixedRes !== 0) {
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

  const allButtonsData = [
    { label: "(", color: "#505050", flex: 1, type: "sci" },
    { label: ")", color: "#505050", flex: 1, type: "sci" },
    { label: "mc", color: "#505050", flex: 1, type: "sci" },
    { label: "m+", color: "#505050", flex: 1, type: "sci" },
    { label: "m-", color: "#505050", flex: 1, type: "sci" },
    { label: "mr", color: "#505050", flex: 1, type: "sci" },
    { label: "AC", color: "#A5A5A5", flex: 1, type: "std" },
    { label: "±", color: "#A5A5A5", flex: 1, type: "std" },
    { label: "%", color: "#A5A5A5", flex: 1, type: "std" },
    { label: "÷", color: "#FF9500", flex: 1, type: "std" },

    { label: "2ⁿᵈ", color: "#505050", flex: 1, type: "sci" },
    { label: "x²", color: "#505050", flex: 1, type: "sci" },
    { label: "x³", color: "#505050", flex: 1, type: "sci" },
    { label: "xʸ", color: "#505050", flex: 1, type: "sci" },
    { label: "eˣ", color: "#505050", flex: 1, type: "sci" },
    { label: "10ˣ", color: "#505050", flex: 1, type: "sci" },
    { label: "7", color: "#333333", flex: 1, type: "std" },
    { label: "8", color: "#333333", flex: 1, type: "std" },
    { label: "9", color: "#333333", flex: 1, type: "std" },
    { label: "×", color: "#FF9500", flex: 1, type: "std" },

    { label: "1/x", color: "#505050", flex: 1, type: "sci" },
    { label: "²√x", color: "#505050", flex: 1, type: "sci" },
    { label: "³√x", color: "#505050", flex: 1, type: "sci" },
    { label: "ʸ√x", color: "#505050", flex: 1, type: "sci" },
    { label: "ln", color: "#505050", flex: 1, type: "sci" },
    { label: "log₁₀", color: "#505050", flex: 1, type: "sci" },
    { label: "4", color: "#333333", flex: 1, type: "std" },
    { label: "5", color: "#333333", flex: 1, type: "std" },
    { label: "6", color: "#333333", flex: 1, type: "std" },
    { label: "-", color: "#FF9500", flex: 1, type: "std" },

    { label: "x!", color: "#505050", flex: 1, type: "sci" },
    { label: "sin", color: "#505050", flex: 1, type: "sci" },
    { label: "cos", color: "#505050", flex: 1, type: "sci" },
    { label: "tan", color: "#505050", flex: 1, type: "sci" },
    { label: "e", color: "#505050", flex: 1, type: "sci" },
    { label: "EE", color: "#505050", flex: 1, type: "sci" },
    { label: "1", color: "#333333", flex: 1, type: "std" },
    { label: "2", color: "#333333", flex: 1, type: "std" },
    { label: "3", color: "#333333", flex: 1, type: "std" },
    { label: "+", color: "#FF9500", flex: 1, type: "std" },

    { label: "Rad", color: "#505050", flex: 1, type: "sci" },
    { label: "sinh", color: "#505050", flex: 1, type: "sci" },
    { label: "cosh", color: "#505050", flex: 1, type: "sci" },
    { label: "tanh", color: "#505050", flex: 1, type: "sci" },
    { label: "π", color: "#505050", flex: 1, type: "sci" },
    { label: "Rand", color: "#505050", flex: 1, type: "sci" },
    { label: "0", color: "#333333", flex: 2, type: "std", isZero: true },
    { label: ",", color: "#333333", flex: 1, type: "std" },
    { label: "=", color: "#FF9500", flex: 1, type: "std" },
  ];

  const standardButtonsPortrait = [
    ["AC", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ",", "="],
  ];

  const Btn = ({ label, color, flex = 1, isZero = false }: { label: string; color?: string; flex?: number; isZero?: boolean }) => {
    const finalFlex = isLandscape ? flex : (isZero && label === "0" ? 2 : 1);

    return (
        <TouchableOpacity
            style={[styles.btn, {
                backgroundColor: color || "#333333",
                flex: finalFlex,
                marginHorizontal: 3,
                marginBottom: 10,
                borderRadius: isLandscape ? 35 : (isZero ? 50 : 35),
            }]}
            onPress={() => press(label)}
            activeOpacity={0.7}
        >
            <Text style={styles.btnText}>{label}</Text>
        </TouchableOpacity>
    );
  };

  const renderLandscapeGrid = () => {
    const columns = 10;
    const rows = [];

    for (let i = 0; i < 4; i++) {
        const startIndex = i * columns;
        const rowButtons = allButtonsData.slice(startIndex, startIndex + columns);
        rows.push(
            <View key={i} style={styles.rowLandscape}>
                {rowButtons.map((btn, index) => (
                    <Btn
                        key={index}
                        label={btn.label}
                        color={btn.color}
                        flex={btn.flex}
                    />
                ))}
            </View>
        );
    }

    const lastRowButtons = allButtonsData.slice(40);
    rows.push(
        <View key={4} style={styles.rowLandscape}>
            {lastRowButtons.map((btn, index) => (
                <Btn
                    key={index}
                    label={btn.label}
                    color={btn.color}
                    flex={btn.flex}
                    isZero={btn.label === "0"}
                />
            ))}
        </View>
    );

    return rows;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.display}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.displayText}>
          {display}
        </Text>
      </View>

      <View style={styles.keypadContainer}>
        {isLandscape ? (
          <View style={styles.landscapeKeypad}>
            {renderLandscapeGrid()}
          </View>
        ) : (
          <View style={styles.keypad}>
            {standardButtonsPortrait.map((row, i) => (
              <View key={i} style={styles.row}>
                {row.map((label, j) => (
                  <Btn
                    key={j}
                    label={label}
                    flex={label === "0" ? 2 : 1}
                    color={
                      label === "AC" || label === "±" || label === "%"
                        ? "#A5A5A5"
                        : ["÷", "×", "-", "+", "="].includes(label)
                        ? "#FF9500"
                        : "#333333"
                    }
                    isZero={label === "0"}
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
    justifyContent: "flex-end",
  },
  display: {
    flex: 1,
    backgroundColor: "#1C1C1C",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  displayText: {
    color: "#fff",
    fontSize: 70,
    fontWeight: "200",
  },
  keypadContainer: {
    flexDirection: "row",
    paddingBottom: 10,
  },

  landscapeKeypad: {
    flex: 1,
    paddingHorizontal: 5,
  },
  rowLandscape: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
  },

  keypad: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 5,
  },

  btn: {
    height: 50,
    marginHorizontal: 3,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 20,
  },
});