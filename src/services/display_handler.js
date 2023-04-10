class DisplayHandler {
    constructor(p5, imgs) {
      this.p5 = p5;
      this.imgs = imgs;

      this.color_crops = {
        'red': [0, 0, 300, 300],
        'cyan': [300, 300, 300, 300],
        'purple': [0, 300, 300, 300],
        'yellow': [300, 0, 300, 300],
      }
    }

    display(game_state) {
      this.draw_board(game_state);
    }

    draw_board(game_state) {
      let board = game_state.board;
      let path_pattern = game_state.path_pattern;
      Object.keys(board.stations).forEach( stat_key => {
        this.draw_station(board.stations[stat_key]);
      });
  
      [...path_pattern].reverse().forEach((cone, ind) => {
        this.p5.image(cone === 'b'  ? 
              this.imgs.ind_side_b  : 
              this.imgs.ind_side_w, 850, 150+(ind*50), 100, 70)
      })
  
      game_state.base_posts.forEach( bp => {
        this.draw_base_post(bp);
      });
  
      game_state.arrows.forEach(arrow => {
        this.draw_arrow(arrow);
      })
  
      game_state.rings.forEach(ring => {
        this.draw_ring(ring);
      })
    }

    draw_station(station) {
      let station_img = station.center? this.imgs.cs : this.imgs.st;
      this.p5.image(station_img, station.x, station.y, ...station.size);

      // label with number
      this.p5.textSize(28);
      this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
      this.p5.fill(0,0,0,.4);
      this.p5.text(this.number, this.x, this.y-50);
    }

    draw_ring(ring) {
      this.p5.image(
        this.imgs['rings_'+ring.size],
        ring.station.x,
        ring.station.y,
        100,
        100,
        ...this.olor_crops[ring.color])
    }

    draw_base_post(base_post) {
      this.p5.image(
        this.imgs['bp'],
        base_post.station.x,
        base_post.station.y,
        100,
        100,
        ...this.color_crops[base_post.color]) 
    }

    draw_arrow(arrow) {
      let arrow_img = arrow.color === 'b' ? this.imgs.ab : this.imgs.aw;
      arrow_img.resize(90, 90);
      let xpos = (arrow.from_station.x + arrow.to_station.x)/2;
      let ypos = (arrow.from_station.y + arrow.to_station.y)/2;
      let rise = arrow.from_station.y - arrow.to_station.y;
      let run = arrow.from_station.x - arrow.to_station.x;
  
      let angle = 1.1;
  
      this.p5.translate(xpos, ypos)
      this.p5.rotate(angle)
      this.p5.image(this.img, 0, 0)
      this.p5.rotate(-angle)
      this.p5.translate(-xpos, -ypos)
    }
}



export default DisplayHandler;