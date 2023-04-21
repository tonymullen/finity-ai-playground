import { slots } from './slots';

class Arrow {
  constructor(color, from_station, to_station, slot, is_preview) {
    this.color = color;
    this.is_preview = is_preview;
    this.from_station = from_station;
    this.to_station = to_station;
    this.slot = slot
  }

  reverse() {
    let rev_arrow = new Arrow(this.color, 
                              this.to_station, this.from_station, 
                              this.slot);
    return rev_arrow;
  }
}

// Set up previews
slots.forEach((slot) => {
  slot.preview_arrows = {};
  Object.keys(slot.stations).forEach((stat) => {
    slot.preview_arrows[stat] = new Arrow(null, slot.stations[stat], stat, slot, true);
  });
});

export default Arrow;