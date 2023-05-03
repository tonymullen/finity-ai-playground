const agent = {
    "label": "ai_easy",
    "description": "A simple AI that produces a legal move",
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
        // Get all possible moves
        let possible_moves = game_state.possible_moves(color);
        // let random_index = Math.floor(Math.random()*possible_moves.length);
        // let random_move = possible_moves[random_index];

        let depth = 3;
        let best_score = -Infinity;
        let best_move = null;
  
        possible_moves.forEach(move => {
          let next_game_state = game_state.duplicate();

          let score = evaluate_depth(move, color, next_game_state, depth);
          if (score > best_score) {
            best_score = score;
            best_move = move;
          }

        });
                
        setTimeout(() => {
          resolve(best_move);
        }, 200);
      });
    return move;
}

function evaluate_depth(move, color, next_game_state, depth) {
  //let next_game_state = game_state.duplicate();
  next_game_state.apply_move(move);
  // if (depth === 0) {
    return evaluate_game_state(color, next_game_state);
  // } else {
  //   let this_depth_value = evaluate_game_state(color, next_game_state);
  //   return this_depth_value;
  // }
}

function evaluate_game_state(color, game_state) {
  let own_longest_bridge_path = game_state.longest_bridge_path(color, game_state);
  let own_longest_supported_path = game_state.longest_supported_path(color, game_state);
  let own_number_of_reachable_stations = game_state.number_of_reachable_stations(color, game_state);
  let own_number_of_rings = game_state.number_of_rings(color, game_state);
  let own_number_of_controlled_stations = game_state.number_of_controlled_stations(color, game_state);
  // let own_average_strength_of_station_pairs = game_state.average_strength_of_station_pairs(color, game_state);

  let opponents_avg_longest_bridge_path = 0;
  let opponents_avg_longest_supported_path = 0;
  let opponents_avg_number_of_reachable_stations = 0;
  let opponents_avg_number_of_rings = 0;
  let opponents_avg_number_of_controlled_stations = 0;
  // let opponents_avg_average_strength_of_station_pairs = 0;

  game_state.player_colors().filter(c => c !== color).forEach(opponent_color => {
    opponents_avg_longest_bridge_path += game_state.longest_bridge_path(opponent_color, game_state);
    opponents_avg_longest_supported_path += game_state.longest_supported_path(opponent_color, game_state);
    opponents_avg_number_of_reachable_stations += game_state.number_of_reachable_stations(opponent_color, game_state);
    opponents_avg_number_of_rings += game_state.number_of_rings(opponent_color, game_state);
    opponents_avg_number_of_controlled_stations += game_state.number_of_controlled_stations(opponent_color, game_state);
    // opponents_avg_average_strength_of_station_pairs += game_state.average_strength_of_station_pairs(opponent_color, game_state);
  });

  opponents_avg_longest_bridge_path /= game_state.player_colors().length - 1;
  opponents_avg_longest_supported_path /= game_state.player_colors().length - 1;
  opponents_avg_number_of_reachable_stations /= game_state.player_colors().length - 1;
  opponents_avg_number_of_rings /= game_state.player_colors().length - 1;
  opponents_avg_number_of_controlled_stations /= game_state.player_colors().length - 1;
  // opponents_avg_average_strength_of_station_pairs /= game_state.player_colors().length - 1;

  let longest_bridge_path_ratio = 
    own_longest_bridge_path - opponents_avg_longest_bridge_path;
  let longest_supported_path_ratio = 
     own_longest_supported_path - opponents_avg_longest_supported_path;
  let number_of_reachable_stations_ratio = 
    own_number_of_reachable_stations - opponents_avg_number_of_reachable_stations;
  let number_of_rings_ratio = 
    own_number_of_rings - opponents_avg_number_of_rings;
  let number_of_controlled_stations_ratio = 
    own_number_of_controlled_stations - opponents_avg_number_of_controlled_stations;
  // let average_strength_of_station_pairs_ratio = 
  //   own_average_strength_of_station_pairs - opponents_avg_average_strength_of_station_pairs;

  let bridge_path_weight = 1;
  let supported_path_weight = 2;
  let reachable_stations_weight = 1.5;
  let rings_weight = 1;
  let controlled_stations_weight = 0.01;
  let strength_of_station_pairs_weight = 0.01;

  let evaluation = longest_bridge_path_ratio * bridge_path_weight 
                  + longest_supported_path_ratio * supported_path_weight 
                  + number_of_reachable_stations_ratio * reachable_stations_weight
                  + number_of_rings_ratio * rings_weight
                  +  number_of_controlled_stations_ratio * controlled_stations_weight
  //                + average_strength_of_station_pairs_ratio * strength_of_station_pairs_weight;

  //let evaluation = longest_bridge_path_ratio;
  return evaluation;
}

export default agent;