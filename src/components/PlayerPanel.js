import Form from 'react-bootstrap/Form';
import HumanControlPanel from './HumanControlPanel';

const PlayerPanel = ({ player, gm }) => {
  let medal_img = null;
  if (gm.game_state.winners.length > 0 &&
      gm.game_state.winners[0] === player) {
      medal_img = require("../img/medal-gold.png");
  } else if (gm.game_state.winners.length > 1 &&
    gm.game_state.winners[1] === player){
      medal_img = require("../img/medal-silver.png");
  } else if (gm.game_state.winners.length > 2 &&
    gm.game_state.winners[2] === player){
      medal_img = require("../img/medal-bronze.png");
  }
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
      ) 
      }
      {
        (gm.is_turn() === player && 
         !(gm.game_state.winners.includes(player))) ?
        (<div className="no-play-panel to-play-panel"></div>)
        : <>
          {
            medal_img ?
            ((<div className="no-play-panel">
              <div>
              <img src={medal_img} 
                class="medal"/>
              </div></div>))
            :
            (<div className="no-play-panel"></div>)
          }
        </>
      } 
    </div>

  )
}

export default PlayerPanel;
