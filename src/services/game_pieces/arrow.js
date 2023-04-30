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
}

export default Arrow;