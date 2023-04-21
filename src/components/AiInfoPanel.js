
const AiInfoPanel = ({ player, gm }) => {
  return (
    <div id={ player } className="ai-info">
      {
        ( gm.is_turn() === player ) && (
        <div className="moveInstruction">
          { player } AI is thinking about its move...
        </div>)
      }
    </div>

  )
}

export default AiInfoPanel;
