import BasePost from './game_pieces/base_post';
import Ring from './game_pieces/ring';
import { game_state } from './game_state';
import Move from './move';
import { player_agent_moves } from './player_agents';

/**
 * Game manager class
 */
class GameManager {
  constructor() {
    this.game_state = game_state;
    window.localStorage.setItem("main_gs_id", this.game_state.gs_id);
    this.board = this.game_state.board;
    this.players = this.game_state.players;
    this.players_to_agents = this.get_players_to_agents();
    this.player_moving = null;
    this.move_in_progress = null;
    this.move_to_finalize = null;
    this.piece_to_move = null;
    this.play_state = 'paused';
  }

  /* 
  * Setup
  */

  /**
   * Set App attribute for game manager
   * @param {App} app 
   */
  set_app(app) {
    this.app = app;
    this.redraw();
  }

  /**
   * Check localstorage for player configuration,
   * otherwise set default 4 person
   */
  get_players() {
    let storedPlayers = window.localStorage.getItem("players");
    if (storedPlayers) {
      return JSON.parse(storedPlayers);
    } else {
      return ({
          'cyan': true,
          'yellow': true,
          'purple': true,
          'red': true
        })
    }
  }

  get_players_to_agents() {
    let storedPlayersToAgents = window.localStorage.getItem("players_to_agents");
    if (storedPlayersToAgents) {
      return JSON.parse(storedPlayersToAgents);
    } else {
      return ({
          'cyan': 'human-loc',
          'yellow': 'human-loc',
          'purple': 'human-loc',
          'red': 'human-loc'
        })
    }
  }

  /**
   * Reset the game state
   */
  reset_game_state(players) { 
    this.game_state.reset(players);
    this.player_moving = null;
    this.move_in_progress = null;
    this.move_to_finalize = null;
    this.piece_to_move = null;
    this.redraw();
  }

  /**
   * Toggle whether a particular color
   * player is playing
   * 
   * @param {String} color 
   */
  toggle_player(color) {
    this.pause();
    this.game_state.toggle_player(color);
    this.reset_game_state(this.game_state.players);
  }

  play() {
    this.play_state = 'playing';
    this.initiate_agent_move();
  }

  pause() {
    this.play_state = 'paused';
  }

  play_pause() {
    this.initiate_agent_move();
    this.play_state = 'paused';
  }

  /**
   * Set the player agent (human, AI, etc) for a color
   * @param {String} color 
   * @param {String} agent 
   */
  set_player_agent(color, agent) {
    this.players_to_agents[color] = agent;
    window.localStorage.setItem("players_to_agents", JSON.stringify(this.players_to_agents));
    if (this.play_state === 'playing') {
      this.initiate_agent_move();
    }
    this.redraw();
  }

  player_colors() {
    return this.game_state.player_colors();
  }

  // Turn management
  /**
   * Returns whether the color is playing
   * 
   * @param {String} color 
   * @returns {boolean}
   */
  color_is_playing(color) {
    return this.players[color];
  }

  initiate_agent_move() {
    this.handle_player_agent_move(
      Object.keys(this.players)[this.game_state.turn_index],
      this.players_to_agents[Object.keys(this.players)[this.game_state.turn_index]]);
  }

  /**
   * Returns current playing player
   * 
   * @returns {(String|null)}
   */
  is_turn() {
    if (this.game_state.turn_index >= 0) {
      return this.player_colors()[this.game_state.turn_index];
    } else {
      return null;
    }
  }

  /**
   * Initiate a move
   * 
   * @param {String} player 
   * @param {String} move_type 
   */
  start_move(player, move_type) {
    if (!this.game_state.play_status) {
      this.game_state.play_status = 'playing';
    }
    this.player_moving = player;
    this.move_in_progress = move_type;
    this.redraw();
  }

  /**
   * Finalize a move and go to next player
   */
  finalize_move() {
    this.move_in_progress = false;
    this.move_to_finalize = null;
    this.piece_to_move = null;
    this.redraw();
    if (this.play_state === 'playing') {
      this.initiate_agent_move();
    }
  }

  /**
   * Cancel a move
   */
  cancel_move() {
    this.player_moving = null;
    this.move_in_progress = null;
    this.move_to_finalize = null;
    this.piece_to_move.to_move = false;
    this.piece_to_move = null;
    this.redraw();
  }

  /**
   * Handle player move
   * 
   * @param {String}
   */
  async handle_player_agent_move(player_moving, player_agent) {
    if (this.game_state.play_status !== 'over') {
      let this_gs_id = this.game_state.gs_id;
      let move = await player_agent_moves[player_agent](player_moving, this.game_state);
      // move is instantiated only for non-local-human agents
      // local-human agents' moves are handled interactively
      if (move) {
        move.gs_id = this_gs_id;
        this.game_state.apply_move(move);
        this.finalize_move();
      }
    }
  }

  /**
   * Handle user click to make/finalize move
   */
  handle_move_click() {
    if (this.move_to_finalize) {
      let move_type, piece_to_add, piece_to_remove = null;
      if (this.move_to_finalize.constructor.name === 'Arrow') {
        if (this.move_in_progress==='b-arrow'||
            this.move_in_progress==='w-arrow') {
          move_type = 'place';
          piece_to_add = this.move_to_finalize;
        } else if (this.move_in_progress==='rem-arrow') {
          move_type = 'remove';
          piece_to_remove = this.move_to_finalize;
        } else if (this.move_in_progress==='rev-arrow') {
          move_type = 'replace';
          piece_to_remove = this.piece_to_move;
          piece_to_add = this.move_to_finalize;
        }
      }
      else if (this.move_to_finalize.constructor.name === 'Ring') {
        move_type = 'place';
        piece_to_add = this.move_to_finalize;
      }
      else if (this.move_to_finalize.constructor.name === 'BasePost') {
        move_type = 'replace';
        piece_to_add = this.move_to_finalize;
      }
      else if (this.move_to_finalize.constructor.name === 'Blocker') {
        if (this.move_in_progress==='blocker-place') {
          move_type = 'replace';
          piece_to_add = this.move_to_finalize;
          piece_to_remove = this.piece_to_move;
        } else if (this.move_in_progress==='opp-blocker') {
          move_type = 'remove';
          piece_to_remove = this.move_to_finalize;
        }
      }
      this.game_state.apply_move(new Move({ move_type, piece_to_add, piece_to_remove }));
      this.finalize_move();
    } else if (this.move_in_progress === 'blocker') {
      if (this.piece_to_move) {
        this.move_in_progress = 'blocker-place';
      }
    }
  }

  /**
   * Generate a current move
   * for preview
   * 
   * @param {number} mouse_x 
   * @param {number} mouse_y 
   * @returns {(Ring|BasePost|Blocker|Arrow)}
   */
  generate_move_preview(mouse_x, mouse_y) {
    const LARGE_MOUSEOVER = 30;
    const MED_MOUSEOVER = 20;
    const SMALL_MOUSEOVER = 15;
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
        if (Math.abs(mouse_x - station.x) < LARGE_MOUSEOVER && 
            Math.abs(mouse_y - station.y) < LARGE_MOUSEOVER) {
              if (stat_key !== '0,0') {
                if (this.game_state.can_place_ring(station, this.player_moving)) {
                  let size = 's';
                  if (station.rings[0]) {
                    size = 'm';
                    if (station.rings[1]) {
                      size = 'l';
                    }
                  }
                  preview =  new Ring(this.player_moving, size, station);  
              } 
            }
        }
      });
      this.move_to_finalize = preview;
    } else if (this.move_in_progress === 'base-post') {
      Object.keys(this.board.stations).forEach( stat_key => {
        let station = this.board.stations[stat_key];
        if (Math.abs(mouse_x - station.x) < LARGE_MOUSEOVER && 
            Math.abs(mouse_y - station.y) < LARGE_MOUSEOVER) {
              if (stat_key !== '0,0') {
                if (this.game_state.can_move_base_post(station, this.player_moving)) {
                  preview  = new BasePost(this.player_moving, station);
              }
            }
          }
      });
      this.move_to_finalize = preview;
    } else if (this.move_in_progress === 'blocker') {
      let mouse_off = true;
      this.game_state.blockers.forEach( blocker => {
        if (Math.abs(mouse_x - blocker.slot.midpoint[0]) < SMALL_MOUSEOVER && 
            Math.abs(mouse_y - blocker.slot.midpoint[1]) < SMALL_MOUSEOVER && 
            blocker.color === this.player_moving){
              mouse_off = false;
              this.piece_to_move = blocker;
              blocker.to_move = true;
          } else {
            blocker.to_move = false;
          }
      });
      if (mouse_off) {
        this.piece_to_move = null;
      }
    } else if (this.move_in_progress === 'blocker-place') {
      // cancel move if mouse is outside of board
      if (mouse_x < move_cancel_x_range[0] || mouse_x > move_cancel_x_range[1] ||
            mouse_y < move_cancel_y_range[0] || mouse_y > move_cancel_y_range[1]) {
              this.cancel_move();
              return;
            }
      this.board.slots.forEach( slot => {
        // For <4 player games, some slot midpoints are undefined
        if (slot.midpoint && slot.contains === null 
           && this.game_state.can_block_slot(slot, this.player_moving, 'blocker')) {
          if (Math.abs(mouse_x - slot.midpoint[0]) < MED_MOUSEOVER && 
              Math.abs(mouse_y - slot.midpoint[1]) < MED_MOUSEOVER) {
                slot.preview_blocker.color = this.player_moving;
                preview = slot.preview_blocker;                
            } 
        } 
      });
      this.move_to_finalize = preview;
    } else if (this.move_in_progress === 'opp-blocker') {
      this.game_state.blockers.forEach( blocker => {
        if (blocker.color !== this.player_moving && 
            Math.abs(mouse_x - blocker.slot.midpoint[0]) < SMALL_MOUSEOVER && 
            Math.abs(mouse_y - blocker.slot.midpoint[1]) < SMALL_MOUSEOVER ){
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
              if (slot.contains === null && !slot.blocked) {
                let from_stations = Object.keys(slot.to_points);
                from_stations.forEach(to_point => {
                  if (Math.abs(mouse_x - slot.to_points[to_point][0]) < SMALL_MOUSEOVER && 
                    Math.abs(mouse_y - slot.to_points[to_point][1]) < SMALL_MOUSEOVER) {
                      if (this.game_state.not_redundant(slot, to_point, arrow_color)
                          && this.game_state.can_block_slot(slot, this.player_moving, 'arrow')
                          && this.game_state.can_make_arrow_move_in_slot(slot, arrow_color, 'place')) {
                        preview = slot.preview_arrows[to_point]; 
                        preview.color = arrow_color;
                      }
                }
            });
        } 
      });
      this.move_to_finalize = preview;
    } else if (this.move_in_progress === 'rem-arrow') {
      this.game_state.arrows.forEach(arrow => {
        if (Math.abs(mouse_x - arrow.slot.midpoint[0]) < SMALL_MOUSEOVER && 
              Math.abs(mouse_y - arrow.slot.midpoint[1]) < SMALL_MOUSEOVER) {
                if (this.game_state.occupies_high_point(this.player_moving, arrow.to_station)
                   && this.game_state.can_make_arrow_move_in_slot(arrow.slot, arrow.color, 'remove')) {
                  preview = arrow
                }
          }
      });
      this.move_to_finalize = preview;
    } else if (this.move_in_progress === 'rev-arrow') {
      this.game_state.arrows.forEach(arrow => {
        if (Math.abs(mouse_x - arrow.slot.midpoint[0]) < SMALL_MOUSEOVER && 
              Math.abs(mouse_y - arrow.slot.midpoint[1]) < SMALL_MOUSEOVER) {
                if (this.game_state.not_redundant(arrow.slot, arrow.from_station, arrow.color)
                   && this.game_state.can_make_arrow_move_in_slot(arrow.slot, arrow.color, 'replace')) {
                  this.piece_to_move = arrow;
                  arrow.to_move = true;
                  preview = arrow.reverse();
                }
          }
      });
      this.move_to_finalize = preview;
    }
    this.redraw();
    return preview;
  }

  // Move conditions

 

  // Getters and utilities
  /**
   * Get game state
   * 
   * @returns GameState
   */
  get_game_state() {
    return this.game_state;
  }

  /**
   * Set whether game board needs redrawing
   * (avoid unnecessary draw cycles)
   * 
   * @param {bool} bool 
   */
  set_needs_redraw(bool) {
    this.needs_redraw = bool;
  }

  /**
   * Force a React redraw by setting
   * App state
   */
  redraw() {
    this.app.setState({});
    this.needs_redraw = true;
  }
}

export default GameManager;