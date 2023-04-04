import BasePost from '../services/base_post';
import Arrow from '../services/arrow';
import Ring from '../services/ring';
import Board from '../services/board';


class GameManager {
  constructor(p5, imgs) {
    this.p5 = p5;
    this.imgs = imgs;
    this.board = new Board(p5, this, imgs);
    this.path_pattern = ['b','w','b','w','b','b','b','w']
    this.game_state = {
      arrows: [],
      rings: [],
      base_posts: [
        new BasePost(this.p5, 'red', this.board.stations['0,1'], imgs),
        new BasePost(this.p5, 'cyan', this.board.stations['1,0'], imgs),
        new BasePost(this.p5, 'purple', this.board.stations['-1,0'], imgs),
        new BasePost(this.p5, 'yellow', this.board.stations['0,-1'], imgs),
      ]
    }
  }

  move_base_post(color, station) {

  }

  place_ring(color, size, station) {
    let ring = new Ring(this.p5, color, size, this.board.stations[station], this.imgs);
    this.game_state.rings.push(ring);
  }

  place_arrow(color, start_stat, dest_stat, slot){
      // 'b', "-1,0", "-1,1", "l"
      let start = this.board.stations[start_stat];
      let dest = this.board.stations[dest_stat];

      let arrow = new Arrow(this.p5, color, start, dest, slot, this.imgs);
      this.game_state.arrows.push(arrow);
    }

  game_state() {

  }
}

export default GameManager;