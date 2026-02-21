import Matter from "matter-js";

const Physics = (entities, { touches, time, dispatch }) => {
    let engine = entities.physics.engine;

    // Handle Taps
    touches.filter(t => t.type === "press").forEach(t => {
        Matter.Body.applyForce(entities.Player.body, entities.Player.body.position, {
            x: 0, y: -0.05
        });
        dispatch({ type: "score" });
    });

    // Handle Collisions for Floor, Ceiling, and Obstacles
    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach(pair => {
            const labels = [pair.bodyA.label, pair.bodyB.label];
            if (labels.includes("Player") && 
               (labels.includes("Floor") || labels.includes("Ceiling") || labels.includes("Obs"))) {
                dispatch({ type: "game-over" });
            }
        });
    });

    Matter.Engine.update(engine, time.delta);
    return entities;
};

export default Physics;