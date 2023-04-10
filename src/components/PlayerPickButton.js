const PlayerPickButton = ({ color, gm }) => {
    let active = gm.color_is_playing(color);
    return (
        <div
            id={"p-"+color}
            className={"p-choice " + (active ? 'p-active' : 'p-inactive')}
            onClick={() => {
                gm.toggle_player(color);
            }}>
        </div>
    )
  }
  
  export default PlayerPickButton;