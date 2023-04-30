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

      // Tweaking the distribution of moves makes for
      // more interesting random game play, since there are
      // generally many more arrrow and blocker moves than ring
      // or base post moves available.
      let move_prefs = {
        "Arrow": 0.05,
        "Blocker": 0.1,
        "BasePost": 0.8,
        "Ring": 1.0,
      }

      // Get all possible moves
      let possible_moves = game_state.possible_moves(color);

      // We could just pick a random entry, but it would wind up
      // mostly picking arrow and blocker moves, which are more
      // common than ring and base post moves. So we'll pick a random
      // threshold and use the preferences above to pick a move that
      // meets the threshold. The while loop ensures we eventually pick 
      // some move.
      let random_move = null;
      while (!random_move) {
        let random_index = Math.floor(Math.random()*possible_moves.length);
        let random_cutoff = Math.random();
        random_move = possible_moves[random_index];
        if ((random_move.piece_to_add &&
            random_cutoff > move_prefs[random_move.piece_to_add.constructor.name]) ||
            (random_move.piece_to_remove &&
            random_cutoff > move_prefs[random_move.piece_to_remove.constructor.name])) {
            random_move = null;
          }
        }

        // Resolve the promise after a short delay to simulate
        // the AI "thinking" about its move.
        setTimeout(() => {
          resolve(random_move);
        }, 1000);
      });
    return move;
}

export default agent;