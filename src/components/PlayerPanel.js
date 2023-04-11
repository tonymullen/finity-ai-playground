import Dropdown from 'react-bootstrap/Dropdown';

const PlayerPanel = ({ player, gm }) => {
  return (
    <div  id={ player } className="player-panel">
      <Dropdown>
        <Dropdown.Toggle variant="dark" id="dropdown-basic">
          Player Agent
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Human</Dropdown.Item>
          <Dropdown.Item href="#/action-2">AI 1</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default PlayerPanel;
