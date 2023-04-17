import { slots, station_slots } from './slots';

class Arrow {
  constructor(color, from_station, to_station, slot_loc, slot, is_preview) {
    this.color = color;
    this.is_preview = is_preview;
    if (!slot) {
      this.from_station = from_station;
      this.to_station = to_station;
      this.slot = station_slots[from_station.number][to_station.number][slot_loc];
      station_slots[from_station.number][to_station.number][slot_loc].add_arrow(this);
    } else {
      this.from_station = from_station;
      this.to_station = to_station;
      this.slot = slot
    }
  }

  reverse() {
    let rev_arrow = new Arrow(this.color, 
                              this.to_station, this.from_station, 
                              null, this.slot);
    return rev_arrow;
  }
}

// Set up previews
slots.forEach((slot) => {
  slot.preview_arrows = {};
  Object.keys(slot.stations).forEach((stat) => {
    slot.preview_arrows[stat] = new Arrow(null, stat, slot.stations[stat], null, slot, true);
  });
});

export default Arrow;