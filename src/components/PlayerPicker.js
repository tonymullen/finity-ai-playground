import PlayerPickButton from './PlayerPickButton.js';

const PlayerPicker = ({ gm }) => {
    return (
        <div id="player-choice">
            <PlayerPickButton color="cyan" gm={ gm } />
            <PlayerPickButton color="yellow" gm={ gm } />
            <PlayerPickButton color="purple" gm={ gm } />
            <PlayerPickButton color="red" gm={ gm } />

        </div>
    )
  }

  export default PlayerPicker;