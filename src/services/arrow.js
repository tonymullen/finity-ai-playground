class Arrow {
  constructor(p5, color, from_station, to_station, slot, {ab, aw}) {
    this.p5 = p5;
    this.color = color;
    this.from_station = from_station;
    this.to_station = to_station;
    this.slot = slot;
    this.img = this.color === 'b' ? ab : aw;
  }

  display() {
    this.img.resize(90, 90);
    let xpos = (this.from_station.x + this.to_station.x)/2;
    let ypos = (this.from_station.y + this.to_station.y)/2;
    let rise = this.from_station.y - this.to_station.y;
    let run = this.from_station.x - this.to_station.x;

    let angle = 1.1;

    this.p5.translate(xpos, ypos)
    this.p5.rotate(angle)
    this.p5.image(this.img, 0, 0)
    this.p5.rotate(-angle)
    this.p5.translate(-xpos, -ypos)
  }
}

export default Arrow;