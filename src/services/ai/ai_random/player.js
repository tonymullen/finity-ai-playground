import { game_state as gs } from '../../game_state';

const agent = {
    "label": "ai_random",
    "description": "A simple AI that produces a randomly selected legal move",
    "author": "Tony Mullen",
    "move": move,
}

/**
 * Generate a move based on existing game state
 * and previous move
 * @param {GameState} game_state 
 * @param {Move} last_move 
 * @returns {Move}
 */
function move(game_state, last_move) {
    const move = new Promise((resolve, reject) => {
      let arrows = gs.arrows;
      console.log(arrows);

        setTimeout(() => {
          resolve("My Random AI move", arrows);
        }, 2000);

      });
    return move;
}

export default agent;