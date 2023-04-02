class Station {
  constructor(number, center, pos, { cs, st }, size) {
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
    image(this.img, this.x, this.y, ...this.size);

    // label with number
    textSize(28);
    textAlign(CENTER, CENTER);
    fill(0,0,0,.4);
    text(this.number, this.x, this.y-50);
  }
}