import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import Entities from "./Entities";
import Physics from "./physics";

export default function App() {
  const [running, setRunning] = useState(false);

  const onEvent = (e) => {
    if (e.type === "game-over") {
      setRunning(false); // This forces the UI to swap to the Menu block below
    }
  };

  // Welcome Screen (Criterion 1)
  if (!running) {
    return (
      <View style={styles.menuContainer}>
        <Text style={styles.title}>Safety Fall</Text>
        <Text style={styles.subtitle}>Created by: Web Pro</Text>
        <Text style={styles.instructions}>
          Instructions: Tap the screen to apply upward force. Keep the ball from
          hitting the floor or obstacles!
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setRunning(true)}
        >
          <Text style={styles.buttonText}>START DEMO</Text>
        </TouchableOpacity>

        {/* This hidden logic ensures the alert only fires after the Menu is visible */}
        <GameOverAlert />
      </View>
    );
  }

  // Game View
  return (
    <View style={styles.container}>
      <GameEngine
        systems={[Physics]}
        entities={Entities()}
        running={running}
        onEvent={onEvent}
        style={styles.gameContainer}
      >
        <StatusBar hidden={true} />
      </GameEngine>
    </View>
  );
}

// Simple helper to fire the alert once the menu is rendered
const GameOverAlert = () => {
  useEffect(() => {
    Alert.alert("Game Over", "You hit an obstacle!");
  }, []);
  return null;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  gameContainer: { flex: 1 },
  menuContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 40, fontWeight: "bold" },
  subtitle: { fontSize: 18, marginVertical: 10 },
  instructions: { textAlign: "center", marginBottom: 30, lineHeight: 24 },
  button: { backgroundColor: "#28a745", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
});
