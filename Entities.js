import Matter from "matter-js";
import { View } from "react-native";
import React from "react";

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
        borderRadius: 5,
      }}
    />
  );
};

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

export default (hardMode) => {
  let engine = Matter.Engine.create({ enableSleeping: false });
  let world = engine.world;
  world.gravity.y = hardMode ? 1.0 : 0.4;

  let Player = Matter.Bodies.circle(200, 300, 20, { label: "Player" });
  let Floor = Matter.Bodies.rectangle(200, 600, 400, 20, {
    isStatic: true,
    label: "Floor",
  });
  let Ceiling = Matter.Bodies.rectangle(200, 0, 400, 20, {
    isStatic: true,
    label: "Ceiling",
  });

  let Obs1 = Matter.Bodies.rectangle(-1000, 100, 40, 40, {
    isStatic: true,
    label: "Obs",
  });
  let Obs2 = Matter.Bodies.rectangle(-1000, 200, 40, 40, {
    isStatic: true,
    label: "Obs",
  });
  let Obs3 = Matter.Bodies.circle(-1000, 300, 20, {
    isStatic: true,
    label: "Obs",
  });
  let Obs4 = Matter.Bodies.circle(-1000, 400, 20, {
    isStatic: true,
    label: "Obs",
  });
  let Obs5 = Matter.Bodies.rectangle(-1000, 500, 60, 20, {
    isStatic: true,
    label: "Obs",
  });

  Matter.World.add(world, [
    Player,
    Floor,
    Ceiling,
    Obs1,
    Obs2,
    Obs3,
    Obs4,
    Obs5,
  ]);

  return {
    physics: { engine, world, timer: 0 },
    Player: { body: Player, radius: 20, color: "blue", renderer: Circle },
    Floor: { body: Floor, size: [400, 20], color: "green", renderer: Box },
    Ceiling: { body: Ceiling, size: [400, 20], color: "red", renderer: Box },
    Obs1: { body: Obs1, size: [40, 40], color: "purple", renderer: Box },
    Obs2: { body: Obs2, size: [40, 40], color: "purple", renderer: Box },
    Obs3: { body: Obs3, radius: 20, color: "purple", renderer: Circle },
    Obs4: { body: Obs4, radius: 20, color: "purple", renderer: Circle },
    Obs5: { body: Obs5, size: [60, 20], color: "purple", renderer: Box },
  };
};
