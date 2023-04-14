import Form from 'react-bootstrap/Form';
import HumanControlPanel from './HumanControlPanel';

const PlayerPanel = ({ player, gm }) => {
  return (
    <div  id={ "player_"+player } className="player-panel" to-play="false">
      <Form.Select 
        aria-label="select player agent"
        onChange={(e)=>{
          gm.set_player_agent(player, e.target.value);
        }}>
        <option value="human-loc">Local Human</option>
        <option value="human-rem">Remote Human</option>
        <option value="ai-easy">Easy AI</option>
        <option value="ai-hard">Hard AI</option>
        <option value="ai-custom">Custom AI</option>
      </Form.Select>
      { gm.player_agents[player] === 'human-loc' && (
        <HumanControlPanel player={ player } gm = { gm } />
      ) }
      {
        (gm.is_turn() === player) ?
        (<div className="no-play-panel to-play-panel"></div>)
        :
        (<div className="no-play-panel"></div>)
      }
    </div>

  )
}

export default PlayerPanel;
