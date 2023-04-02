const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

PIXEL_WIDTH = 950
PIXEL_HEIGHT = 650
BG_COLOR = [.4, .6, .5]

field = [PIXEL_WIDTH, PIXEL_HEIGHT]

let imgs = {};
function preload() {
  imgs.cs = loadImage('img/center_station.png');
  imgs.st = loadImage('img/station.png');
  imgs.bp = loadImage('img/base_posts.png');
  imgs.ind_side_b = loadImage('img/indicator_black_side.png');
  imgs.ind_side_w = loadImage('img/indicator_white_side.png');
  imgs.ind_top_b = loadImage('img/indicator_black_top.png');
  imgs.ind_top_w = loadImage('img/indicator_white_top.png');
  imgs.rings_s = loadImage('img/rings_small.png');
  imgs.rings_m = loadImage('img/rings_medium.png');
  imgs.rings_l = loadImage('img/rings_large.png');
  imgs.ab = loadImage('img/arrow_black.png');

  imgs.aw = loadImage('img/arrow_white.png');
}

function setup() {
  createCanvas(...field)
	colorMode(RGB, 1);
  imageMode(CENTER);

  gm = new GameManager(imgs);
  background(...BG_COLOR)
}

function draw() {
  gm.board.draw_board();
  gm.place_ring('purple', "m", "1,1");
  gm.place_arrow('b', "-1,0", "-1,1", "l")
}

function keyPressed(){
  console.log("Pressed")
}

