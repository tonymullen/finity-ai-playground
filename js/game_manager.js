class GameManager {
  constructor(imgs) {
    this.board = new Board(this, imgs);
    this.path_pattern = ['b','w','b','w','b','b','b','w']
    this.game_state = {
      arrows: [],
      rings: [],
      base_posts: [
        new BasePost('red', this.board.stations['0,1'], imgs),
        new BasePost('cyan', this.board.stations['1,0'], imgs),
        new BasePost('purple', this.board.stations['-1,0'], imgs),
        new BasePost('yellow', this.board.stations['0,-1'], imgs),
      ]
    }
  }

  move_base_post(color, station) {

  }

  place_ring(color, size, station) {
    let ring = new Ring(color, size, this.board.stations[station], imgs);
    this.game_state.rings.push(ring);
  }

  place_arrow(color, start_stat, dest_stat, slot){
      // 'b', "-1,0", "-1,1", "l"
      let start = this.board.stations[start_stat];
      let dest = this.board.stations[dest_stat];

      let arrow = new Arrow(color, start, dest, slot, imgs);
      this.game_state.arrows.push(arrow);
    }

  game_state() {

  }
}