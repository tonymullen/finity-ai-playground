import DisplayHandler from './display_handler';

class Ring {
  constructor( color, size, station) {
    this.size = size;
    this.color = color;
    this.station = station;
    this.display_handler = new DisplayHandler();
  }
}

export default Ring;