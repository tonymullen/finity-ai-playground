import { slots, station_slots } from './slots';

class Blocker {
  constructor({
    color, 
    from_station, 
    to_station, 
    slot_loc, 
    slot, 
    is_preview
  }={}) {
    this.color = color;
    this.is_preview = is_preview;
    if (!slot) {
      this.from_station = from_station;
      this.to_station = to_station;
      this.slot = station_slots[from_station.number][to_station.number][slot_loc];
      station_slots[from_station.number][to_station.number][slot_loc].add_blocker(this);
    } else {
      this.from_station = Object.keys(slot.stations)[0];
      this.to_station = Object.keys(slot.stations)[1];
      this.slot = slot
      if (!this.is_preview) {
        slot.add_blocker(this);
      }
    }
    this.to_move = false;
  }
}

// Set up previews
slots.forEach((slot) => {
  slot.preview_blocker = new Blocker({
    slot, 
    is_preview: true});
});
  
export default Blocker;