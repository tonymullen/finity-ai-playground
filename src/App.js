import { useState, useEffect, useCallback } from 'react';
import GameManager from "./services/game_manager";
import FinityCanvas from "./components/FinityCanvas";
import PlayerPanel from "./components/PlayerPanel";
import PlayerPicker from "./components/PlayerPicker";

import './App.css';

function App() {
  const gm = new GameManager();

  return (
    <div className="App">
      <div id="header">
        <div id="header-container">
        <span id="title">Finity AI Playground</span>

        <PlayerPicker gm={ gm } />

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
        <PlayerPanel player="player_1" gm={ gm } />
        <PlayerPanel player="player_3" gm={ gm } />
      </div>

      <div  id="finity">
        <FinityCanvas app={this} gm={ gm }></FinityCanvas>
      </div>

      <div id="players_2_4">
        <PlayerPanel player="player_2" gm={ gm } />
        <PlayerPanel player="player_4" gm={ gm } />
      </div>
    </div>
  </div>
  );
}

export default App;
