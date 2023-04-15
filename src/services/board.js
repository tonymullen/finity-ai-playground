// import DisplayHandler from './display_handler';
import BoardSetup from './board_setup';

class Board {
  constructor() {
    this.num_players = 4;
    this.setup_board(this.num_players);
  }

  setup_board(num) {
    // this.station = [];
    let board_setup = new BoardSetup(num);
    this.num_players = num;
    this.station_size = board_setup.station_size;
    this.stations = board_setup.stations;
    this.station_positions = board_setup.station_positions;
    this.start_stations = board_setup.start_stations;
    this.slots = board_setup.slots;
  }
}

export default Board;