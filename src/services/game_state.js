import Board from './board';
import Blocker from './game_pieces/blocker';
import Ring from './game_pieces/ring';
import BasePost from './game_pieces/base_post';
import Arrow from './game_pieces/arrow';
import Move from './move';
import { pathAnalyzer as pa } from './path_analyzer';


class GameState {
    constructor(
    //     {
    //     // board,
    //     path_pattern,
    //     arrows,
    //     rings,
    //     blockers,
    //     base_posts,
    //     winners,
    //     play_status
    // }={}
    ) {
        // this.players = ['cyan', 'yellow', 'purple', 'red'];
        this.players = this.get_players();
        this.board = new Board(Object.keys(this.players).length);
        this.path_pattern = this.generate_path_pattern();
        this.arrows = [];
        this.rings = this.set_up_rings();
        this.blockers = this.set_up_blockers();
        this.base_posts = this.set_up_base_posts();
        this.winners = [];
        this.play_status = null;
        
        //this.reset_board(this.players.length);
    }

    duplicate() {
        return new GameState({
            board: this.board.duplicate(),
            path_pattern: this.path_pattern,
            arrows: this.duplicate_arrows(),
            blockers: this.duplicate_blockers(),
            base_posts: this.duplicate_base_posts(),
            winners: this.duplicate_winners(),
            play_status: this.play_status,
            move_history: this.duplicate_move_history(),
        })
    }

    reset(players) {
        console.log("reset ", players)
    // this.game_state = new GameState({
    //   this.board: this.board,
        this.players = players;
        this.path_pattern = this.generate_path_pattern();
        this.arrows = [];
        this.rings = this.set_up_rings();
        this.blockers = this.set_up_blockers();
        this.base_posts = this.set_up_base_posts();
        this.winners = [];
        this.play_status = null;
        this.reset_board(this.players.length);
        console.log("reset done ")
    // }); 
    }

     /**
   * Reset the board for a particular number of players
   * @param {Number} num 
   */
    reset_board(num) {
        console.log(num);
        //if (num !== this.board.num_players) {
            this.board.setup_board(num);

        //}
    }

    // Possible moves

    /**
     * Return list of possible moves for color
     * 
     * @param {String} color 
     * @returns 
     */
    possible_moves(color) {
        return [].concat(
            this.possible_ring_moves(color),
            this.possible_base_post_moves(color),
            this.possible_blocker_moves(color),
            this.possible_blocker_remove_moves(color),
            this.possible_arrow_place_moves(color),
            this.possible_arrow_reverse_moves(color),
            this.possible_arrow_remove_moves(color),
        )
    }

    /**
     * Return a list of possible ring placement
     * moves for color
     * 
     * @param {String} color 
     * @returns {Move[]}
     */
    possible_ring_moves(color) {
        let possible_ring_moves = [];
        let reachable_stations = pa.reachable_stations(
            color,
            this.board,
            this
        );
        reachable_stations = reachable_stations.filter(
            station_id => {
                return (this.board.stations[station_id].ring_count() > 0)
            }
        );
        reachable_stations.forEach(station_id => {
            possible_ring_moves.push(
                new Move({
                    move_type: 'place',
                    piece_to_add: new Ring(
                        color,
                        this.board.stations[station_id].topmost_opening(),
                        this.board.stations[station_id]
                    )
                })
            );
        });
        return possible_ring_moves;
    }

    /**
     * Return possible base post moves for
     * 
     * @param {String} color 
     */
    possible_base_post_moves(color) {
        let possible_base_post_moves = []
        let supported_bp_stations = []
        this.board.stations.filter(
            station => station.base_post == null
        ).forEach( station => {
            let reachable_stations_after_bp_move =
                pa.reachable_stations(
                    color, this.board, this, station.number);
            if (reachable_stations_after_bp_move.length > 0) {
                supported_bp_stations.push(station);
            }
        });
        supported_bp_stations.forEach( station => {
            possible_base_post_moves.push(
                new Move({
                    move_type: 'replace',
                    piece_to_add: new BasePost(
                        color,
                        station)
                    })
                )
            });
        return possible_base_post_moves;
    }

    /**
     * Return possible blocker moves
     * 
     * @param {String} color 
     */
    possible_blocker_moves(color) {
        let possible_blocker_moves = [];
        let possible_blockers = this.blockers.filter( b => b.color === color);
        this.board.slots.filter(slot => slot.contains === null)
            .forEach(slot => {
                possible_blockers.forEach( old_blocker => 
                    {
                        possible_blocker_moves.push(
                            new Move({
                                move_type: 'replace',
                                piece_to_add: new Blocker({
                                    color,
                                    slot,
                                    is_preview: false
                                }),
                                piece_to_remove: old_blocker
                            })
                        )
                    })
            }
        )
        return possible_blocker_moves;
    }

    possible_blocker_remove_moves(color) {
        return [];
    }

    possible_arrow_place_moves(color) {
        let possible_arrow_place_moves = [];
        this.board.stations.forEach( station => { 
            station.slots.forEach( to_station => {
                station.slots[to_station].forEach( channel => {
                    if (station.slots[to_station][channel].contains === null) {
                        possible_arrow_place_moves.push(
                            new Move({
                                move_type: 'place',
                                piece_to_add: new Arrow({
                                    color,
                                    from_station: station.number,
                                    to_station,
                                    slot: station.slots[to_station][channel]
                                }),
                            })
                        )
                    }
                })
            })
        })
        return possible_arrow_place_moves;
    }

    possible_arrow_reverse_moves() {
        return [];
    }

    possible_arrow_remove_moves(color) {
        return [];
    }

    // Evaluation metrics
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

    /**
     * Number of reachable stations for a color
     * @param {String} color 
     * @returns {number}
     */
    number_of_rings(color) {

    }

    /**
     * Number of reachable stations for a color
     * @param {String} color 
     * @returns {number}
     */
    number_of_controlled_stations(color) {

    }

    /**
     * Looks at all pairs of stations controlled by
     * the color and averages the number of bridges (1, 2, or 3)
     * between the bridges
     * 
     * @param {String} color 
     */
    average_strength_of_station_pairs(color) {

    }

    /**
     * Looks at all pairs of stations controlled by
     * the color and finds the max # of bridges (1, 2, or 3)
     * between the bridges
     * 
     * @param {String} color 
     */
    max_strength_of_station_pairs(color) {

    }

    /**
     * Looks at all pairs of stations controlled by
     * the color and finds the min # of bridges (1, 2, or 3)
     * between the bridges
     * 
     * @param {String} color 
     */
    min_strength_of_station_pairs(color) {

    }

    /**
     * Returns total number of stations with at least
     * 1 ring of the color on them.
     * 
     * @param {String} color 
     */
    ring_spread(color) {

    }


    toJSON() {

    }

    /**
     * Apply a move to the current game state
     * @param {Move} param0 
     */
    apply_move({move_type, piece_to_add, piece_to_remove}) {
        if (move_type === "place") {
            if (piece_to_add.constructor.name === "Arrow") {
                this.place_arrow(piece_to_add);
            } else if (piece_to_add.constructor.name === "Ring") {
                this.place_ring(piece_to_add);
            }
        } else if (move_type === "remove") {
            if (piece_to_remove.constructor.name === "Arrow") {
                this.remove_arrow(piece_to_remove);
            } else if (piece_to_remove.constructor.name === "Blocker") {
                this.remove_blocker(piece_to_remove);
            }
        } else if (move_type === "replace") {
            if (piece_to_add.constructor.name === "Arrow") {
                this.remove_arrow(piece_to_remove);
                this.place_arrow(piece_to_add);
            } else if (piece_to_add.constructor.name === "Blocker") {
                this.remove_blocker(piece_to_remove);
                this.place_blocker(piece_to_add);
            } else if (piece_to_add.constructor.name === "BasePost") {
                // We remove the object from one station and
                // place the same object on another station
                this.remove_base_post(piece_to_add);
                this.place_base_post(piece_to_add);
            }
        }
    }

    /**
     * Place an arrow on the board
     * 
     * @param {Arrow} arrow 
     */
    place_arrow(arrow){
        let placed_arrow = 
        new Arrow({
            color: arrow.color, 
            from_station: arrow.from_station,
            to_station: arrow.to_station, 
            slot: arrow.slot, 
            is_preview: false});
        arrow.slot.add_arrow(placed_arrow, this.board);
        this.arrows.push(arrow);
    }

    /**
     * Remove an arrow from the board
     * 
     * @param {Arrow} arrow 
     */
    remove_arrow(arrow) {
        arrow.slot.remove_arrow(this.board);
        this.arrows = this.arrows.filter( 
            a => a !== arrow 
        );
        this.reevaluate_ring_support();
    }

    /**
    * Place a base post on a station
    * 
    * @param {BasePost} base_post
    */
    place_base_post(base_post) {
        base_post.station.base_post = base_post;
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
        new Blocker({
            color: blocker.color, 
            // null, 
            // null, 
            // null, 
            slot: blocker.slot, 
            is_previw: false
        });
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
        let reachable_stations = pa.reachable_stations(
        color, this.board, this);
        let rings = this.rings.filter(ring => ring.color === color);
        rings.forEach(ring => {
        if (!reachable_stations.has(ring.station.number) && 
            ring.station.number !== '0,0') {
            this.remove_ring(ring);
        }
        })
    }

    /**
     * Generate random path pattern
     * @returns {String[]}
     */
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

    /**
     * Set up rings on center station for initial players
     * @returns {Ring[]}
     */
    set_up_rings() {
        let rings = [];
        let center_station = this.board.stations['0,0'];
        this.player_colors().reverse().forEach( (color) => {
            let ring = new Ring(color, 'l', center_station)
            rings.push(ring);
            center_station.rings.push(ring);
        });
        return rings;
    }

    /**
     * Set up blockers for players
     * @returns {Blocker[]}
     */
    set_up_blockers() {
        let blockers= [];
        this.player_colors().forEach( (color, ind) => {
        blockers.push(new Blocker({
            color, 
            from_station: this.board.stations[
                this.board.start_stations[ind]],
            to_station: this.board.stations['0,0'],
            slot_loc: 'l'
        }));
        blockers.push(new Blocker({
            color,
            from_station: this.board.stations[
            this.board.start_stations[ind]],
            to_station: this.board.stations['0,0'],
            slot_loc: 'r'
        }));
        });
        return blockers;
    }

    /**
     * Set up base posts for players
     * @returns {BasePost[]}
     */
    set_up_base_posts() {
        let base_posts = [];
        this.player_colors().forEach( (color, ind) => {
            let bp = new BasePost(color, this.board.stations[
                this.board.start_stations[ind]
            ])
            base_posts.push(bp);
            this.board.stations[
                this.board.start_stations[ind]
            ].base_post = bp;
        });
        return base_posts;
    }

    /**
     * Return list of player colors
     * @returns {String[]}
     */
    player_colors() {
        return (Object.keys(this.players));
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

}

const game_state = new GameState()

export { game_state };