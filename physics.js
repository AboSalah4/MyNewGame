import Matter from "matter-js";

const Physics = (entities, { touches, time, dispatch }) => {
    let engine = entities.physics.engine;

    // 1. Handle Taps (Moving the Player)
    touches.filter(t => t.type === "press").forEach(t => {
        Matter.Body.applyForce(entities.Player.body, entities.Player.body.position, {
            x: 0,
            y: -0.04
        });
    });

    // 2. Collision Detection (Criterion 5)
    Matter.Events.on(engine, 'collisionStart', (event) => {
        var pairs = event.pairs;
        
        pairs.forEach(pair => {
            // Check if Player hit the Floor or Obstacles
            if (pair.bodyA.label === "Player" || pair.bodyB.label === "Player") {
                dispatch({ type: "game-over" }); // Send a signal to App.js
            }
        });
    });

    Matter.Engine.update(engine, time.delta);

    return entities;
};

export default Physics;