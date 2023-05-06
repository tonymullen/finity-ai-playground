import Board from './board';
import Blocker from './game_pieces/blocker';
import Ring from './game_pieces/ring';
import BasePost from './game_pieces/base_post';
import Arrow from './game_pieces/arrow';
import Move from './move';
import Slots from './game_pieces/slots';
import PathAnalyzer from './path_analyzer';


class GameState {
    constructor() {
        // The gs_id attribute is an id value to identify individual objects. 
        // It is used to distinguish the main game state from virtual game states
        // created by the AI to test moves. Mainly for debugging. 
        this.gs_id = String(Math.floor(Math.random()*90000) + 10000); 
        this.slots = new Slots(this.gs_id);
        this.station_slots = this.slots.station_slots;
        this.players = this.get_players();
        this.board = new Board(this.player_count(), this.slots, this.gs_id);
        this.path_pattern = this.generate_path_pattern();
        this.arrows = [];
        this.rings = this.set_up_rings();
        this.blockers = this.set_up_blockers();
        this.base_posts = this.set_up_base_posts();
        this.winners = [];
        this.play_status = null;
        this.move_history = [];
        this.turn_index = 0;
        this.pa = new PathAnalyzer();
    }

    reset(players) {
        this.gs_id = String(Math.floor(Math.random()*90000) + 10000);
        this.players = players;
        this.slots = new Slots(this.gs_id);
        this.station_slots = this.slots.station_slots;
        this.board = new Board(this.player_count(), this.slots, this.gs_id);
        this.path_pattern = this.generate_path_pattern();
        this.arrows = [];
        this.rings = this.set_up_rings();
        this.base_posts = this.set_up_base_posts();
        this.blockers = this.set_up_blockers();
        this.winners = [];
        this.play_status = null;
        this.turn_index = 0;
    }

    duplicate() {
        let dup_gs = new GameState();
        dup_gs.path_pattern = this.path_pattern;
        dup_gs.winners = this.winners.slice();
        dup_gs.play_status = this.play_status;
        dup_gs.move_history = this.move_history.slice();

        this.arrows.forEach(
            arrow => { 
                let new_arrow = new Arrow({
                    color: arrow.color, 
                    from_station: arrow.from_station,
                    to_station: arrow.to_station,
                    slot: this.slots.slots[arrow.slot.id],
                    is_preview: false});
                dup_gs.place_arrow(new_arrow);
            });
        
        this.blockers.forEach(
            blocker => { dup_gs.place_blocker(blocker) });
        
        this.base_posts.forEach(
            base_post => {
                let dup_base_post = new BasePost(
                        base_post.color,
                        dup_gs.board.stations[
                            base_post.station.number
                        ]);
                dup_gs.place_base_post(dup_base_post)
            }
        );
        return dup_gs;
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
            this.possible_arrow_place_moves(),
            this.possible_arrow_reverse_moves(),
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
        let reachable_stations = this.pa.reachable_stations(
            color,
            this.board,
            this
        );
        
        // Reachable stations is a set. We need to convert it to an array
        // so we can filter it.
        reachable_stations = [...reachable_stations].filter(
            station_id => {
                return (this.board.stations[station_id].ring_count() < 3 &&
                        (this.board.stations[station_id].base_post == null ||
                         this.board.stations[station_id].base_post.color !== color))
            }
        );

        reachable_stations.forEach(station_id => {
            possible_ring_moves.push(
                new Move({
                    move_type: 'place',
                    piece_to_add: new Ring(
                        color,
                        this.board.stations[station_id].topmost_opening(),
                        this.board.stations[station_id],
                    ),
                    piece_to_remove: null,
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
  
        let supported_bp_stations = Object.keys(this.board.stations).filter(
            station_id => this.can_move_base_post(this.board.stations[station_id], color)
        )

        supported_bp_stations.forEach( station_id => {
            possible_base_post_moves.push(
                new Move({
                    move_type: 'replace',
                    piece_to_add: new BasePost(
                        color,
                        this.board.stations[station_id]),
                    piece_to_remove: null
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
        this.board.slots.filter(slot => slot.contains === null 
                                        && this.stations_are_valid(Object.keys(slot.stations))
                                        && this.can_block_slot(slot, color, 'blocker'))
            .forEach(slot => {
                possible_blockers.forEach( old_blocker => 
                    {   
                        possible_blocker_moves.push(
                            new Move({
                                move_type: 'replace',
                                piece_to_add: new Blocker({
                                    color,
                                    slot,
                                    station_slots: this.station_slots,
                                    is_preview: true
                                }),
                                piece_to_remove: old_blocker
                            })
                        )
                    })
            }
        )
        return possible_blocker_moves;
    }

    stations_are_valid(list_of_stations) {
        let valid = true;
        list_of_stations.forEach( station_id => {
            if (!Object.keys(this.board.stations).includes(station_id)) {
                valid = false;
            }
        });
        return valid;
    }

    possible_blocker_remove_moves(color) {
        let possible_blocker_remove_moves = [];
        if (this.arrows.length > 20) {
            this.blockers.filter( b => b.color !== color).forEach( blocker => {
                possible_blocker_remove_moves.push(
                    new Move({
                        move_type: 'remove',
                        piece_to_remove: blocker,
                        piece_to_add: null,
                    })
                )
            })
        }
        return possible_blocker_remove_moves;
    }

    possible_arrow_place_moves() {
        let possible_arrow_place_moves = [];
        Object.keys(this.board.stations).forEach( station_id => { 
            Object.keys(this.board.stations[station_id].slots).forEach( to_station => {
                if (Object.keys(this.board.stations).includes(to_station)) {
                    Object.keys(this.board.stations[station_id].slots[to_station]).forEach( channel => {
                        if (this.board.stations[station_id].slots[to_station][channel].contains === null
                            && this.board.stations[station_id].slots[to_station][channel].blocked === false
                            && this.can_block_slot(
                                this.board.stations[station_id].slots[to_station][channel],
                                Object.keys(this.get_players())[this.turn_index], 
                                'arrow')) {
                            ['b','w'].forEach( arrow_color => {
                                if (this.not_redundant(
                                    this.board.stations[station_id].slots[to_station][channel], 
                                    to_station, arrow_color)
                                    // TODO:
                                    // Add constraint on undoing last move
                                    && this.can_make_arrow_move_in_slot(
                                        this.board.stations[station_id].slots[to_station][channel], 
                                        arrow_color, 'place')
                                    ) {
                                    possible_arrow_place_moves.push(
                                        new Move({
                                            move_type: 'place',
                                            piece_to_add: new Arrow({
                                                color: arrow_color,
                                                from_station: station_id,
                                                to_station,
                                                slot: this.board.stations[station_id].slots[to_station][channel]
                                            }),
                                            piece_to_remove: null,
                                        })
                                    );
                                }
                            });
                        }
                    });
                }
            })
        })
        return possible_arrow_place_moves;
    }

    possible_arrow_reverse_moves() {
        let possible_arrow_reverse_moves = [];
        this.arrows.forEach( arrow => {
            if (this.not_redundant(
                    arrow.slot,
                    arrow.from_station, 
                    arrow.color)
                && this.can_make_arrow_move_in_slot(
                    arrow.slot, 
                    arrow.color, 
                    'replace')) {
                possible_arrow_reverse_moves.push(
                    new Move({
                        move_type: 'replace',
                        piece_to_add: new Arrow({
                            color: arrow.color,
                            from_station: arrow.to_station,
                            to_station: arrow.from_station,
                            slot: arrow.slot
                        }),
                        piece_to_remove: arrow
                    })
                )
            }
        })
        return possible_arrow_reverse_moves;
    }

    possible_arrow_remove_moves(color) {
        let possible_arrow_remove_moves = [];
        Object.keys(this.board.stations).forEach( station_id => {
            if (this.occupies_high_point(color, station_id)) {
                Object.keys(this.board.stations[station_id].slots).forEach( to_station => {
                    Object.keys(this.board.stations[station_id].slots[to_station]).forEach( channel => {
                        if (this.board.stations[station_id].slots[to_station][channel].contains !== null
                            && this.board.stations[station_id].slots[to_station][channel].contains.constructor.name === 'Arrow'
                            && this.board.stations[station_id].slots[to_station][channel].contains.to_station === station_id) {
                                possible_arrow_remove_moves.push(
                                    new Move({
                                        move_type: 'remove',
                                        piece_to_remove: this.board.stations[station_id].slots[to_station][channel].contains,
                                        piece_to_add: null,
                                    })
                                )
                        }
                    })
                })
            }
        });

        return possible_arrow_remove_moves;
    }

    /**
     * Determine whether first move restrictions apply
     * 
     * @param {Slot} slot 
     * @param {String} player 
     */
    can_block_slot(slot, player, move_type) {
        let can_place = true;
        if (this.move_history.length > 0) {
            return can_place;
        } else {
            Object.keys(this.board.stations).forEach( station_id => {
                if (this.board.stations[station_id].base_post && 
                    this.board.stations[station_id].base_post.color !== player) {
                        Object.keys(this.board.stations[station_id].slots).forEach( to_stat_id => {
                            Object.keys(this.board.stations[station_id].slots[to_stat_id]).forEach( channel => {
                                if (this.board.stations[station_id].slots[to_stat_id][channel].id === slot.id) {
                                    can_place = false;
                                }
                                if (this.board.stations[station_id].slots[to_stat_id][channel].interferes_with.includes(slot.id)
                                && move_type === 'arrow') {
                                    can_place = false;
                                }
                            })
                        });
                }
            });
        }
        return can_place;
    }

    /**
     * Determine whether arrow move is allowed based on the rule
     * that you cannot undo the last move
     * 
     * @param {Slot} slot 
     * @param {String} arrow_color 
     * @param {String} move_type 
     * @returns boolean
     */
    can_make_arrow_move_in_slot(slot, arrow_color, move_type) {
        if (this.move_history.length === 0) {
            return true;
        }
        let last_move = this.move_history[this.move_history.length-1];
        if (move_type === 'place') {
            if (last_move.move_type === 'remove'
                && last_move.piece_to_remove.constructor.name === 'Arrow'
                && last_move.piece_to_remove.color === arrow_color
                && last_move.piece_to_remove.slot.id === slot.id) {
                    return false;
                }
        }
        if (move_type === 'remove') {
            if (last_move.move_type === 'place'
            && last_move.piece_to_add.constructor.name === 'Arrow'
            && last_move.piece_to_add.color === arrow_color
            && last_move.piece_to_add.slot.id === slot.id) {
                return false;
            }
        }
        if (move_type === 'replace') {
            if (last_move.move_type === 'replace'
            && last_move.piece_to_add.constructor.name === 'Arrow'
            && last_move.piece_to_add.color === arrow_color
            && last_move.piece_to_add.slot.id === slot.id) {
                return false;
            }
        }
        return true;
    }

    // Evaluation metrics
    /**
     * Longest unsupported (bridges only) path for a color
     * @param {String} color 
     * @returns {number}
     */
    longest_bridge_path(color, game_state) {
        let paths = this.pa.raw_paths(
            color, game_state.board, game_state);
        let longest_path = [];
        paths.forEach( path => {
            if (path.length > longest_path.length) {
                longest_path = path;
            }
        });
        return longest_path.length;
    }

    /**
     * Longest supported (bridges+rings) path for a color
     * @param {String} color 
     * @returns {number}
     */
    longest_supported_path(color, game_state) {
        let paths = this.pa.legal_paths(
            color, game_state.board, game_state);
        let longest_path = [];
        paths.forEach( path => {
            if (path.length > longest_path.length) {
                longest_path = path;
            }
        });
        return longest_path.length;
    }

    /**
     * Number of reachable stations for a color
     * @param {String} color 
     * @returns {number}
     */
    number_of_reachable_stations(color, game_state) {
        let reachable_stations = this.pa.reachable_stations(
            color, game_state.board, game_state);
        return Object.keys(reachable_stations).length;
    }

    /**
     * Number of rings color
     * @param {String} color 
     * @returns {number}
     */
    number_of_rings(color, game_state) {
        return game_state.rings.filter(
            ring => ring.color === color).length;
    }

    /**
     * Number of controlled for a color
     * @param {String} color 
     * @returns {number}
     */
    number_of_controlled_stations(color, game_state) {
        return Object.keys(game_state.board.stations).filter(
            station_id => game_state.board.stations[station_id].controlled_by() === color
                ).length;
    }

    /**
     * Looks at all pairs of stations controlled by
     * the color and averages the number of bridges (1, 2, or 3)
     * between the bridges
     * 
     * @param {String} color 
     */
    average_strength_of_station_pairs(color, game_state) {
        let strength_sum = 0;
        let num_pairs = 0;;
        Object.keys(game_state.board.stations).filter(
            station => game_state.board.stations[station].controlled_by() === color
            ).forEach( station1 => { 
                Object.keys(game_state.board.stations).filter(
                    station => game_state.board.stations[station].controlled_by() === color
                ).forEach( station2 => {
                    let strength = 0;
                    this.arrows.forEach( arrow => {
                        if ((arrow.from_station === station1
                             && arrow.to_station === station2) || 
                            (arrow.from_station === station2
                             && arrow.to_station === station1))
                            {
                                strength++
                            }
                    });
                    if (strength > 0) {
                        strength_sum += strength;
                        num_pairs++;
                    }
                })
            });
        if (num_pairs === 0) {
            return 0;
        } else {
            return strength_sum / num_pairs;
        }
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
    apply_move(move) {
        if (move.gs_id !== this.gs_id) {
            return;
        }
        let {move_type, piece_to_add, piece_to_remove} = move;
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
                piece_to_remove.to_move = true;
                this.remove_blocker(piece_to_remove);
            }
        } else if (move_type === "replace") {
            if (piece_to_add.constructor.name === "Arrow") {
                this.remove_arrow(piece_to_remove);
                this.place_arrow(piece_to_add);
            } else if (piece_to_add.constructor.name === "Blocker") {
                piece_to_remove.to_move = true;
                piece_to_add.is_preview = false;
                this.remove_blocker(piece_to_remove);
                this.place_blocker(piece_to_add);
            } else if (piece_to_add.constructor.name === "BasePost") {
                // We remove the object from one station and
                // place the same object on another station
                this.remove_base_post(piece_to_add);
                this.place_base_post(piece_to_add);
            }
        }
        this.move_history.push(move);

        if (this.play_status !== "over") {
            this.next_turn();
        } 
    }

    /**
     * Check whether an arrow is redundant
     * i.e. slot has neighbor with same color arrow and same destination
     * 
     * @param {Slot} slot 
     * @param {String} to_point 
     * @param {String} color 
     * @returns {boolean}
     */
    not_redundant(slot, to_point, color) {
        let not_redundant = true;
        slot.neighbors.forEach(ind => {
        if (this.board.slots[ind].contains &&
            this.board.slots[ind].contains.to_station &&
            this.board.slots[ind].contains.to_station === to_point &&
            this.board.slots[ind].contains.color === color) {
            not_redundant = false;
            }
        });
        return not_redundant;
    }

    /**
     * Check if a player color occupies the
     * high point on an arrow destination station
     * 
     * @param {String} color 
     * @param {Arrow} arrow 
     * @returns {boolean}
     */
    occupies_high_point(color, station) {
        if (
            this.board.stations[station].base_post &&
            this.board.stations[station].base_post.color === color) {
            return true;
        } else if (
            !this.board.stations[station].base_post &&
            this.board.stations[station].rings[0] && 
            this.board.stations[station].rings[0].color === color) {
            return true
        } else if (
            !this.board.stations[station].base_post &&
            !this.board.stations[station].rings[0] &&
            this.board.stations[station].rings[1] &&
            this.board.stations[station].rings[1].color === color
        ) {
        return true
        } else if (
            !this.board.stations[station].base_post &&
            !this.board.stations[station].rings[0] &&
            !this.board.stations[station].rings[1] &&
            this.board.stations[station].rings[2] &&
            this.board.stations[station].rings[2].color === color
        ) {
            return true
        } else {
            return false
        }
    }


    /**
     * Determine whether a base post can
     * be moved to a given station
     * 
     * @param {Station} station 
     * @param {String} color 
     * @returns {boolean}
     */
    can_move_base_post(station, color) {
        return (!station.base_post &&
                station.number !== '0,0' &&
                this.new_path_has_rings(station.number, color));
    }

    /**
     * Check to see if a potential new path has rings
     * to support base post move
     * 
     * @param {String} station_ind 
     * @param {String} color 
     * @returns {boolean}
     */
    new_path_has_rings(station_ind, color) {
        let reachable_stations = this.pa.reachable_stations(
        color, this.board, this, station_ind)
        let has_remaining_rings = false;
        reachable_stations.forEach(stat_ind => {
        let stat_rings = this.board.stations[stat_ind].rings.filter(
            r => r && r.color === color
        );
        if (stat_rings.length > 0) {
            has_remaining_rings = true;
            return;
        }
        });
        return has_remaining_rings;
    }

    /**
    * Place a base post on a station
    * 
    * @param {BasePost} base_post
    */
    place_base_post(base_post) {
        this.board.stations[base_post.station.number].base_post = base_post;
        // base_post.station.base_post = base_post;
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
     * Determine whether a ring can be placed
     * on a station
     * 
     * @param {Station} station 
     * @param {String} color 
     * @returns {boolean}
     */
    can_place_ring(station, color) {
        return ((station.rings.filter(ring => ring).length < 3) && 
                (!station.base_post || station.base_post.color !== color) &&
                this.pa.reachable_stations(
                color, this.board, this
                ).has(station.number));
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
        // let main_gs_id = window.localStorage.getItem("main_gs_id");
        this.blockers = this.blockers.filter( 
            b => b.to_move === false 
        );
        this.slots.slots[blocker.slot.id].remove_blocker();

        blocker.to_move = false;
        //this.update_slot_contents();
    }

    /**
     * Remove an arrow from the board
     * 
     * @param {Arrow} arrow 
     */
    remove_arrow(arrow) {
        this.slots.slots[arrow.slot.id].remove_arrow(this.board);
        // this.arrows = this.arrows.filter( 
        //     a => a !== arrow 
        // );
        this.update_slot_contents();
        this.reevaluate_ring_support();
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
            slot: this.slots.slots[blocker.slot.id],
            station_slots: this.station_slots,
            is_preview: false
        });

        placed_blocker.slot.add_blocker(placed_blocker);
        this.update_slot_contents();
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
            slot: this.slots.slots[arrow.slot.id], 
            is_preview: false});
        placed_arrow.slot.add_arrow(placed_arrow, this.board);
        this.update_slot_contents();
    }

    /**
     * Update the arrows and blockers
     * on the board
     */
    update_slot_contents() {
        this.arrows = [];
        this.blockers = [];
        this.board.slots.forEach( slot => {
            if (slot.contains && slot.contains.constructor.name === "Arrow") {
                this.arrows.push(slot.contains);
            } else if (slot.contains && slot.contains.constructor.name === "Blocker") {
                this.blockers.push(slot.contains);
            }
        });
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
        let reachable_stations = this.pa.reachable_stations(
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
            from_station: this.board.start_stations[ind],
            to_station: '0,0',
            slot_loc: 'l',
            station_slots: this.station_slots,
        }));
        blockers.push(new Blocker({
            color,
            from_station: this.board.start_stations[ind],
            to_station: '0,0',        
            slot_loc: 'r',
            station_slots: this.station_slots,
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
        return (Object.keys(this.players).filter(p => this.players[p]));
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
            });
        }
    }

    /**
     * Toggle whether a particular color
     * player is playing
     * 
     * @param {String} color 
     */
    toggle_player(color) {
        // Ensure that there are at least 2 players
        if (!this.players[color] || this.player_count()  > 2) {
            this.players[color] = !this.players[color];
            window.localStorage.setItem("players", JSON.stringify(this.players));
            this.reset(this.players);
        }
    }

    /**
     * Return number of players
     * @returns {number}
     */
    player_count() {
        return Object.values(this.players).filter( p => p).length;
    }

    /**
     * Sets the next turn index
     */
    next_turn() {
        this.check_victory();
        if (this.play_status === 'over') {
            this.turn_index = -1;
        } else {
            this.turn_index = (this.turn_index + 1) % this.player_count();
        // Play past (ignore) winners in >2 player games
        while (this.winners.includes(Object.keys(this.players)[this.turn_index])) {
                this.turn_index = (this.turn_index + 1) % this.player_count();
            }
        }
    }

    /**
     * Check to see if the game has a winner
     */
    check_victory() {
        this.player_colors().forEach(color => {
        if (this.rings.filter(
            ring => ring.color === color
            ).length >= 7) {
            if (this.pa.has_full_path(color, this.board, this)) {
                if (!this.winners.includes(color)) {
                this.winners.push(color);
                }
            }
            }
        });
        if (this.winners.length === this.player_count()-1) {
        this.play_status = 'over';
        }
    }

}

const game_state = new GameState()

export { game_state };