import BasePost from './base_post';
import Arrow from './arrow';
import Blocker from './blocker';
import Ring from './ring';
import Board from './board';


class GameManager {
  constructor(app) {
    this.app = app;
    this.board = new Board(this);
    this.players = {
      'cyan': true,
      'yellow': true,
      'purple': true,
      'red': true
    };
    this.game_state = {
      board: this.board,
      path_pattern: ['b','w','b','w','b','b','b','w'],
      arrows: [],
      rings: [],
      blockers:  this.set_up_blockers(),
      base_posts: this.set_up_base_posts(),
    };
    this.player_agents = {
      'cyan': 'human',
      'yellow': 'human',
      'purple': 'human',
      'red': 'human'
    }
    this.player_moving = null;
    this.move_in_progress = false;
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
    this.board.stations[station].rings.push(ring);
  }

  place_arrow(color, start_stat, dest_stat, slot){
      // 'b', "-1,0", "-1,1", "l"
      let start = this.board.stations[start_stat];
      let dest = this.board.stations[dest_stat];

      let arrow = new Arrow(color, start, dest, slot);
      this.game_state.arrows.push(arrow);
  }

  place_blocker(color, start_stat, dest_stat, slot){
    // 'b', "-1,0", "-1,1", "l"
    let start = this.board.stations[start_stat];
    let dest = this.board.stations[dest_stat];

    let blocker = new Blocker(color, start, dest, slot);
    this.game_state.blockers.push(blocker);
  }

  get_game_state() {
    return this.game_state;
  }

  set_needs_redraw(bool) {
    this.needs_redraw = bool;
  }

  set_player_agent(color, agent) {
    console.log(`setting ${agent} agent for`, color)
    this.player_agents[color] = agent;
    this.app.setState({});
    this.needs_redraw = true;
  }

  set_up_base_posts() {
    let base_posts = [];
    this.player_colors().forEach( (color, ind) => {
      base_posts.push(new BasePost(color, this.board.stations[
        this.board.start_stations[ind]
      ]));
    });
    return base_posts;
  }

  set_up_blockers() {
    let blockers= [];
    this.player_colors().forEach( (color, ind) => {
      blockers.push(new Blocker(color, 
        this.board.stations[
          this.board.start_stations[ind]],
        this.board.stations['0,0'],
        'l'
        ));
      blockers.push(new Blocker(color,
        this.board.stations[
          this.board.start_stations[ind]],
        this.board.stations['0,0'],
        'r'
        ));
    });
    return blockers;
  }

  reset_board(num) {
    if (num !== this.board.num_players) {
      this.board.setup_board(num);
      this.game_state.base_posts = this.set_up_base_posts();
      this.game_state.blockers = this.set_up_blockers();

      this.app.setState({});
      this.needs_redraw = true;
    }
  }

  start_move(player, move_type) {
    this.player_moving = player;
    this.move_in_progress = move_type;

    this.app.setState({});
    this.needs_redraw = true;
  }

  generate_move_preview(mouse_x, mouse_y) {
    if (this.move_in_progress === 'ring') {
      let preview = null;
      Object.keys(this.board.stations).forEach( stat_key => {
        let station = this.board.stations[stat_key];
        if (Math.abs(mouse_x - station.x) < 50 && 
            Math.abs(mouse_y - station.y) < 50) {
             let preview_ring = new Ring(this.player_moving, 's', station);
             preview = preview_ring;
        } 
      });
      return preview;
    }

  }
}

export default GameManager;