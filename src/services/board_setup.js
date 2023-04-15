import Station from './station';

class BoardSetup {
  constructor(count) {
    const center_pos = [400, 325];
    const offset_side_near = 145;
    const offset_side_far = 290;
    const offset_vert_sm = 83;
    const offset_vert_lg = offset_vert_sm * 2;

    this.station_positions = {
      "0,0":    center_pos,
      "-1,-1":  [center_pos[0]-offset_side_far, center_pos[1]],
      "-1,0":   [center_pos[0]-offset_side_near, center_pos[1]-offset_vert_sm],
      "0,-1":   [center_pos[0]-offset_side_near, center_pos[1]+offset_vert_sm],
      "-1,1":   [center_pos[0], center_pos[1]-offset_vert_lg],
      "1,1":    [center_pos[0]+offset_side_far, center_pos[1]],
      "0,1":    [center_pos[0]+offset_side_near, center_pos[1]-offset_vert_sm],
      "1,-1":   [center_pos[0], center_pos[1]+offset_vert_lg],
      "1,0":    [center_pos[0]+offset_side_near, center_pos[1]+offset_vert_sm],
      "-2,1":   [center_pos[0]-offset_side_near, center_pos[1]-offset_vert_sm*3],
      "1,-2":   [center_pos[0]-offset_side_near, center_pos[1]+offset_vert_sm*3],
      "-1,2":   [center_pos[0]+offset_side_near, center_pos[1]-offset_vert_sm*3],
      "2,-1":   [center_pos[0]+offset_side_near, center_pos[1]+offset_vert_sm*3],
    };

    this.station_size = [200, 200];
    if (count === 2) {
      this.setup = this.twoPlayerSetup();
    } else if (count === 3) {
      this.setup = this.threePlayerSetup();
    } else if (count === 4) {
      this.setup = this.fourPlayerSetup();
    }

    this.stations = this.set_up_stations(this.station_numbers,
      this.station_positions,
      this.station_size);
    
    this.slots = this.set_up_slots(this.stations);
  }

  twoPlayerSetup() {
    this.station_numbers = [
      "-1,-1", "-1,0", "0,-1", "-1,1", "1,1", "0,1", "1,-1", "1,0"
    ]
    this.start_stations = ["-1,1", "1,-1"];
  }

  threePlayerSetup() {
    this.station_numbers = [
      "-2,1", "1,-2", "-1,0", "0,-1", "-1,1", "1,1", "0,1", "1,-1", "1,0"
    ]
    this.start_stations = ["-1,0", "0,1", "1,-1"];
  }

  fourPlayerSetup() {
    this.station_numbers = [
      "-2,1", "-1,-1", "1,-2", "-1,0", "0,-1", "-1,1",
      "1,1", "0,1", "1,-1", "1,0", "-1,2", "2,-1"
    ]
    this.start_stations = ["-1,0", "0,1", "1,0", "0,-1"];
  }

  set_up_stations(station_numbers, station_positions, size){
    let stations = {"0,0": new Station("0,0", true, station_positions["0,0"], size)};
    station_numbers.forEach(stat => {
      stations[stat] = new Station(stat, false, station_positions[stat], size)
    });
    return stations;
  }

  set_up_slots(stations) {
    let slots = [];
    Object.keys(stations).forEach(from_stat_id => {
      Object.keys(stations[from_stat_id].slots).forEach(to_stat_id => {
        Object.keys(stations[from_stat_id].slots[to_stat_id]).forEach(slot_pos => {
          let slot = stations[from_stat_id].slots[to_stat_id][slot_pos];
          
          let mid_x = (stations[from_stat_id].x + stations[to_stat_id].x) / 2;
          let mid_y = (stations[from_stat_id].y + stations[to_stat_id].y) / 2;

          let to_point_x = (stations[from_stat_id].x + (2*stations[to_stat_id].x)) / 3;
          let to_point_y = (stations[from_stat_id].y + (2*stations[to_stat_id].y)) / 3;

          let distance = 0.18;
          let rise = stations[to_stat_id].y - stations[from_stat_id].y;
          let run =  stations[to_stat_id].x - stations[from_stat_id].x;
          if (slot_pos === "c") {
            slot.midpoint = [mid_x, mid_y];
            slot.to_points[to_stat_id] = [to_point_x, to_point_y];
          } else if (slot_pos === "r") {
            slot.midpoint = [mid_x + distance*rise, mid_y - distance*run];
            slot.to_points[to_stat_id] = [to_point_x + distance*rise, to_point_y - distance*run];
          } else if (slot_pos === "l") {
            slot.midpoint = [mid_x - distance*rise, mid_y + distance*run];
            slot.to_points[to_stat_id] = [to_point_x - distance*rise, to_point_y + distance*run]
          }
          slots.push(slot);
         });
       });
    });
    return slots;
  }
}


export default BoardSetup;