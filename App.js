import React, { useState, useMemo, useRef } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  Switch,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import { Audio } from "expo-av";
import Entities from "./Entities";
import Physics from "./physics";

export default function App() {
  const [running, setRunning] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [score, setScore] = useState(0);
  const [lastScore, setLastScore] = useState(null);

  const bgmRef = useRef(null);
  const isGameOver = useRef(false);

  const playEffect = async (file) => {
    try {
      const { sound } = await Audio.Sound.createAsync(file);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) sound.unloadAsync();
      });
    } catch (error) {
      console.log("Audio Error:", error);
    }
  };

  const handleStartGame = () => {
    isGameOver.current = false;
    setScore(0);
    setRunning(true);

    // 1. Play the start sound immediately
    playEffect(require("./assets/start.mp3"));

    // 2. Wait 1 second (1000ms), then start the background music
    setTimeout(async () => {
      // Safety check: Don't start the music if they crashed in the first second!
      if (isGameOver.current) return;

      if (bgmRef.current) {
        try {
          await bgmRef.current.unloadAsync();
        } catch (e) {}
      }

      try {
        const { sound } = await Audio.Sound.createAsync(
          require("./assets/funny.mp3"),
          { isLooping: true },
        );
        bgmRef.current = sound;
        await sound.playAsync();
      } catch (error) {
        console.log("BGM Error:", error);
      }
    }, 1000);
  };

  const onEvent = (e) => {
    if (e.type === "game-over" && !isGameOver.current) {
      isGameOver.current = true;

      setRunning(false);
      setLastScore(score);

      if (bgmRef.current) {
        bgmRef.current
          .stopAsync()
          .then(() => {
            bgmRef.current.unloadAsync();
            bgmRef.current = null;
          })
          .catch((err) => console.log("Stop BGM Error:", err));
      }

      playEffect(require("./assets/collision.mp3"));
    } else if (e.type === "score" && !isGameOver.current) {
      setScore((prev) => prev + 1);
    }
  };

  const gameEntities = useMemo(
    () => Entities(hardMode),
    [running === true && score === 0],
  );

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
        <TouchableOpacity style={styles.button} onPress={handleStartGame}>
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
