import { slots } from './slots';

class Arrow {
  constructor({
    color, 
    from_station, 
    to_station, 
    slot, 
    is_preview}={}) {
    this.color = color;
    this.is_preview = is_preview;
    this.from_station = from_station;
    this.to_station = to_station;
    this.slot = slot
  }

  reverse() {
    let rev_arrow = new Arrow({
      color: this.color, 
      from_station: this.to_station, 
      to_station: this.from_station, 
      slot: this.slot});
    return rev_arrow;
  }

  duplicate() {
    return new Arrow({
      color: this.color, 
      from_station: this.from_station, 
      to_station: this.to_station, 
      slot: this.slot, 
      is_preview: this.is_preview});
  }
}

// Set up previews
slots.forEach((slot) => {
  slot.preview_arrows = {};
  Object.keys(slot.stations).forEach((stat) => {
    slot.preview_arrows[stat] = new Arrow({
      from_station: slot.stations[stat], 
      to_station: stat, 
      slot: slot, 
      is_preview: true});
  });
});

export default Arrow;