class Ring {
  constructor(color, size, station, { rings_s, rings_m, rings_l }) {
    this.size = size;
    this.color = color;
    this.imgs = {rings_s, rings_m, rings_l}
    this.station = station;
    // each ring image contains four rings, one of
    // each color. We need to crop the image to get the
    // color ring we want
    this.color_crops = {
      'red': [0, 0, 300, 300],
      'cyan': [300, 300, 300, 300],
      'purple': [0, 300, 300, 300],
      'yellow': [300, 0, 300, 300],
    }
  }

  display() {
    image(
      this.imgs['rings_'+this.size],
      this.station.x,
      this.station.y,
      100,
      100,
      ...this.color_crops[this.color])
  }
}