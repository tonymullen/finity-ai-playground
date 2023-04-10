import DisplayHandler from './display_handler';

class BasePost {
  constructor(color, station) {
    this.color = color;
    this.station = station;
    this.display_handler = new DisplayHandler();
  }
}

export default BasePost;