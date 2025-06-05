class Move {
    constructor({
        move_type,
        piece_to_add,
        piece_to_remove,
        gs_id,
    }={}) {
        this.move_type = move_type;
        this.piece_to_add = piece_to_add;
        this.piece_to_remove = piece_to_remove;
        this.gs_id = gs_id;
    }
}

export default Move;