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
      path_pattern: this.generate_path_pattern(),
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
    this.move_in_progress = null;
    this.move_to_finalize = null;
    this.piece_to_move = null;
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

  move_base_post(base_post) {
    this.game_state.base_posts.forEach( bp => {
      if (bp.color === base_post.color) {
        bp.station.base_post = null;
        bp.station = base_post.station;
      }
    });
  }

  place_ring(color, size, station_id, ring) {
    if (!ring) {
      // Creating a ring from scratch
      ring = new Ring(color, size, this.board.stations[station_id]);
    } else {
      //  Reusing a ring
      station_id= ring.station.number;
    }
    this.game_state.rings.push(ring);
    this.board.stations[station_id].rings.push(ring);
  }

  // place_arrow(color, start_stat, dest_stat, slot){
  place_arrow(arrow){
      let placed_arrow = 
        new Arrow(arrow.color, 
                  arrow.from_station,
                  arrow.to_station, 
                  null,
                  arrow.slot, false);
      arrow.slot.add_arrow(placed_arrow);
      this.game_state.arrows.push(arrow);
  }

  place_blocker(blocker){
      let placed_blocker = 
        new Blocker(blocker.color, null, null, null, blocker.slot, false);
      blocker.slot.add_blocker(placed_blocker);
      this.game_state.blockers.push(placed_blocker);
      // Remove blocker that was set to move (previous position)
      this.game_state.blockers = this.game_state.blockers.filter( 
        b => b.to_move === false 
      );
      this.piece_to_move.slot.contains = null;
      this.piece_to_move = null;
  }

  remove_blocker(blocker) {
    blocker.slot.contains = null;
    this.game_state.blockers = this.game_state.blockers.filter( 
      b => b.to_move === false 
    );
    blocker.to_move = false;
  }

  get_game_state() {
    return this.game_state;
  }

  set_needs_redraw(bool) {
    this.needs_redraw = bool;
  }

  set_player_agent(color, agent) {
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
    this.redraw();
  }

  cancel_move() {
    this.player_moving = null;
    this.move_in_progress = null;
    this.move_to_finalize = null;
    this.piece_to_move.to_move = false;
    this.piece_to_move = null;
    this.redraw();
  }

  generate_move_preview(mouse_x, mouse_y) {
    const move_cancel_x_range = [50, 750];
    const move_cancel_y_range = [1,  648];
    let preview = this.move_to_finalize;
    if (mouse_x < move_cancel_x_range[0] || mouse_x > move_cancel_x_range[1] ||
      mouse_y < move_cancel_y_range[0] || mouse_y > move_cancel_y_range[1]) {
        preview = null;
      }
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
      this.move_to_finalize = preview;
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
      this.move_to_finalize = preview;
    } else if (this.move_in_progress === 'blocker') {
      this.game_state.blockers.forEach( blocker => {
        if (Math.abs(mouse_x - blocker.slot.midpoint[0]) < 15 && 
            Math.abs(mouse_y - blocker.slot.midpoint[1]) < 15 && 
            blocker.color === this.player_moving){
              this.piece_to_move = blocker;
              blocker.to_move = true;
          } else {
            blocker.to_move = false;
          }
      });
    } else if (this.move_in_progress === 'blocker-place') {
      // cancel move if mouse is outside of board
      if (mouse_x < move_cancel_x_range[0] || mouse_x > move_cancel_x_range[1] ||
            mouse_y < move_cancel_y_range[0] || mouse_y > move_cancel_y_range[1]) {
              this.cancel_move();
              return;
            }
      this.board.slots.forEach( slot => {
        if (slot.contains === null) {
          if (Math.abs(mouse_x - slot.midpoint[0]) < 20 && 
              Math.abs(mouse_y - slot.midpoint[1]) < 20) {
                slot.preview_blocker.color = this.player_moving;
                preview = slot.preview_blocker;                
            }
        } 
      });
      this.move_to_finalize = preview;
    } else if (this.move_in_progress === 'opp-blocker') {
      this.game_state.blockers.forEach( blocker => {
        if (blocker.color !== this.player_moving && 
            Math.abs(mouse_x - blocker.slot.midpoint[0]) < 15 && 
            Math.abs(mouse_y - blocker.slot.midpoint[1]) < 15 ){
              //this.piece_to_move = blocker;
              this.move_to_finalize = blocker;
              blocker.to_move = true;
          } else {
            blocker.to_move = false;
          }
      });
    } else if (this.move_in_progress === 'b-arrow'||
               this.move_in_progress === 'w-arrow') {
      let arrow_color = this.move_in_progress === 'b-arrow' ? 'b' : 'w';
      this.board.slots.forEach( slot => {
              if (slot.contains === null) {
                let from_stations = Object.keys(slot.to_points)

                from_stations.forEach(to_point => {

                  if (Math.abs(mouse_x - slot.to_points[to_point][0]) < 15 && 
                    Math.abs(mouse_y - slot.to_points[to_point][1]) < 15) {
                    // . console.log(slot.preview_arrows)
                    // slot.preview_arrow.to_station = to_point;
                    // slot.preview_arrow.from_station = slot.stations[to_point];
                    // slot.preview_arrow.color = arrow_color;
                    preview = slot.preview_arrows[to_point]; 
                    preview.color = arrow_color; 

                }
            });
        } 
      });
      this.move_to_finalize = preview;
    }
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
      if (this.move_to_finalize.constructor.name === 'Arrow') {
        if (this.move_in_progress==='b-arrow'||
            this.move_in_progress==='w-arrow') {
          this.place_arrow(this.move_to_finalize);
          this.move_in_progress = false;
          this.move_to_finalize = null;
          this.next_turn();
          this.redraw();
        }
      }
      else if (this.move_to_finalize.constructor.name === 'Ring') {
        this.place_ring(null, null, null, this.move_to_finalize);
        this.move_in_progress = false;
        this.move_to_finalize = null;
        this.next_turn();
        this.redraw();
      }
      else if (this.move_to_finalize.constructor.name === 'BasePost') {
        this.move_base_post(this.move_to_finalize);
        this.move_in_progress = false;
        this.move_to_finalize = null;
        this.next_turn();
        this.redraw();
      }
      else if (this.move_to_finalize.constructor.name === 'Blocker') {
        if (this.move_in_progress==='blocker-place') {
          this.place_blocker(this.move_to_finalize);
        } else if (this.move_in_progress==='opp-blocker') {
          this.remove_blocker(this.move_to_finalize);
        }
        this.move_in_progress = false;
        this.move_to_finalize = null;
        this.piece_to_move = null;
        this.next_turn();
        this.redraw();
      }
    } else if (this.move_in_progress === 'blocker') {
      this.move_in_progress = 'blocker-place';
    }
  }

  next_turn() {
    this.turn_index = (this.turn_index + 1) % this.player_count();
  }

  is_turn() {
    return this.player_colors()[this.turn_index];
  }

  generate_path_pattern() {
    const colors = ['b', 'w'];
    let pattern = Array.from({length: 8}, () => colors[Math.round(Math.random())]);
    while (pattern.filter( (color) => color === 'b').length < 2 ||
        pattern.filter( (color) => color === 'w').length < 2) {
          // bad pattern, try again
          pattern = Array.from({length: 8}, () => colors[Math.round(Math.random())]);
        }
    return pattern;
  } 

  redraw() {
    this.app.setState({});
    this.needs_redraw = true;
  }
}

export default GameManager;