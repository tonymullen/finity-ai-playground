import { station_slots } from './slots';

class Station {
  constructor(number, center, pos, size) {
    this.number = number;
    this.center = center;
    this.x = pos[0];
    this.y = pos[1];
    this.size = size;
    this.rings = [];
    this.base_post = null;
    this.slots = station_slots[this.number];
  }
}

export default Station;