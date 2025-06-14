import React from "react";
import Sketch from "react-p5";

import DisplayHandler from "../services/display_handler";

const PIXEL_WIDTH = 950;
const PIXEL_HEIGHT = 650;
const BG_COLOR = [.4, .6, .5];
const SCALE_FACTOR = 0.8;
const field = [PIXEL_WIDTH, PIXEL_HEIGHT];

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
    p5.loadImage('img/base_posts.png',
      (img) => {
        imgs.bp = img;
      });
    p5.loadImage('img/base_posts_preview.png',
      (img) => {
        imgs.bp_prev = img;
      });
    p5.loadImage('img/blockers.png',
      (img) => {
        imgs.bl = img;
      });
    p5.loadImage('img/blockers_preview.png',
      (img) => {
        imgs.bl_prev = img;
      });
    p5.loadImage('img/rings_small.png',
      (img) => {
        imgs.rings_s = img;
      });
    p5.loadImage('img/rings_small_preview.png',
      (img) => {
        imgs.rings_s_prev = img;
      });
    p5.loadImage('img/rings_medium.png',
      (img) => {
        imgs.rings_m = img;
      });
    p5.loadImage('img/rings_medium_preview.png',
      (img) => {
        imgs.rings_m_prev = img;
      });
    p5.loadImage('img/rings_large.png',
      (img) => {
        imgs.rings_l = img;
      });
    p5.loadImage('img/rings_large_preview.png',
      (img) => {
        imgs.rings_l_prev = img;
      });
    p5.loadImage('img/arrow_black.png',
      (img) => {
        imgs.ab = img;
      });
    p5.loadImage('img/arrow_black_preview.png',
      (img) => {
        imgs.ab_prev = img;
      });
    p5.loadImage('img/arrow_white.png',
      img => {
        imgs.aw = img;
      });
    p5.loadImage('img/arrow_white_preview.png',
      img => {
        imgs.aw_prev = img;
      });
  }

  const setup = (p5, canvasParentRef) => {
    if (!window.p5setup) {
      window.p5setup = true;

      const cnv = p5.createCanvas(...field).parent(canvasParentRef);
      p5.colorMode(p5.RGB, 1);
      p5.background(...BG_COLOR);
      p5.imageMode(p5.CENTER);

      gm.set_app(app);
      display_handler = new DisplayHandler(p5, imgs, BG_COLOR);

      // gm.place_arrow('b', "-1,0", "-1,1", "l");
      // gm.place_arrow('b', "-1,1", "0,1", "m");
      // gm.place_arrow('w', "1,1", "1,0", "r");

      // Define handlers on canvas rather than as props
      // defining as props yields double event firing
      cnv.mousePressed((_) => {
        gm.handle_move_click();
        move_preview = gm.generate_move_preview(p5.mouseX/SCALE_FACTOR, p5.mouseY/SCALE_FACTOR);
      });
      cnv.mouseMoved((_) => {
        move_preview = gm.generate_move_preview(p5.mouseX/SCALE_FACTOR, p5.mouseY/SCALE_FACTOR);
      });
    }
  };

  const draw = (p5) => {
    if (gm.needs_redraw) {
      gm.set_needs_redraw(false);
      game_state = gm.get_game_state();
      display_handler.display(game_state, move_preview);
    }
  }

  return <Sketch setup={setup}
                draw={draw}
                preload={preload}/>;
};

export default finityCanvas;
