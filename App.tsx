
import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>

      <Text style={styles.title}>Zadanie 3</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(!visible)}>
        <Text style={styles.buttonText}>{visible ? 'Ukryj' : 'Pokaż'}</Text>
      </TouchableOpacity>

      {visible && (
        <View style={styles.textBox}>
          <Text style={styles.text}>Ilona</Text>
          <Text style={styles.text}>Hrabovenko</Text>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textBox: {
    marginTop: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default App;
