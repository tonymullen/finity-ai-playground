import BoardSetup from './board_setup';

class Board {
  constructor(num_players, slots, gs_id) {
    this.num_players = num_players;
    let board_setup = new BoardSetup(this.num_players, slots, gs_id);
    this.station_size = board_setup.station_size;
    this.stations = board_setup.stations;
    this.station_positions = board_setup.station_positions;
    this.start_stations = board_setup.start_stations;
    this.slots = board_setup.slots;
    this.gs_id = gs_id;
  }
}

export default Board;