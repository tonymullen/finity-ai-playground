import env from 'react-dotenv';

const agent = {
    "label": "ai_chatgpt",
    "description": "Chat GPT player",
    "author": "Tony Mullen",
    "move": move,
}

const game_rules = `
Finity game play basics

Setup
At the beginning of the game, a sequence of 8 black and white cone-shaped
path indicators is randomly generated. The black and white pattern of these indicators,
read from bottom to top, becomes the path pattern for the game.

Objective
The object of the game is to build a legal full path of black and white arrow-shaped
bridges from the station holding your own base post to the center station such that
the pattern of bridges crossed is exactly the same as the black and white path pattern
of the game.

The center station is the final destination of the path and cannot be passed through
on the way.

Bridges and rings
Bridges (arrow-shaped pieces) are shared resources. Bridges may be crossed multiple
times as part of a path. Stations may be passed through in a path no more times than
the number of the players rings on the station.

A player's rings can only occupy stations to which there is a legal partial path
from the player's base post.

Playing the game
Once the board has been set up and the path pattern is established, players take
turns making one move at a time. Allowable moves are as follows:

1. Place a bridge of any color in any unobstructed slot between any two stations
on the board, provided there is not already a bridge of the same color going the
same direction between the same two stations. No two bridges may ever be the same
color and direction between the same two stations.

2. Reverse any bridge anywhere on the board, provided the resulting bridge color
and direction would not be redundant between two stations as described previously.

3. Place one of the player's own colored rings on any station reachable by a legal
partial path, as long as the station is not occupied by the player's own base post.
A legal partial path means that the black and white pattern of bridges follows the
black and white path pattern from the beginning (bottom of the tower) and that the
partial path to a station contains enough rings on intermediary stations to pass
through those stations as many times as necessary to reach the station.

4. Place either of their own blockers in any open slot between any two stations

5. Remove an opponent's blocker if there are at least 20 bridges currently on the
board. Removed blockers remain out of play for the rest of the game.

6. Remove a bridge if the player occupies the highest/most central position (i.e.
smallest ring or base post) on the destination (point) station of the bridge to be
removed.

7. Relocate their base post to any station provided that the player has at least one
legal ring still on the board after the base post relocation. The base post may be
relocated to a station occupied by the player's own ring, and rings on the same station
with the base post count as legal rings.


The first move of the game must not block or obstruct any slots on an opponent's base
post station.



Orphaned rings
Rings that are not supported by a legal partial path from the player's base post are
"orphaned" and must be removed from the board. This can happen if a bridge their path
depends on is removed or reversed. Orphaning your opponent's rings is an important
offensive maneuver in the game.


No immediate undo
It is forbidden to make a move that simply undoes the previous move without any other
changes to the state of the board. For example, if a player reverses a bridge, the
immediate following move may not be to reverse the bridge back. If a player places a
bridge, the immediate following move may not be to remove the bridge. If a player
removes a bridge, the immediate following move may not be to replace that bridge with
another bridge of the same color in the same slot going in either direction.

Important tip: Bridge redundancy
Avoid having your paths rely on single bridges from one station to another, because
they can be easily reversed, undermining your path. When possible, support your path
using doubled up bridges (i.e. pairs of bridges in opposite directions between the
same two stations) so that the bridges can't be reversed by your opponent.

Special cases
These additional rules deal with situations that can occasionally arise.

Teleportation
If a player's base post is surrounded on all available sides by stations which are
all completely full (3 rings) of other players' rings, the player may "teleport" their
base post to any completely empty (no rings) station on the board (losing any rings
that may have occupied their base post station before teleporting). This is only an
option if there are completely empty stations.

Tied path completion
If a player completes both their own and an opponent's full path in one move, then
whoever's path passes through the most stations is the winner. If this is equal,
then whoever has the greatest number of rings on the board is the winner. If this
is equal the game is a draw.

Deadlock draw
If 10 full rounds of play go by without any changes to the rings on the board (no
removed or added rings) the game is a draw.
`

/**
 * Generate a move for color based on existing game state
 *
 * @param {Color} color
 * @param {GameState} game_state
 * @returns {Move}
 */
function move(color, game_state, screenshot) {
    console.log(env.API_URL);


    console.log(game_state);
    // TODO: Fully implement toJSON in GameState
    console.log(JSON.stringify(game_state));

    console.log("Screenshot data:")
    console.log(screenshot);

    // Uncomment the following lines to download the screenshot
    // const link = document.createElement('a');
    // link.download = 'screenshot.png';
    // link.href = screenshot
    // link.click();

    const move = new Promise(resolve => {

      // Tweaking the distribution of moves makes for
      // more interesting random game play, since there are
      // generally many more arrrow and blocker moves than ring
      // or base post moves available.
      let move_prefs = {
        "Arrow": 0.05,
        "Blocker": 0.1,
        "BasePost": 0.8,
        "Ring": 1.0,
      }

      // Get all possible moves
      let possible_moves = game_state.possible_moves(color);

      // We could just pick a random entry, but it would wind up
      // mostly picking arrow and blocker moves, which are more
      // common than ring and base post moves. So we'll pick a random
      // threshold and use the preferences above to pick a move that
      // meets the threshold. The while loop ensures we eventually pick
      // some move.
      let random_move = null;
      while (!random_move) {
        let random_index = Math.floor(Math.random()*possible_moves.length);
        let random_cutoff = Math.random();
        random_move = possible_moves[random_index];
        if ((random_move.piece_to_add &&
            random_cutoff > move_prefs[random_move.piece_to_add.constructor.name]) ||
            (random_move.piece_to_remove &&
            random_cutoff > move_prefs[random_move.piece_to_remove.constructor.name])) {
            random_move = null;
          }
        }

        // Resolve the promise after a short delay to simulate
        // the AI "thinking" about its move.
        setTimeout(() => {
          resolve(random_move);
        }, 100);
      });
    return move;
}

export default agent;
