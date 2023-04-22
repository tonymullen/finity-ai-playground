class Move {
    constructor({
        move_type,
        piece_to_add,
        piece_to_remove
    }={}) {
        this.move_type = move_type;
        this.piece_to_add = piece_to_add;
        this.piece_to_remove = piece_to_remove;
    }
}