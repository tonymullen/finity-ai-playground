import FinityCanvas from "./components/FinityCanvas";
import './App.css';

function App() {
  return (
    <div className="App">
      <div id="header">
        <div id="header-container">
        <span id="title">Finity AI Playground</span>

        <div id="player-choice">
          <div id="p1" className="p-choice"></div>
          <div id="p2" className="p-choice"></div>
          <div id="p3" className="p-choice"></div>
          <div id="p4" className="p-choice"></div>
        </div>

        <div id="controls">
          <div id="play-btn" className="c-btns">
            <img src={require("./img/noun-play-outline.png")} height="35" alt="play button"></img>
          </div>
          <div id="pause-btn" className="c-btns">
            <img src={require("./img/noun-pause-outline.png")} height="35" alt="pause button"></img>
          </div>
          <div id="step-fwd-btn" className="c-btns">
            <img src={require("./img/noun-step-fwd-outline.png")} height="35" alt="step button"></img>
          </div>
          <div id="step-back-btn" className="c-btns">
            <img src={require("./img/noun-step-bwd-outline.png")} height="35" alt="step back button"></img>
          </div>
          <div id="fast-fwd-btn" className="c-btns">
            <img src={require("./img/noun-ff-outline.png")} height="35" alt="fast forward button"></img>
          </div>
        </div>
      </div>
    </div>
    <div id="game_container">
      <div id="players_1_3">
        <div id="player_1" className="player" ></div>
        <div id="player_3" className="player" ></div>
      </div>

      <FinityCanvas id="finity"></FinityCanvas>

      <div id="players_2_4">
        <div id="player_2" className="player" ></div>
        <div id="player_4" className="player" ></div>
      </div>
    </div>
  </div>
  );
}

export default App;
