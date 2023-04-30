import BoardSetup from './board_setup';

class Board {
  constructor(num_players, slots, gs_id) {
    this.num_players = num_players;
    this.setup_board(this.num_players, slots, gs_id);
    this.gs_id = gs_id;
  }

  setup_board(num, slots, gs_id) {
    let board_setup = new BoardSetup(num, slots, gs_id);
    this.num_players = num;
    this.station_size = board_setup.station_size;
    this.stations = board_setup.stations;
    this.station_positions = board_setup.station_positions;
    this.start_stations = board_setup.start_stations;
    this.slots = board_setup.slots;
  }

  // duplicate(slots, gs_id) {
  //   return new Board(this.num_players, slots, gs_id);
  // }
}

export default Board;