import Form from 'react-bootstrap/Form';

const PlayerPanel = ({ player, gm }) => {
  return (
    <div  id={ player } className="player-panel">
      <Form.Select aria-label="select player agent">
        <option>Player Agent</option>
        <option value="human">Human</option>
        <option value="ai1">AI 1</option>
        <option value="ai2">AI 2</option>
      </Form.Select>
    </div>
  )
}

export default PlayerPanel;
