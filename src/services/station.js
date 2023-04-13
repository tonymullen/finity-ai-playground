class Station {
  constructor(number, center, pos, size) {
    this.number = number;
    this.center = center;
    this.x = pos[0];
    this.y = pos[1];
    this.size = size;
    this.rings = [];
    this.slots = [// clockwise from top
      [ null, null, null ], // left to right (clockwise)
      [ null, null, null ],
      [ null, null, null ],
      [ null, null, null ],
      [ null, null, null ],
      [ null, null, null ],
    ];
  }
}

export default Station;