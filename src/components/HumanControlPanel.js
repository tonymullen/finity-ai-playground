import { useState } from 'react';
import Form from 'react-bootstrap/Form';

const HumanControlPanel = ({ player, gm }) => {
  const [move, setMove] = useState(null);

  return (
    <div id={ player } className="player-controls">
      <Form.Select 
        aria-label="select player agent"
        onChange={(e)=>{
          // gm.set_player_agent(player, e.target.value);
        }}>
        <option>Select Move</option>
        <option value="b-arrow">Place Black Arrow</option>
        <option value="w-arrow">Place White Arrow</option>
        <option value="ring">Place Ring</option>
        <option value="base-post">Move Base Post</option>
        <option value="blocker">Move Blocker</option>
        <option value="rev-arrow">Reverse Arrow</option>
        <option value="rem-arrow">Remove Arrow</option>
        <option value="opp-blocker">Remove Opponent's Blocker</option>
      </Form.Select>
    </div>

  )
}

export default HumanControlPanel;
