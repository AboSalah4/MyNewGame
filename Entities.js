import Matter from "matter-js";
import { View } from "react-native";
import React from "react";

// Helper component to render a rectangle
const Box = (props) => {
  const width = props.size[0];
  const height = props.size[1];
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        backgroundColor: props.color,
      }}
    />
  );
};

// Helper component to render a circle
const Circle = (props) => {
  const radius = props.radius;
  const x = props.body.position.x - radius;
  const y = props.body.position.y - radius;

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: radius * 2,
        height: radius * 2,
        borderRadius: radius,
        backgroundColor: props.color,
      }}
    />
  );
};

export default (restart) => {
  let engine = Matter.Engine.create({ enableSleeping: false });
  let world = engine.world;
  world.gravity.y = 0.4; // Setting world gravity

  // 1. Player (Moving Circle)
  let Player = Matter.Bodies.circle(200, 300, 20, { label: "Player" });

  // 2. Floor (Static Rectangle)
  let Floor = Matter.Bodies.rectangle(200, 600, 400, 20, {
    isStatic: true,
    label: "Floor",
  });

  // 3-7. Obstacles (5 Mixed Shapes)
  let Obs1 = Matter.Bodies.rectangle(100, 150, 50, 50, { isStatic: false }); // Moving 2
  let Obs2 = Matter.Bodies.rectangle(300, 150, 50, 50, { isStatic: false }); // Moving 3
  let Obs3 = Matter.Bodies.rectangle(200, 450, 100, 20, { isStatic: true });
  let Obs4 = Matter.Bodies.circle(100, 400, 20, { isStatic: true });
  let Obs5 = Matter.Bodies.circle(300, 400, 20, { isStatic: true });

  Matter.World.add(world, [Player, Floor, Obs1, Obs2, Obs3, Obs4, Obs5]);

  return {
    physics: { engine, world },
    Player: { body: Player, radius: 20, color: "blue", renderer: <Circle /> },
    Floor: { body: Floor, size: [400, 20], color: "green", renderer: <Box /> },
    Obs1: { body: Obs1, size: [50, 50], color: "red", renderer: <Box /> },
    Obs2: { body: Obs2, size: [50, 50], color: "red", renderer: <Box /> },
    Obs3: { body: Obs3, size: [100, 20], color: "orange", renderer: <Box /> },
    Obs4: { body: Obs4, radius: 20, color: "orange", renderer: <Circle /> },
    Obs5: { body: Obs5, radius: 20, color: "orange", renderer: <Circle /> },
  };
};
