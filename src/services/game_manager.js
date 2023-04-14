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
    // default player agent is local human
    this.player_agents = {
      'cyan': 'human-loc',
      'yellow': 'human-loc',
      'purple': 'human-loc',
      'red': 'human-loc'
    }
    this.turn_index = 0;
    this.player_moving = null;
    this.move_in_progress = false;
    this.move_to_finalize = null;
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
      this.redraw();
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

  place_ring(color, size, station_id, ring) {
    if (!ring) {
      // console.log("Creating a ring from scratch")
      ring = new Ring(color, size, this.board.stations[station_id]);
    } else {
      //  console.log("Reusing a ring")
      station_id= ring.station.number;
    }
    // console.log(this.game_state);
    this.game_state.rings.push(ring);
    this.board.stations[station_id].rings.push(ring);
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
    this.redraw();
  }

  set_up_base_posts() {
    let base_posts = [];
    this.player_colors().forEach( (color, ind) => {
      base_posts.push(new BasePost(color, this.board.stations[
        this.board.start_stations[ind]
      ]));
      this.board.stations[
        this.board.start_stations[ind]
      ].base_post = color;
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

      this.redraw();
    }
  }

  start_move(player, move_type) {
    this.player_moving = player;
    this.move_in_progress = move_type;
    console.log(`starting ${move_type} move for ${player}`)
    this.redraw();
  }

  generate_move_preview(mouse_x, mouse_y) {
    let preview = null;
    if (this.move_in_progress === 'ring') {
      Object.keys(this.board.stations).forEach( stat_key => {
        let station = this.board.stations[stat_key];
        if (Math.abs(mouse_x - station.x) < 30 && 
            Math.abs(mouse_y - station.y) < 30) {
              if (this.can_place_ring(station, this.player_moving)) {
                let size = 's';
                if (station.rings.length === 1) {
                  size = 'm';
                } else if (station.rings.length === 2) {
                  size = 'l';
                }
                preview =  new Ring(this.player_moving, size, station);   
            }
        }
      });
    } else if (this.move_in_progress === 'base-post') {
      Object.keys(this.board.stations).forEach( stat_key => {
        let station = this.board.stations[stat_key];
        if (Math.abs(mouse_x - station.x) < 30 && 
            Math.abs(mouse_y - station.y) < 30) {
              if (this.can_move_base_post(station, this.player_moving)) {
                preview  = new BasePost(this.player_moving, station);
            }
          }
      });
    }
    this.move_to_finalize = preview;
    this.redraw();
    return preview;
  }

  can_place_ring(station, color) {
    return ((station.rings.length < 3) && 
            (station.base_post !== color))
  }

  can_move_base_post(station, color) {
    return (!station.base_post);
  }

  handle_move_click() {
    if (this.move_to_finalize) {
      if (this.move_to_finalize.constructor.name === 'Ring') {
        this.place_ring(null, null, null, this.move_to_finalize);

        this.move_in_progress = false;
        this.move_to_finalize = null;
        this.next_turn();
        this.redraw();
      }
    }
  }

  next_turn() {
    this.turn_index = (this.turn_index + 1) % this.player_count();
  }

  is_turn() {
    return this.player_colors()[this.turn_index];
  }

  redraw() {
    this.app.setState({});
    this.needs_redraw = true;
  }
}

export default GameManager;