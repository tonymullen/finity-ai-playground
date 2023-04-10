import BasePost from './base_post';
import Arrow from './arrow';
import Ring from './ring';
import Board from './board';


class GameManager {
  constructor(app) {
    this.app = app;
    this.board = new Board(this);
    this.players = {
      'red': true,
      'cyan': true,
      'purple': true,
      'yellow': true
    };
    this.game_state = {
      board: this.board,
      path_pattern: ['b','w','b','w','b','b','b','w'],
      arrows: [],
      rings: [],
      base_posts: [
        new BasePost('red', this.board.stations['0,1']),
        new BasePost('cyan', this.board.stations['1,0']),
        new BasePost('purple', this.board.stations['-1,0']),
        new BasePost('yellow', this.board.stations['0,-1']),
      ]
    }
    this.needs_redraw = true;
  }

  set_app(app) {
    this.app = app;
  }

  color_is_playing(color) {
      return this.players[color];
  }

  toggle_player(color) {
    // Ensure that there are at least 2 players
    if (!this.players[color] || this.player_count()  > 2) {
      this.players[color] = !this.players[color];
      this.reset_board(this.player_count());
      this.app.setState({});
      this.needs_redraw = true;
    }
  }

  player_count() {
    return Object.values(this.players).filter( p => p).length;
  }

  player_colors() {
    return Object.keys(this.players).filter( p => this.players[p]);
  }

  move_base_post(color, station) {

  }

  place_ring(color, size, station) {
    let ring = new Ring(color, size, this.board.stations[station]);
    this.game_state.rings.push(ring);
  }

  place_arrow(color, start_stat, dest_stat, slot){
      // 'b', "-1,0", "-1,1", "l"
      let start = this.board.stations[start_stat];
      let dest = this.board.stations[dest_stat];

      let arrow = new Arrow(color, start, dest, slot);
      this.game_state.arrows.push(arrow);
  }

  get_game_state() {
    return this.game_state;
  }

  set_needs_redraw(bool) {
    this.needs_redraw = bool;
  }

  reset_board(num) {
    if (num != this.board.num_players) {
      this.board.setup_board(num);
      this.app.setState({});
      this.needs_redraw = true;
    }
  }
}

export default GameManager;