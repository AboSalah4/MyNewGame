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
  // State for UI management
  const [running, setRunning] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [score, setScore] = useState(0);
  const [lastScore, setLastScore] = useState(null);

  // FEATURE 1: useRef for non-UI states
  // We use refs to store the background music and collision lock.
  // This prevents the app from re-rendering every time the music starts or stops.
  const bgmRef = useRef(null);
  const isGameOver = useRef(false);

  // FEATURE 2: Clean Memory Management
  // unloadAsync ensures we delete the sound from the device's RAM
  // once it's done playing, preventing crashes over time.
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

  // FEATURE 3: Audio Sequencing
  // Using setTimeout creates a professional feel by playing the 'Start'
  // effect 1 second before the looping music begins.
  const handleStartGame = () => {
    isGameOver.current = false;
    setScore(0);
    setRunning(true);
    playEffect(require("./assets/start.mp3"));

    setTimeout(async () => {
      if (isGameOver.current) return;
      if (bgmRef.current) {
        try {
          await bgmRef.current.unloadAsync();
        } catch (e) {}
      }
      const { sound } = await Audio.Sound.createAsync(
        require("./assets/funny.mp3"),
        { isLooping: true },
      );
      bgmRef.current = sound;
      await sound.playAsync();
    }, 1000);
  };

  // FEATURE 4: The Collision Lock
  // isGameOver.current acts as a 'gate' so the game-over logic
  // fires exactly once, even if multiple collisions are detected.
  const onEvent = (e) => {
    if (e.type === "game-over" && !isGameOver.current) {
      isGameOver.current = true;
      setRunning(false);
      setLastScore(score);

      if (bgmRef.current) {
        bgmRef.current.stopAsync().then(() => {
          bgmRef.current.unloadAsync();
          bgmRef.current = null;
        });
      }
      playEffect(require("./assets/collision.mp3"));
    } else if (e.type === "score" && !isGameOver.current) {
      setScore((prev) => prev + 1);
    }
  };

  // FEATURE 5: Optimization with useMemo
  // Entities are only recalculated when the game restarts, saving battery and CPU.
  const gameEntities = useMemo(
    () => Entities(hardMode),
    [running === true && score === 0],
  );

  // FEATURE 6: Minimalist UI
  // Simple conditional rendering switches between the Menu and the Game Engine.
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
