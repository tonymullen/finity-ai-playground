//import { station_slots } from './slots';

class Station {
  constructor(number, center, pos, size, station_slots) {
    this.number = number;
    this.center = center;
    this.x = pos[0];
    this.y = pos[1];
    this.size = size;
    this.rings = [null, null, null];
    this.base_post = null;
    this.slots = station_slots[this.number];
  }

  /**
   * Return number of rings (non-null places)
   * on the station
   * 
   * @returns {number}
   */
  ring_count() {
    return this.rings.filter(ring => ring).length;
  }
  
  /**
   * Return the size ('s', 'm', or 'l') of
   * the topmost open position on the station
   * 
   * @returns {String}
   */
  topmost_opening() {
    if (!this.rings[0]) {
      return 's';
    } else if (!this.rings[1]) {
      return 'm';
    } else if (!this.rings[2]) {
      return 'l';
    }
  }

  /**
   * Which color controls the station?
   * 
   * @returns {(String|null)}
   */
  controlled_by() {
    if (this.rings[0]) {
      return this.rings[0].color;
    } else if (this.rings[1]) {
      return this.rings[1].color;
    } else if (this.rings[2]) {
      return this.rings[2].color;
    } else {
      return null;
    }
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