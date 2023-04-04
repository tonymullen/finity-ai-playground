import BoardSetup from '../services/board_setup';

class Board {
  constructor(p5, gm, imgs) {
    this.p5 = p5;
    this.gm = gm;
    this.imgs = imgs;
    this.setup_board(3);
  }

  draw_board() {
    Object.keys(this.stations).forEach( stat_key => {
      this.stations[stat_key].display();
    });

    [...this.gm.path_pattern].reverse().forEach((cone, ind) => {
      // cone.display();
      this.p5.image(cone === 'b' ? this.imgs.ind_side_b: this.imgs.ind_side_w, 850, 150+(ind*50), 100, 70)
    })

    this.gm.game_state.base_posts.forEach( bp => {
      bp.display();
    });

    this.gm.game_state.arrows.forEach(arrow => {
      arrow.display();
    })

    this.gm.game_state.rings.forEach(ring => {
      ring.display();
    })
  }

  setup_board(num) {
    const board_setup = new BoardSetup(this.p5, num, this.imgs);
    this.station_size = board_setup.station_size;
    this.stations = board_setup.stations;
    this.station_positions = board_setup.station_positions;
  }
}

export default Board;