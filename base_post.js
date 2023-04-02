class BasePost {
  constructor(color, station, { bp }) {
    this.color = color;
    this.img = bp
    this.station = station;
    // base post image contains four posts
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
      this.img,
      this.station.x,
      this.station.y,
      100,
      100,
      ...this.color_crops[this.color]
      )
    }
}