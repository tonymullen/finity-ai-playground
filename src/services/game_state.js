import Blocker from './game_pieces/blocker';
import Arrow from './game_pieces/arrow';
import { pathAnalyzer } from './path_analyzer';


class GameState {
    constructor({
        board,
        path_pattern,
        arrows,
        rings,
        blockers,
        base_posts,
        winners,
        play_status
    }={}) {
        this.board = board;
        this.path_pattern = path_pattern;
        this.arrows = arrows;
        this.rings = rings;
        this.blockers = blockers;
        this.base_posts = base_posts;
        this.winners = winners;
        this.play_status = play_status;
        this.move_history = [];
    }

    duplicate() {
        
    }

    apply_move(move) {
        let move_type = move.move_type;
        let piece_to_add = move.piece_to_add;
        let piece_to_remove = move.piece_to_remove;

        if (move_type === "place") {
            if (piece_to_add.constructor.name === "Arrow") {

            } else if (piece_to_add.constructor.name === "Ring") {

            }
        } else if (move_type === "remove") {
            if (piece_to_remove.constructor.name === "Arrow") {

            } else if (piece_to_remove.constructor.name === "Blocker") {

            }
            
        } else if (move_type === "replace") {
            if (piece_to_remove.constructor.name === "Arrow") {

            } else if (piece_to_remove.constructor.name === "Blocker") {

            } else if (piece_to_remove.constructor.name === "BasePost") {

            }
        }
    }

    toJSON() {

    }

  /**
   * Place an arrow on the board
   * 
   * @param {Arrow} arrow 
   */
    place_arrow(arrow){
        let placed_arrow = 
        new Arrow(arrow.color, 
                    arrow.from_station,
                    arrow.to_station, 
                    arrow.slot, false);
        arrow.slot.add_arrow(placed_arrow, this.board);
        this.arrows.push(arrow);
    }

    /**
     * Remove an arrow from the board
     * 
     * @param {Arrow} arrow 
     */
    remove_arrow(arrow) {
        console.log(arrow);
        arrow.slot.remove_arrow(this.board);
        this.arrows = this.arrows.filter( 
            a => a !== arrow 
        );
    }

    /**
    * Place a base post on a station
    * 
    * @param {BasePost} base_post
    */
    place_base_post(base_post) {
        base_post.station.base_post = base_post;
        // this.game_state.base_posts.forEach( bp => {
        //   if (bp.color === base_post.color) {
        //     bp.station.base_post = null;
        //     base_post.station.base_post = base_post;
        //     bp.station = base_post.station;
        //     this.reevaluate_ring_support();
        //   }
        // });
      }

    /**
    * Remove a base post from a station
    * 
    * @param {BasePost} base_post
    */
    remove_base_post(base_post) {
        this.base_posts.forEach( bp => {
          if (bp.color === base_post.color) {
            bp.station.base_post = null;
            bp.station = base_post.station;
          }
        });
      }

    /**
    * Place a ring on a station
    * 
    * @param {Ring} ring 
    */
    place_ring(ring) {
        let station_id = ring.station.number;
        this.rings.push(ring);
        if (ring.size === 's') {
        this.board.stations[station_id].rings[0] = ring;
        } else if (ring.size === 'm') {
        this.board.stations[station_id].rings[1] = ring;
        } else if (ring.size === 'l') {
        this.board.stations[station_id].rings[2] = ring;
        }
    }

    /**
    * Remove a ring from the board
    * 
    * @param {Ring} ring 
    */
    remove_ring(ring) {
    let station_id = ring.station.number;
    this.rings = this.rings.filter(r => r !== ring);
    this.board.stations[station_id].rings = this.board.stations[station_id].rings.map(
        r => {
                if(r === ring) {
                return null;
                } else {
                return r;
                }
            }
        );
    }

    /**
     * Remove a blocker from the board
     * 
     * @param {Blocker} blocker 
     */
    remove_blocker(blocker) {
        blocker.slot.contains = null;
        this.blockers = this.blockers.filter( 
            b => b.to_move === false 
        );
        blocker.to_move = false;
    }

    /**
     * Place a blocker on the board
     * 
     * @param {Blocker} blocker 
     */
    place_blocker(blocker){
        let placed_blocker = 
        new Blocker(blocker.color, null, null, null, blocker.slot, false);
        blocker.slot.add_blocker(placed_blocker);
        this.blockers.push(placed_blocker);
    }

    /**
     * Check all players' paths for
     * orphans
     */
    reevaluate_ring_support() {
        this.base_posts.forEach(bp => {
        this.clear_orphans(bp.color);
        })
    }

    /**
     * Clear single player (color)'s 
     * orphan rings
     * 
     * @param {String} color 
     */
    clear_orphans(color) {
        let reachable_stations = pathAnalyzer.reachable_stations(
        color, this.board, this);
        let rings = this.rings.filter(ring => ring.color === color);
        rings.forEach(ring => {
        if (!reachable_stations.has(ring.station.number) && 
            ring.station.number !== '0,0') {
            this.remove_ring(ring);
        }
        })
    }

    // Some metrics
    /**
     * Longest unsupported (bridges only) path for a color
     * @param {String} color 
     * @returns {number}
     */
    longest_bridge_path(color) {

    }

    /**
     * Longest supported (bridges+rings) path for a color
     * @param {String} color 
     * @returns {number}
     */
    longest_supported_path(color) {

    }

    /**
     * Number of reachable stations for a color
     * @param {String} color 
     * @returns {number}
     */
    number_of_reachable_stations(color) {

    }
    
}

export default GameState;