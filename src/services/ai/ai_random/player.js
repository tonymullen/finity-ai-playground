const agent = {
    "label": "ai_random",
    "description": "A simple AI that produces a randomly selected legal move",
    "author": "Tony Mullen",
    "move": move,
}

/**
 * Generate a move for color based on existing game state
 * 
 * @param {Color} color 
 * @param {GameState} game_state 
 * @returns {Move}
 */
function move(color, game_state) {
    const move = new Promise(resolve => {
      let possible_moves = game_state.possible_moves(color);
      // console.log(possible_moves);
      let random_index = Math.floor(Math.random()*possible_moves.length)
      let random_move = possible_moves[random_index];
        setTimeout(() => {
          resolve(random_move);
        }, 750);
      });
    return move;
}

export default agent;