import Matter from "matter-js";

const Physics = (entities, { touches, time, dispatch }) => {
    let engine = entities.physics.engine;
    
    entities.physics.timer += time.delta;
    let secondsPassed = entities.physics.timer / 1000;

    Object.keys(entities).forEach(key => {
        if (key.includes("Obs")) {
            let body = entities[key].body;
            let obsIndex = parseInt(key.replace("Obs", ""));

            if (secondsPassed > (obsIndex * 3)) {
                if (body.position.x < -100) {
                    Matter.Body.setPosition(body, { x: -60, y: Math.floor(Math.random() * 450) + 70 });
                }

                Matter.Body.setPosition(body, {
                    x: body.position.x + 1.2, 
                    y: body.position.y
                });

                if (body.position.x > 460) {
                    Matter.Body.setPosition(body, { x: -60, y: Math.floor(Math.random() * 450) + 70 });
                }
            }
        }
    });

    touches.filter(t => t.type === "press").forEach(t => {
        Matter.Body.applyForce(entities.Player.body, entities.Player.body.position, {
            x: 0, y: -0.04
        });
        dispatch({ type: "score" });
    });

    Matter.Events.on(engine, 'collisionStart', (event) => {
        dispatch({ type: "game-over" });
    });

    Matter.Engine.update(engine, 1000 / 60); 
    return entities;
};

export default Physics;