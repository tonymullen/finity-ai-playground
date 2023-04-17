import Form from 'react-bootstrap/Form';

const HumanControlPanel = ({ player, gm }) => {
  let move_in_progress_value = gm.move_in_progress==="blocker-place" ? "blocker" : gm.move_in_progress;
  return (
    <div id={ player } className="player-controls">
      <Form.Select 
        value={ player===gm.player_moving ? move_in_progress_value : "select" }
        aria-label="select player agent"
        onChange={(e)=>{
          // gm.set_player_agent(player, e.target.value);
          gm.start_move(player, e.target.value)
          gm.redraw();
        }}>
        <option value="select">Select Move</option>
        <option value="b-arrow">Place Black Arrow</option>
        <option value="w-arrow">Place White Arrow</option>
        <option value="ring">Place Ring</option>
        <option value="base-post">Move Base Post</option>
        <option value="blocker">Move Blocker</option>
        <option value="rev-arrow">Reverse Arrow</option>
        <option value="rem-arrow">Remove Arrow</option>
        <option value="opp-blocker" disabled >Remove Opponent's Blocker</option>
        <option value="concede">Concede the Game</option>
      </Form.Select>
      {
        (gm.player_moving === player && 
         gm.move_in_progress === "opp-blocker") && (
        <div className="moveInstruction">
          Choose an opponent's blocker to remove from the board
        </div>)
      }
      {
        (gm.player_moving === player && 
         gm.move_in_progress === "blocker") && (
        <div className="moveInstruction">
          Choose one of your blockers to move
        </div>)
      }
      {
        (gm.player_moving === player && 
         gm.move_in_progress === "blocker-place") && (
        <div className="moveInstruction">
          Choose a slot to place your blocker in
        </div>)
      }
      {
        (gm.player_moving === player && 
         gm.move_in_progress === "ring") && (
        <div className="moveInstruction">
          Click on a station to place a ring
        </div>)
      }
      {
        (gm.player_moving === player && 
         gm.move_in_progress === "base-post") && (
        <div className="moveInstruction">
          Click on a station to move the base post to
        </div>)
      }
    </div>

  )
}

export default HumanControlPanel;
