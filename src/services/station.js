import { station_slots } from './slots';

class Station {
  constructor(number, center, pos, size) {
    this.number = number;
    this.center = center;
    this.x = pos[0];
    this.y = pos[1];
    this.size = size;
    this.rings = [null, null, null];
    this.base_post = null;
    this.slots = station_slots[this.number];
  }

  // Return a list of all outgoing arrows of a particular
  // color for path traversal purposes
  out_arrows(color) {
    let out_arrows = [];
    Object.keys(this.slots).forEach(neighbor_station => {
      Object.values(this.slots[neighbor_station]).forEach( slot => {
        if (slot.contains &&
          slot.contains.constructor.name === 'Arrow' &&
          slot.contains.from_station === this.number &&
          slot.contains.color === color) {
            out_arrows.push(slot.contains);
          }
      })
    });
    return out_arrows;
  }
}

export default Station;