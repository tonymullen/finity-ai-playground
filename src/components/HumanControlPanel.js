import Form from 'react-bootstrap/Form';

const HumanControlPanel = ({ player, gm }) => {
  return (
    <div id={ player } className="player-controls">
      <Form.Select 
        value={ player===gm.player_moving ? gm.move_in_progress: "select" }
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
        <option value="opp-blocker">Remove Opponent's Blocker</option>
        <option value="concede">Concede the Game</option>
      </Form.Select>
      {
        (gm.player_moving === player && 
         gm.move_in_progress === "ring") && (
        <div className="moveInstruction">
          Click on a station to place a ring
        </div>)
      }
    </div>

  )
}

export default HumanControlPanel;
