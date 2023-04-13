import React from "react";
import Sketch from "react-p5";

import DisplayHandler from "../services/display_handler";

const PIXEL_WIDTH = 950
const PIXEL_HEIGHT = 650
const BG_COLOR = [.4, .6, .5]
const field = [PIXEL_WIDTH, PIXEL_HEIGHT]

let imgs = {};
let display_handler;
let game_state;
let move_preview = null;
let gm;


const finityCanvas = ({ app }) => {
  gm = app.gm;
  const preload = (p5) => {
    p5.loadImage('img/center_station.png',
      (img) => {
        imgs.cs = img;
      });
    p5.loadImage('img/station.png',
      (img) => {
        imgs.st = img;
      });
    p5.loadImage('img/base_posts.png',
      (img) => {
        imgs.bp = img;
      });
    p5.loadImage('img/blockers.png',
      (img) => {
        imgs.bl = img;
      });
    p5.loadImage('img/indicator_black_side.png',
      (img) => {
        imgs.ind_side_b = img;
      });
    p5.loadImage('img/indicator_white_side.png',
      (img) => {
        imgs.ind_side_w = img;
      });
    p5.loadImage('img/indicator_black_top.png',
      (img) => {
        imgs.ind_top_b = img;
      });
    p5.loadImage('img/indicator_white_top.png',
      (img) => {
        imgs.ind_top_w = img;
      });
    p5.loadImage('img/rings_small.png',
      (img) => {
        imgs.rings_s = img;
      });
    p5.loadImage('img/rings_medium.png',
      (img) => {
        imgs.rings_m = img;
      });
    p5.loadImage('img/rings_large.png',
      (img) => {
        imgs.rings_l = img;
      });
    p5.loadImage('img/arrow_black.png',
      (img) => {
        imgs.ab = img;
      });
    p5.loadImage('img/arrow_white.png',
    img => {
      imgs.aw = img;
    });
  }

  const setup = (p5, canvasParentRef) => {
    if (!window.p5setup) {
      window.p5setup = true;
      // use parent to render the canvas in this ref
      // (without that p5 will render the canvas outside of your component)
      p5.createCanvas(...field).parent(canvasParentRef);
      p5.colorMode(p5.RGB, 1);
      p5.background(...BG_COLOR);
      p5.imageMode(p5.CENTER);

      gm.set_app(app);
      display_handler = new DisplayHandler(p5, imgs, BG_COLOR);

      gm.place_ring('purple', "s", "1,1");
      gm.place_ring('red', "s", "-1,1");
      gm.place_ring('red', "m", "-1,1");
      gm.place_arrow('b', "-1,0", "-1,1", "l");
      gm.place_arrow('b', "-1,1", "0,1", "m");
      gm.place_arrow('w', "1,1", "1,0", "r");
      gm.place_blocker('red', "0,-1", "0,0", "l");
    }
  };

  const draw = (p5) => {
    if (gm.needs_redraw) {
      gm.set_needs_redraw(false);
      game_state = gm.get_game_state();
      display_handler.display(game_state, move_preview);
    }
  }

  const mouseMoved = (p5) => {
      move_preview = gm.generate_move_preview(p5.mouseX, p5.mouseY);
      gm.needs_redraw = true;
  };

  return <Sketch setup={setup} draw={draw} mouseMoved={mouseMoved} preload={preload}/>;
};

export default finityCanvas;