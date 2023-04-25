class Slot {
  /**
   * Each of the 72 slots on the board
   */
  constructor( ){
    this.stations = {};
    this.contains = null;
    this.blocked = false;
    this.interferes_with = [];
    this.location = null;
    this.rotation = null;
  }

  add_blocker(blocker) {
    this.contains = blocker;
  }

  add_arrow(arrow, board) {
    this.contains = arrow;
    this.interferes_with.forEach((slot_ind) => {
      board.slots[slot_ind].block();
    });
  }

  remove_arrow(board) {
    this.contains = null
    this.interferes_with.forEach((slot_ind) => {
      board.slots[slot_ind].unblock();
    });
  }

  block() {
    this.blocked = true;
  }

  clear() {
    this.contains = null;
    this.blocked = false;
  }

  unblock() {
    this.blocked = false;
  }
}

const slots = Array.from({length: 72}, 
    () => new Slot()
  );

set_up_slot_relations();

slots.forEach((slot, index) => {
  slot.id = index;
});

const station_slots = {
  "0,0":  {
    "-1,1": {
      'l': slots[0],
      'c': slots[1],
      'r': slots[2]
    },
    "0,1": {
      'l': slots[3],
      'c': slots[4],
      'r': slots[5]
    },
    "1,0": {
      'l': slots[6],
      'c': slots[7],
      'r': slots[8]
    },
    "1,-1": {
      'l': slots[9],
      'c': slots[10],
      'r': slots[11]
    },
    "0,-1": {
      'l': slots[12],
      'c': slots[13],
      'r': slots[14]
    },
    "-1,0": {
      'l': slots[15],
      'c': slots[16],
      'r': slots[17]
    },
  },
  "-1,0": {
    "-2,1": {
      'l': slots[69],
      'c': slots[70],
      'r': slots[71]
    },
    "-1,1": {
      'l': slots[20],
      'c': slots[19],
      'r': slots[18]
    },
    "0,0": {
      'l': slots[17],
      'c': slots[16],
      'r': slots[15]
    },
    "0,-1": {
      'l': slots[63],
      'c': slots[64],
      'r': slots[65]
    },
    "-1,-1": {
      'l': slots[66],
      'c': slots[67],
      'r': slots[68]
    },
  }, 
  "-1,1": {
    "-1,2": {
      'l': slots[24],
      'c': slots[25],
      'r': slots[26]
    },
    "0,1": {
      'l': slots[29],
      'c': slots[28],
      'r': slots[27]
    },
    "0,0": {
      'l': slots[2],
      'c': slots[1],
      'r': slots[0]
    },   
     "-1,0": {
      'l': slots[18],
      'c': slots[19],
      'r': slots[20]
    },
    "-2,1": {
      'l': slots[21],
      'c': slots[22],
      'r': slots[23]
    },
   
  },  
  "0,1": {
    "1,1": {
      'l': slots[33],
      'c': slots[34],
      'r': slots[35]
    },
    "1,0": {
      'l': slots[38],
      'c': slots[37],
      'r': slots[36]
    },
    "0,0": {
      'l': slots[5],
      'c': slots[4],
      'r': slots[3]
    },
    "-1,1": {
      'l': slots[27],
      'c': slots[28],
      'r': slots[29]
    },
    "-1,2": {
      'l': slots[30],
      'c': slots[31],
      'r': slots[32]
    },
  }, 
  "1,0": {
    "2,-1": {
      'l': slots[42],
      'c': slots[43],
      'r': slots[44]
    },
    "1,-1": {
      'l': slots[47],
      'c': slots[46],
      'r': slots[45]
    },
    "0,0": {
      'l': slots[8],
      'c': slots[7],
      'r': slots[6]
    },
    "0,1": {
      'l': slots[36],
      'c': slots[37],
      'r': slots[38]
    },
    "1,1": {
      'l': slots[39],
      'c': slots[40],
      'r': slots[41]
    },
  },
  "1,-1": {
    "1,-2": {
      'l': slots[51],
      'c': slots[52],
      'r': slots[53]
    },
    "0,-1": {
      'l': slots[56],
      'c': slots[55],
      'r': slots[54]
    },
    "0,0": {
      'l': slots[11],
      'c': slots[10],
      'r': slots[9]
    },
    "1,0": {
      'l': slots[45],
      'c': slots[46],
      'r': slots[47]
    },
    "2,-1": {
      'l': slots[48],
      'c': slots[49],
      'r': slots[50]
    },
  },
  "0,-1": {
    "-1,-1": {
      'l': slots[60],
      'c': slots[61],
      'r': slots[62]
    },
    "-1,0": {
      'l': slots[65],
      'c': slots[64],
      'r': slots[63]
    },
    "0,0": {
      'l': slots[14],
      'c': slots[13],
      'r': slots[12]
    },
    "1,-1": {
      'l': slots[54],
      'c': slots[55],
      'r': slots[56]
    },
    "1,-2": {
      'l': slots[57],
      'c': slots[58],
      'r': slots[59]
    },
  },
  "-1,-1": {
    "-1,0": {
      'l': slots[68],
      'c': slots[67],
      'r': slots[66]
    },
    "0,-1": {
      'l': slots[62],
      'c': slots[61],
      'r': slots[60]
    },
  },  
  "1,1": {
    "1,0": {
      'l': slots[41],
      'c': slots[40],
      'r': slots[39]
    },
    "0,1": {
      'l': slots[35],
      'c': slots[34],
      'r': slots[33]
    },
  },
  "-2,1": {
    "-1,1": {
      'l': slots[23],
      'c': slots[22],
      'r': slots[21]
    },
    "-1,0": {
      'l': slots[71],
      'c': slots[70],
      'r': slots[69]
    },
  },
  "-1,2": {
    "0,1": {
      'l': slots[32],
      'c': slots[31],
      'r': slots[30]
    },
    "-1,1": {
      'l': slots[26],
      'c': slots[25],
      'r': slots[24]
    },
  },
  "2,-1": {
    "1,-1": {
      'l': slots[50],
      'c': slots[49],
      'r': slots[48]
    },
    "1,0": {
      'l': slots[44],
      'c': slots[43],
      'r': slots[42]
    },
  },  
  "1,-2": {
    "0,-1": {
      'l': slots[59],
      'c': slots[58],
      'r': slots[57]
    },
    "1,-1": {
      'l': slots[53],
      'c': slots[52],
      'r': slots[51]
    },
  },  
}

const station_numbers = ["0,0", "-1,0", "-1,1", "0,1", "1,0", 
"1,-1", "0,-1", "-1,-1", "1,1",  "-2,1", "-1,2", "2,-1", "1,-2"]

station_numbers.forEach((from_station) => {
  station_numbers.forEach((to_station) => {
    if (station_slots[from_station][to_station]){
      ['l', 'c', 'r'].forEach((slot_pos) => {
        station_slots[from_station][to_station][slot_pos].stations = {
          [from_station]: to_station,
          [to_station]: from_station
          }
        station_slots[from_station][to_station][slot_pos].midpoint = null;
        station_slots[from_station][to_station][slot_pos].to_points = {};
      });
    }
  });
}); 

function set_up_slot_relations() {
  /* eslint-disable no-lone-blocks*/
  {
    slots[0].interferes_with = [17, 18];
    slots[2].interferes_with = [3, 27];
    slots[3].interferes_with = [2, 27];
    slots[5].interferes_with = [6, 36];
    slots[6].interferes_with = [5, 36];
    slots[8].interferes_with = [9, 45];
    slots[9].interferes_with = [8, 45];
    slots[11].interferes_with = [12, 54];
    slots[12].interferes_with = [11, 54];
    slots[14].interferes_with = [15, 63];
    slots[15].interferes_with = [14, 63];
    slots[17].interferes_with = [18, 0];
    slots[18].interferes_with = [17, 0];
    slots[20].interferes_with = [21, 71];
    slots[21].interferes_with = [20, 71];
    slots[26].interferes_with = [29, 30];
    slots[27].interferes_with = [2, 3];
    slots[29].interferes_with = [26, 30];
    slots[30].interferes_with = [26, 29];
    slots[35].interferes_with = [38, 39];
    slots[36].interferes_with = [5, 6];
    slots[38].interferes_with = [35, 39];
    slots[44].interferes_with = [47, 48];
    slots[45].interferes_with = [8, 9];
    slots[47].interferes_with = [44, 48];
    slots[48].interferes_with = [44, 47];
    slots[53].interferes_with = [56, 57];
    slots[54].interferes_with = [11, 12];
    slots[56].interferes_with = [53, 57];
    slots[57].interferes_with = [53, 56];
    slots[62].interferes_with = [65, 66];
    slots[63].interferes_with = [14, 15];
    slots[65].interferes_with = [62, 66];
    slots[66].interferes_with = [62, 65];
    slots[71].interferes_with = [20, 21];
  }
  {
    slots[0].neighbors = [1, 2];
    slots[1].neighbors = [0, 2];
    slots[2].neighbors = [0, 1];
    slots[3].neighbors = [4, 5];
    slots[4].neighbors = [3, 5];
    slots[5].neighbors = [3, 4];
    slots[6].neighbors = [7, 8];
    slots[7].neighbors = [6, 8];
    slots[8].neighbors = [6, 7];
    slots[9].neighbors = [10, 11];
    slots[10].neighbors = [9, 11];
    slots[11].neighbors = [9, 10];
    slots[12].neighbors = [13, 14];
    slots[13].neighbors = [12, 14];
    slots[14].neighbors = [12, 13];
    slots[15].neighbors = [16, 17];
    slots[16].neighbors = [15, 17];
    slots[17].neighbors = [15, 16];
    slots[18].neighbors = [19, 20];
    slots[19].neighbors = [18, 20];
    slots[20].neighbors = [18, 19];
    slots[21].neighbors = [22, 23];
    slots[22].neighbors = [21, 23];
    slots[23].neighbors = [21, 22];
    slots[24].neighbors = [25, 26];
    slots[25].neighbors = [24, 26];
    slots[26].neighbors = [24, 25];
    slots[27].neighbors = [28, 29];
    slots[28].neighbors = [27, 29];
    slots[29].neighbors = [27, 28];
    slots[30].neighbors = [31, 32];
    slots[31].neighbors = [30, 32];
    slots[32].neighbors = [30, 31];
    slots[33].neighbors = [34, 35];
    slots[34].neighbors = [33, 35];
    slots[35].neighbors = [33, 34];
    slots[36].neighbors = [37, 38];
    slots[37].neighbors = [36, 38];
    slots[38].neighbors = [36, 37];
    slots[39].neighbors = [40, 41];
    slots[40].neighbors = [39, 41];
    slots[41].neighbors = [39, 40];
    slots[42].neighbors = [43, 44];
    slots[43].neighbors = [42, 44];
    slots[44].neighbors = [42, 43];
    slots[45].neighbors = [46, 47];
    slots[46].neighbors = [45, 47];
    slots[47].neighbors = [45, 46];
    slots[48].neighbors = [49, 50];
    slots[49].neighbors = [48, 50];
    slots[50].neighbors = [48, 49];
    slots[51].neighbors = [52, 53];
    slots[52].neighbors = [51, 53];
    slots[53].neighbors = [51, 52];
    slots[54].neighbors = [55, 56];
    slots[55].neighbors = [54, 56];
    slots[56].neighbors = [54, 55];
    slots[57].neighbors = [58, 59];
    slots[58].neighbors = [57, 59];
    slots[59].neighbors = [57, 58];
    slots[60].neighbors = [61, 62];
    slots[61].neighbors = [60, 62];
    slots[62].neighbors = [60, 61];
    slots[63].neighbors = [64, 65];
    slots[64].neighbors = [63, 65];
    slots[65].neighbors = [63, 64];
    slots[66].neighbors = [67, 68];
    slots[67].neighbors = [66, 68];
    slots[68].neighbors = [66, 67];
    slots[69].neighbors = [70, 71];
    slots[70].neighbors = [69, 71];
    slots[71].neighbors = [69, 70];
  }
}

// slots is an array of all 72 slots
// station_slots is a mapping of from stations, to stations,
// l, r, c channels, and slot objects
export { slots, station_slots }