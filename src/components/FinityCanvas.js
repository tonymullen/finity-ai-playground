import React from "react";
import Sketch from "react-p5";

import GameManager from '../services/game_manager';

const PIXEL_WIDTH = 950
const PIXEL_HEIGHT = 650
const BG_COLOR = [.4, .6, .5]
const field = [PIXEL_WIDTH, PIXEL_HEIGHT]

let imgs = {};

const finityCanvas = (props) => {
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

  let gm;
  const setup = (p5, canvasParentRef) => {
    if (!window.p5setup) {
      window.p5setup = true;
      // use parent to render the canvas in this ref
      // (without that p5 will render the canvas outside of your component)
      p5.createCanvas(...field).parent(canvasParentRef);
      p5.colorMode(p5.RGB, 1);
      p5.background(...BG_COLOR);
      p5.imageMode(p5.CENTER);

      gm = new GameManager(p5, imgs);
    }
  };

  const draw = (p5) => {
    gm.board.draw_board();
    gm.place_ring('purple', "m", "1,1");
    gm.place_arrow('b', "-1,0", "-1,1", "l")
  };

  return <Sketch setup={setup} draw={draw} preload={preload}/>;
};

export default finityCanvas;