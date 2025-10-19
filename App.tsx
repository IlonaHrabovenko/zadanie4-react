import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from "react-native";

export default function App() {
  const [display, setDisplay] = useState("0");
  const [firstValue, setFirstValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondValue, setWaitingForSecondValue] = useState(false);

  const press = (val: string) => {
    if (["+", "-", "×", "÷"].includes(val)) {
      setOperator(val);
      setFirstValue(parseFloat(display.replace(",", ".")));
      setWaitingForSecondValue(true);
      return;
    }

    if (val === "=") {
      if (operator && firstValue !== null) {
        const second = parseFloat(display.replace(",", "."));
        let res = 0;
        switch (operator) {
          case "+": res = firstValue + second; break;
          case "-": res = firstValue - second; break;
          case "×": res = firstValue * second; break;
          case "÷": res = second !== 0 ? firstValue / second : 0; break;
        }
        const out = Number.isInteger(res)
          ? res.toString()
          : res.toFixed(6).replace(".", ",").replace(/,?0+$/, "");
        setDisplay(out);
        setOperator(null);
        setFirstValue(null);
        setWaitingForSecondValue(false);
      }
      return;
    }

    if (val === "AC") {
      setDisplay("0");
      setOperator(null);
      setFirstValue(null);
      setWaitingForSecondValue(false);
      return;
    }

    if (val === ",") {
      if (!display.includes(",")) setDisplay(display + ",");
      return;
    }

    if (waitingForSecondValue) {
      setDisplay(val);
      setWaitingForSecondValue(false);
    } else {
      setDisplay(display === "0" ? val : display + val);
    }
  };

  const Btn = ({ label, color, flex = 1 }: { label: string; color?: string; flex?: number }) => (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: color || "#333333", flex }]}
      onPress={() => press(label)}
      activeOpacity={0.7}
    >
      <Text style={styles.btnText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />


      <View style={styles.display}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.displayText}>
          {display}
        </Text>
      </View>


      <View style={styles.keypad}>

        <View style={styles.left}>

          <View style={styles.row}>
            <Btn label="AC" color="#A5A5A5" />
            <Btn label="" color="#A5A5A5" flex={2} />
          </View>


          <View style={styles.row}>
            <Btn label="7" />
            <Btn label="8" />
            <Btn label="9" />
          </View>


          <View style={styles.row}>
            <Btn label="4" />
            <Btn label="5" />
            <Btn label="6" />
          </View>


          <View style={styles.row}>
            <Btn label="1" />
            <Btn label="2" />
            <Btn label="3" />
          </View>


          <View style={[styles.row, styles.bottomRow]}>
            <Btn label="0" flex={2} />
            <Btn label="," />
          </View>
        </View>


        <View style={styles.right}>
          <Btn label="÷" color="#FF9500" />
          <Btn label="×" color="#FF9500" />
          <Btn label="-" color="#FF9500" />
          <Btn label="+" color="#FF9500" />
          <Btn label="=" color="#FF9500" />
        </View>
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
    fontSize: 90,
    fontWeight: "200",
  },
  keypad: {
    flexDirection: "row",
    paddingBottom: 15,
  },
  left: {
    flex: 3,
    paddingHorizontal: 5,
  },
  right: {
    flex: 1,
    paddingHorizontal: 5,
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  bottomRow: {
    marginBottom: 0,
  },
  btn: {
    height: 80,
    marginHorizontal: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 1,
  },
  btnText: {
    color: "#fff",
    fontSize: 32,
  },
});
