import Station from './station';

class BoardSetup {
  constructor(count) {
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
  }

  twoPlayerSetup() {
    this.station_numbers = [
      "-1,-1", "-1,0", "0,-1", "-1,1", "1,1", "0,1", "1,-1", "1,0"
    ]

    let center_pos = [400, 325];
    let offset_side_near = 145;
    let offset_side_far = 290;
    let offset_vert_sm = 83;
    let offset_vert_lg = offset_vert_sm * 2;

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
    };
  }

  threePlayerSetup() {
    this.station_numbers = [
      "-2,1", "1,-2", "-1,0", "0,-1", "-1,1", "1,1", "0,1", "1,-1", "1,0"
    ]

    let center_pos = [400, 325];
    let offset_side_near = 145;
    let offset_side_far = 290;
    let offset_vert_sm = 83;
    let offset_vert_lg = offset_vert_sm * 2;

    this.station_positions = {
      "0,0":    center_pos,
      "-1,0":   [center_pos[0]-offset_side_near, center_pos[1]-offset_vert_sm],
      "0,-1":   [center_pos[0]-offset_side_near, center_pos[1]+offset_vert_sm],
      "-1,1":   [center_pos[0], center_pos[1]-offset_vert_lg],
      "1,1":    [center_pos[0]+offset_side_far, center_pos[1]],
      "0,1":    [center_pos[0]+offset_side_near, center_pos[1]-offset_vert_sm],
      "1,-1":   [center_pos[0], center_pos[1]+offset_vert_lg],
      "1,0":    [center_pos[0]+offset_side_near, center_pos[1]+offset_vert_sm],
      "-2,1":   [center_pos[0]-offset_side_near, center_pos[1]-offset_vert_sm*3],
      "1,-2":   [center_pos[0]-offset_side_near, center_pos[1]+offset_vert_sm*3],
    };
  }

  fourPlayerSetup() {
    this.station_numbers = [
      "-2,1", "-1,-1", "1,-2", "-1,0", "0,-1", "-1,1",
      "1,1", "0,1", "1,-1", "1,0", "-1,2", "2,-1"
    ]

    let center_pos = [400, 325];
    let offset_side_near = 145;
    let offset_side_far = 290;
    let offset_vert_sm = 83;
    let offset_vert_lg = offset_vert_sm * 2;

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
  }

  set_up_stations(station_numbers, station_positions, size){
    let stations = {"0,0": new Station("0,0", true, station_positions["0,0"], size)};
    station_numbers.forEach(stat => {
      stations[stat] = new Station(stat, false, station_positions[stat], size)
    });
    return stations;
  }
}

export default BoardSetup;