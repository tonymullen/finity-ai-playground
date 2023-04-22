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

    apply_move() {

    }

    toJSON() {

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