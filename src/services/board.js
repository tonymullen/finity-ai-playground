// import DisplayHandler from './display_handler';
import BoardSetup from './board_setup';

class Board {
  constructor(gm) {
    this.gm = gm;
    this.setup_board(2);
  }

  setup_board(num) {
    const board_setup = new BoardSetup(num);
    this.station_size = board_setup.station_size;
    this.stations = board_setup.stations;
    this.station_positions = board_setup.station_positions;
  }
}

export default Board;