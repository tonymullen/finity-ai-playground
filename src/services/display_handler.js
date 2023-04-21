
class DisplayHandler {
    constructor(p5, imgs, BG_COLOR) {
      this.p5 = p5;
      this.imgs = imgs;
      this.BG_COLOR = BG_COLOR;

      this.color_crops = {
        'red': [0, 0, 300, 300],
        'cyan': [300, 300, 300, 300],
        'purple': [0, 300, 300, 300],
        'yellow': [300, 0, 300, 300],
      }

      this.rotations = {
        'up': 0,
        'up_right': 1.1,
        'up_left': -1.1,
        'down_right': Math.PI - 1.1,
        'down_left': Math.PI + 1.1,
        'down': Math.PI,
      }
    }

    display(game_state, move_in_progress) {
      this.p5.background(...this.BG_COLOR);
      this.draw_board(game_state);
      if (move_in_progress) {
        this.draw_move_preview(move_in_progress, game_state.board);
      }
    }

    draw_board(game_state) {
      let board = game_state.board;
      let path_pattern = game_state.path_pattern;

      // Draw stations
      Object.keys(board.stations).forEach( stat_key => {
        this.draw_station(board.stations[stat_key]);
      });
      
      // Visualize slot click areas
      let visualize_slots = false;
      if (visualize_slots) {
        board.slots.forEach((slot, ind) => {
          if(slot.midpoint) {
            // label with number
            this.p5.textSize(16);
            this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
            this.p5.fill(0,0,0,.4);
            this.p5.text(ind, slot.midpoint[0], slot.midpoint[1]);
          }
        });
      }

      [...path_pattern].reverse().forEach((cone, ind) => {
        this.p5.image(cone === 'b'  ? 
              this.imgs.ind_side_b  : 
              this.imgs.ind_side_w, 850, 150+(ind*50), 100, 70);  
            });

        this.p5.image(path_pattern.slice(-1)[0] === 'b'  ? 
              this.imgs.ind_top_b  : 
              this.imgs.ind_top_w, 
                board.stations['0,0'].x,
                board.stations['0,0'].y,
                100, 100);
     
  
      game_state.base_posts.forEach( bp => {
        this.draw_base_post(bp);
      });
  
      game_state.arrows.forEach(arrow => {
        this.draw_arrow(arrow, game_state.board);
      });

      game_state.blockers.forEach(blocker => {
        this.draw_blocker(blocker);
      });
  
      game_state.rings.forEach(ring => {
        this.draw_ring(ring);
      });
    }

    draw_station(station) {
      let station_img = station.center? this.imgs.cs : this.imgs.st;
      this.p5.image(station_img, station.x, station.y, ...station.size);

      // label with number
      this.p5.textSize(28);
      this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
      this.p5.fill(0,0,0,.4);
      this.p5.text(station.number, station.x, station.y-50);
    }

    draw_ring(ring) {
      this.p5.image(
        this.imgs['rings_'+ring.size],
        ring.station.x,
        ring.station.y,
        100,
        100,
        ...this.color_crops[ring.color])
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

    draw_arrow(arrow, board) {
      let arrow_img = arrow.color === 'b' ? this.imgs.ab : this.imgs.aw;
      arrow_img.resize(90, 90);

      let rise = board.stations[arrow.to_station].y - board.stations[arrow.from_station].y;
      let run = board.stations[arrow.to_station].x - board.stations[arrow.from_station].x;
    
      let angle = this.rotations[this.angle_label(rise, run)];

      this.p5.translate(arrow.slot.midpoint[0], arrow.slot.midpoint[1]);
      this.p5.rotate(angle);

      this.p5.image(arrow_img, 0, 0);

      this.p5.rotate(-angle);
      this.p5.translate(-arrow.slot.midpoint[0], -arrow.slot.midpoint[1]);
    }

    draw_blocker(blocker) {
      let blocker_img;
      if (blocker.to_move) {
        blocker_img = this.imgs.bl_prev;
      } else {
        blocker_img = this.imgs.bl;
      };
      let rise = blocker.slot.rise;
      let run = blocker.slot.run;
  
      let angle = this.rotations[this.angle_label(rise, run)];
 
      this.p5.translate(blocker.slot.midpoint[0], blocker.slot.midpoint[1]);
      this.p5.rotate(angle);

      this.p5.image(blocker_img, 0, 0,
        100,
        100,
        ...this.color_crops[blocker.color]);
            
      this.p5.rotate(-angle);
      this.p5.translate(-blocker.slot.midpoint[0], -blocker.slot.midpoint[1]);
    }

    draw_move_preview(move, board) {
      if (move.constructor.name === 'Ring'){
        let ring = move;
        this.p5.image(
          this.imgs['rings_'+ring.size+'_prev'],
          ring.station.x,
          ring.station.y,
          100,
          100,
          ...this.color_crops[ring.color]);
      } else if (move.constructor.name === 'BasePost') {
        let base_post = move;
        this.p5.image(
          this.imgs['bp_prev'],
          base_post.station.x,
          base_post.station.y,
          100,
          100,
          ...this.color_crops[base_post.color])
      } else if (move.constructor.name === 'Blocker') {
        let blocker = move;
        let blocker_img = this.imgs.bl_prev;
        let rise = blocker.slot.rise;
        let run = blocker.slot.run;
    
        let angle = this.rotations[this.angle_label(rise, run)];

        this.p5.translate(blocker.slot.midpoint[0], blocker.slot.midpoint[1]);
        this.p5.rotate(angle);
        
        this.p5.image(blocker_img, 0, 0,
          100,
          100,
          ...this.color_crops[blocker.color]);
              
        this.p5.rotate(-angle);
        this.p5.translate(-blocker.slot.midpoint[0], -blocker.slot.midpoint[1]);

      } else if (move.constructor.name === 'Arrow') {
        let arrow = move;
        let arrow_img = arrow.color === 'b' ? this.imgs.ab_prev : this.imgs.aw_prev;
        arrow_img.resize(90, 90);

        let rise = board.stations[arrow.to_station].y - board.stations[arrow.from_station].y;
        let run = board.stations[arrow.to_station].x - board.stations[arrow.from_station].x;
      
        let angle = this.rotations[this.angle_label(rise, run)];
  
        this.p5.translate(arrow.slot.midpoint[0], arrow.slot.midpoint[1]);
        this.p5.rotate(angle);

        this.p5.image(arrow_img, 0, 0);

        this.p5.rotate(-angle);
        this.p5.translate(-arrow.slot.midpoint[0], -arrow.slot.midpoint[1]);
      }
    }

    angle_label(rise, run) {
      let angle_label = "";
      if (rise > 0) {
        if (run > 0) {
          angle_label = "down_right";
        } else if (run < 0) {
          angle_label = "down_left";
        } else {
          angle_label = "down";
        }
      } else if (rise < 0) {
        if (run > 0) {
          angle_label = "up_right";
        } else if (run < 0) {
          angle_label = "up_left";
        } else {
          angle_label = "up";
        }
      } else {
        if (run > 0) {
          angle_label = "right";
        } else if (run < 0) {
          angle_label = "left";
        }
      }
      return angle_label;
    }
}



export default DisplayHandler;