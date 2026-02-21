import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  Switch,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import Entities from "./Entities";
import Physics from "./physics";

export default function App() {
  const [running, setRunning] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [score, setScore] = useState(0);
  const [lastScore, setLastScore] = useState(null);

  const gameEntities = useMemo(
    () => Entities(hardMode),
    [running === true && score === 0],
  );

  const onEvent = (e) => {
    if (e.type === "game-over") {
      setLastScore(score);
      setRunning(false);
    } else if (e.type === "score") {
      setScore((prev) => prev + 1);
    }
  };

  if (!running) {
    return (
      <View style={styles.menuContainer}>
        <Text style={styles.title}>Buddy Bounce</Text>
        <Text style={styles.subtitle}>Created by: Esslam Mansour</Text>
        {lastScore !== null && (
          <View style={styles.scoreBoard}>
            <Text style={styles.gameOverText}>GAME OVER</Text>
            <Text style={styles.finalScore}>Final Score: {lastScore}</Text>
          </View>
        )}
        <View style={styles.controlRow}>
          <Text style={styles.label}>Hard Mode:</Text>
          <Switch value={hardMode} onValueChange={setHardMode} />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setScore(0);
            setRunning(true);
          }}
        >
          <Text style={styles.buttonText}>
            {lastScore !== null ? "TRY AGAIN" : "START GAME"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.liveScore}>Score: {score}</Text>
      <GameEngine
        systems={[Physics]}
        entities={gameEntities}
        running={running}
        onEvent={onEvent}
        style={styles.gameContainer}
      >
        <StatusBar hidden={true} />
      </GameEngine>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  gameContainer: { flex: 1 },
  liveScore: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    fontSize: 40,
    fontWeight: "bold",
    zIndex: 100,
  },
  menuContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  title: { fontSize: 48, fontWeight: "bold", color: "#333" },
  subtitle: { fontSize: 20, color: "#666", marginBottom: 20 },
  scoreBoard: {
    alignItems: "center",
    marginVertical: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  gameOverText: { fontSize: 24, color: "red", fontWeight: "bold" },
  finalScore: { fontSize: 32, fontWeight: "bold" },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  label: { fontSize: 18, marginRight: 10 },
  button: {
    backgroundColor: "#28a745",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
  },
  buttonText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
});
