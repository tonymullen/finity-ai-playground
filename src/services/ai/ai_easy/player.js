import _ from 'lodash';

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
        // let { arrow_moves, blocker_moves, base_post_moves, ring_moves } = break_down_move_types(possible_moves);

        let depth = 1;
        let max = -Infinity;
        let best_move = null;

        let { arrow_moves, blocker_moves, base_post_moves, ring_moves } = break_down_move_types(possible_moves);
  
        _.shuffle(possible_moves).forEach(move => {
          let next_game_state = game_state.duplicate();
          let prior_eval = evaluate_move(color, move, next_game_state);

          let score = get_min(move, color, next_game_state, depth);
          if (score > max) {
            max = score;
            best_move = move;
          }

        });
                
        setTimeout(() => {
          resolve(best_move);
        }, 100);
      });
    return move;
}

function get_min(move, color, game_state, depth) {
   if (depth === 0) {
    let score = evaluate_game_state(color, move, game_state);
    return score;
   } else {
    let lowest_next_depth_value = Infinity;
    let next_game_state = game_state.duplicate();
    console.log(next_game_state.turn_index);

    let next_index = next_game_state.turn_index + 1 % Object.keys(next_game_state.players).length;
   
    let next_move_color = Object.keys(next_game_state.players)[next_index];
    
    let possible_next_moves = next_game_state.possible_moves(next_move_color);
    
    let { arrow_moves, blocker_moves, base_post_moves, ring_moves } = break_down_move_types(possible_next_moves);

    possible_next_moves = _.concat(_.sampleSize(arrow_moves, 20),
                                   _.sampleSize(blocker_moves, 5),
                                   _.sampleSize(base_post_moves, 5), 
                                   _.sampleSize(ring_moves, 10));

    possible_next_moves.forEach(next_move => {
      let next_depth_value = get_min(next_move, color, next_game_state, depth-1);
      if (next_depth_value < lowest_next_depth_value) {
        lowest_next_depth_value = next_depth_value;
      }
    });

    return lowest_next_depth_value;
  }
};

function break_down_move_types(possible_moves) {
  let arrow_moves = possible_moves.filter(move => 
    ((move.piece_to_add && move.piece_to_add.constructor.name === "Arrow") ||
    (move.piece_to_remove && move.piece_to_remove.constructor.name === "Arrow")));
  let blocker_moves = possible_moves.filter(move => 
    ((move.piece_to_add && move.piece_to_add.constructor.name === "Blocker") ||
    (move.piece_to_remove && move.piece_to_remove.constructor.name === "Blocker")));
  let base_post_moves = possible_moves.filter(move => 
    ((move.piece_to_add && move.piece_to_add.constructor.name === "BasePost") ||
    (move.piece_to_remove && move.piece_to_remove.constructor.name === "BasePost")));
  let ring_moves = possible_moves.filter(move => 
    ((move.piece_to_add && move.piece_to_add.constructor.name === "Ring") ||
    (move.piece_to_remove && move.piece_to_remove.constructor.name === "Ring")));
  
  return { arrow_moves, blocker_moves, base_post_moves, ring_moves };
}
 
function evaluate_game_state(color, move, game_state) {
  move.gs_id = game_state.gs_id;
  game_state.apply_move(move);
  let own_longest_bridge_path = game_state.longest_bridge_path(color, game_state);

  let own_longest_supported_path = game_state.longest_supported_path(color, game_state);
  let own_number_of_reachable_stations = game_state.number_of_reachable_stations(color, game_state);
  let own_number_of_rings = game_state.number_of_rings(color, game_state);
  let own_number_of_controlled_stations = game_state.number_of_controlled_stations(color, game_state);
  let own_average_strength_of_station_pairs = game_state.average_strength_of_station_pairs(color, game_state);

  let opponents_avg_longest_bridge_path = 0;
  let opponents_avg_longest_supported_path = 0;
  let opponents_avg_number_of_reachable_stations = 0;
  let opponents_avg_number_of_rings = 0;
  let opponents_avg_number_of_controlled_stations = 0;
  let opponents_avg_average_strength_of_station_pairs = 0;

  let opponents_max_longest_bridge_path = 0;
  let opponents_max_longest_supported_path = 0;
  let opponents_max_number_of_reachable_stations = 0;
  let opponents_max_number_of_rings = 0;
  let opponents_max_number_of_controlled_stations = 0;
  let opponents_max_average_strength_of_station_pairs = 0;

  game_state.player_colors().filter(c => c !== color).forEach(opponent_color => {
    opponents_avg_longest_bridge_path += game_state.longest_bridge_path(opponent_color, game_state);
    opponents_avg_longest_supported_path += game_state.longest_supported_path(opponent_color, game_state);
    opponents_avg_number_of_reachable_stations += game_state.number_of_reachable_stations(opponent_color, game_state);
    opponents_avg_number_of_rings += game_state.number_of_rings(opponent_color, game_state);
    opponents_avg_number_of_controlled_stations += game_state.number_of_controlled_stations(opponent_color, game_state);
    opponents_avg_average_strength_of_station_pairs += game_state.average_strength_of_station_pairs(opponent_color, game_state);
  
    opponents_max_longest_bridge_path = Math.max(opponents_max_longest_bridge_path, 
      game_state.longest_bridge_path(opponent_color, game_state));
    opponents_max_longest_supported_path = Math.max(opponents_max_longest_supported_path,
      game_state.longest_supported_path(opponent_color, game_state));
    opponents_max_number_of_reachable_stations = Math.max(opponents_max_number_of_reachable_stations,
      game_state.number_of_reachable_stations(opponent_color, game_state));
    opponents_max_number_of_rings = Math.max(opponents_max_number_of_rings,
      game_state.number_of_rings(opponent_color, game_state));
    opponents_max_number_of_controlled_stations = Math.max(opponents_max_number_of_controlled_stations,
      game_state.number_of_controlled_stations(opponent_color, game_state));
    opponents_max_average_strength_of_station_pairs = Math.max(opponents_max_average_strength_of_station_pairs,
      game_state.average_strength_of_station_pairs(opponent_color, game_state));

  });

  opponents_avg_longest_bridge_path /= game_state.player_colors().length - 1;
  opponents_avg_longest_supported_path /= game_state.player_colors().length - 1;
  opponents_avg_number_of_reachable_stations /= game_state.player_colors().length - 1;
  opponents_avg_number_of_rings /= game_state.player_colors().length - 1;
  opponents_avg_number_of_controlled_stations /= game_state.player_colors().length - 1;
  opponents_avg_average_strength_of_station_pairs /= game_state.player_colors().length - 1;

  // let longest_bridge_path_ratio = 
  //   own_longest_bridge_path - opponents_max_longest_bridge_path;
  // let longest_supported_path_ratio = 
  //   own_longest_supported_path - opponents_max_longest_supported_path;
  // let number_of_reachable_stations_ratio =
  //   own_number_of_reachable_stations - opponents_max_number_of_reachable_stations; 
  // let number_of_rings_ratio = 
  //   own_number_of_rings - opponents_max_number_of_rings;  
  // let number_of_controlled_stations_ratio = 
  //   own_number_of_controlled_stations - opponents_max_number_of_controlled_stations;
  // let average_strength_of_station_pairs_ratio = 
  //   own_average_strength_of_station_pairs - opponents_max_average_strength_of_station_pairs;
  
  let longest_bridge_path_ratio = 
    own_longest_bridge_path - (opponents_avg_longest_bridge_path*0.8);
  let longest_supported_path_ratio = 
    own_longest_supported_path - (opponents_avg_longest_supported_path*0.8);
  let number_of_reachable_stations_ratio =
    own_number_of_reachable_stations - (opponents_avg_number_of_reachable_stations*0.9);
  let number_of_rings_ratio = 
    own_number_of_rings - (opponents_avg_number_of_rings*1.2);
  let number_of_controlled_stations_ratio = 
    own_number_of_controlled_stations - (opponents_avg_number_of_controlled_stations*1.1);
  let average_strength_of_station_pairs_ratio = 
    own_average_strength_of_station_pairs - opponents_avg_average_strength_of_station_pairs;

  let bridge_path_weight = 10;
  let supported_path_weight = 5;
  let reachable_stations_weight = 1.5;
  let rings_weight = 1;
  let controlled_stations_weight = 0.01;
  let strength_of_station_pairs_weight = 0.01;

  let evaluation = longest_bridge_path_ratio * bridge_path_weight 
                  // + longest_supported_path_ratio * supported_path_weight 
                  // + number_of_reachable_stations_ratio * reachable_stations_weight
                  // + number_of_rings_ratio * rings_weight
                  // +  number_of_controlled_stations_ratio * controlled_stations_weight
                  // + average_strength_of_station_pairs_ratio * strength_of_station_pairs_weight;

  //let evaluation = longest_bridge_path_ratio;
  return evaluation;
}

function evaluate_move(color, move, game_state) {
  if (move.move_type === 'place') {
    if (move.piece_to_add.constructor.name === 'Arrow') {

    }
  }
}


export default agent;