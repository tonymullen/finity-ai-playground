class Station {
  constructor(p5, number, center, pos, { cs, st }, size) {
    this.p5 = p5;
    this.center = center;
    this.number = number;
    this.x = pos[0];
    this.y = pos[1];
    this.size = size;
    this.slots = [// clockwise from top
      [ null, null, null ], // left to right (clockwise)
      [ null, null, null ],
      [ null, null, null ],
      [ null, null, null ],
      [ null, null, null ],
      [ null, null, null ],
    ];
    this.img = center? cs : st;
  }

  display() {
    this.p5.image(this.img, this.x, this.y, ...this.size);

    // label with number
    this.p5.textSize(28);
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.fill(0,0,0,.4);
    this.p5.text(this.number, this.x, this.y-50);
  }
}

export default Station;