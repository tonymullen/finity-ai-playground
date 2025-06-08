import Arrow from './arrow.js';
import Blocker from './blocker.js';

class Slot {
  /**
   * Each of the 72 slots on the board
   */
  constructor(gs_id){
    this.stations = {};
    this.contains = null;
    this.blocked = false;
    this.interferes_with = [];
    this.location = null;
    this.rotation = null;
    this.gs_id = gs_id;
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

  remove_blocker() {
    this.contains = null
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

class Slots {
  constructor(gs_id) {
    this.slots = Array.from({length: 72},
      () => new Slot(gs_id)
    );
    this.station_slots = {
      "0,0":  {
        "-1,1": {
          'l': this.slots[0],
          'c': this.slots[1],
          'r': this.slots[2]
        },
        "0,1": {
          'l': this.slots[3],
          'c': this.slots[4],
          'r': this.slots[5]
        },
        "1,0": {
          'l': this.slots[6],
          'c': this.slots[7],
          'r': this.slots[8]
        },
        "1,-1": {
          'l': this.slots[9],
          'c': this.slots[10],
          'r': this.slots[11]
        },
        "0,-1": {
          'l': this.slots[12],
          'c': this.slots[13],
          'r': this.slots[14]
        },
        "-1,0": {
          'l': this.slots[15],
          'c': this.slots[16],
          'r': this.slots[17]
        },
      },
      "-1,0": {
        "-2,1": {
          'l': this.slots[69],
          'c': this.slots[70],
          'r': this.slots[71]
        },
        "-1,1": {
          'l': this.slots[20],
          'c': this.slots[19],
          'r': this.slots[18]
        },
        "0,0": {
          'l': this.slots[17],
          'c': this.slots[16],
          'r': this.slots[15]
        },
        "0,-1": {
          'l': this.slots[63],
          'c': this.slots[64],
          'r': this.slots[65]
        },
        "-1,-1": {
          'l': this.slots[66],
          'c': this.slots[67],
          'r': this.slots[68]
        },
      },
      "-1,1": {
        "-1,2": {
          'l': this.slots[24],
          'c': this.slots[25],
          'r': this.slots[26]
        },
        "0,1": {
          'l': this.slots[29],
          'c': this.slots[28],
          'r': this.slots[27]
        },
        "0,0": {
          'l': this.slots[2],
          'c': this.slots[1],
          'r': this.slots[0]
        },
         "-1,0": {
          'l': this.slots[18],
          'c': this.slots[19],
          'r': this.slots[20]
        },
        "-2,1": {
          'l': this.slots[21],
          'c': this.slots[22],
          'r': this.slots[23]
        },

      },
      "0,1": {
        "1,1": {
          'l': this.slots[33],
          'c': this.slots[34],
          'r': this.slots[35]
        },
        "1,0": {
          'l': this.slots[38],
          'c': this.slots[37],
          'r': this.slots[36]
        },
        "0,0": {
          'l': this.slots[5],
          'c': this.slots[4],
          'r': this.slots[3]
        },
        "-1,1": {
          'l': this.slots[27],
          'c': this.slots[28],
          'r': this.slots[29]
        },
        "-1,2": {
          'l': this.slots[30],
          'c': this.slots[31],
          'r': this.slots[32]
        },
      },
      "1,0": {
        "2,-1": {
          'l': this.slots[42],
          'c': this.slots[43],
          'r': this.slots[44]
        },
        "1,-1": {
          'l': this.slots[47],
          'c': this.slots[46],
          'r': this.slots[45]
        },
        "0,0": {
          'l': this.slots[8],
          'c': this.slots[7],
          'r': this.slots[6]
        },
        "0,1": {
          'l': this.slots[36],
          'c': this.slots[37],
          'r': this.slots[38]
        },
        "1,1": {
          'l': this.slots[39],
          'c': this.slots[40],
          'r': this.slots[41]
        },
      },
      "1,-1": {
        "1,-2": {
          'l': this.slots[51],
          'c': this.slots[52],
          'r': this.slots[53]
        },
        "0,-1": {
          'l': this.slots[56],
          'c': this.slots[55],
          'r': this.slots[54]
        },
        "0,0": {
          'l': this.slots[11],
          'c': this.slots[10],
          'r': this.slots[9]
        },
        "1,0": {
          'l': this.slots[45],
          'c': this.slots[46],
          'r': this.slots[47]
        },
        "2,-1": {
          'l': this.slots[48],
          'c': this.slots[49],
          'r': this.slots[50]
        },
      },
      "0,-1": {
        "-1,-1": {
          'l': this.slots[60],
          'c': this.slots[61],
          'r': this.slots[62]
        },
        "-1,0": {
          'l': this.slots[65],
          'c': this.slots[64],
          'r': this.slots[63]
        },
        "0,0": {
          'l': this.slots[14],
          'c': this.slots[13],
          'r': this.slots[12]
        },
        "1,-1": {
          'l': this.slots[54],
          'c': this.slots[55],
          'r': this.slots[56]
        },
        "1,-2": {
          'l': this.slots[57],
          'c': this.slots[58],
          'r': this.slots[59]
        },
      },
      "-1,-1": {
        "-1,0": {
          'l': this.slots[68],
          'c': this.slots[67],
          'r': this.slots[66]
        },
        "0,-1": {
          'l': this.slots[62],
          'c': this.slots[61],
          'r': this.slots[60]
        },
      },
      "1,1": {
        "1,0": {
          'l': this.slots[41],
          'c': this.slots[40],
          'r': this.slots[39]
        },
        "0,1": {
          'l': this.slots[35],
          'c': this.slots[34],
          'r': this.slots[33]
        },
      },
      "-2,1": {
        "-1,1": {
          'l': this.slots[23],
          'c': this.slots[22],
          'r': this.slots[21]
        },
        "-1,0": {
          'l': this.slots[71],
          'c': this.slots[70],
          'r': this.slots[69]
        },
      },
      "-1,2": {
        "0,1": {
          'l': this.slots[32],
          'c': this.slots[31],
          'r': this.slots[30]
        },
        "-1,1": {
          'l': this.slots[26],
          'c': this.slots[25],
          'r': this.slots[24]
        },
      },
      "2,-1": {
        "1,-1": {
          'l': this.slots[50],
          'c': this.slots[49],
          'r': this.slots[48]
        },
        "1,0": {
          'l': this.slots[44],
          'c': this.slots[43],
          'r': this.slots[42]
        },
      },
      "1,-2": {
        "0,-1": {
          'l': this.slots[59],
          'c': this.slots[58],
          'r': this.slots[57]
        },
        "1,-1": {
          'l': this.slots[53],
          'c': this.slots[52],
          'r': this.slots[51]
        },
      },
    }
    this.set_up_slot_relations();
    this.slots.forEach((slot, index) => {
      slot.id = index;
    });
    this.gs_id = gs_id;

    const station_numbers = ["0,0", "-1,0", "-1,1", "0,1", "1,0",
    "1,-1", "0,-1", "-1,-1", "1,1",  "-2,1", "-1,2", "2,-1", "1,-2"]

    station_numbers.forEach((from_station) => {
      station_numbers.forEach((to_station) => {
        if (this.station_slots[from_station][to_station]){
          ['l', 'c', 'r'].forEach((slot_pos) => {
            this.station_slots[from_station][to_station][slot_pos].stations = {
              [from_station]: to_station,
              [to_station]: from_station
              }
            this.station_slots[from_station][to_station][slot_pos].midpoint = null;
            this.station_slots[from_station][to_station][slot_pos].to_points = {};
          });
        }
      });
    });

    // Set up previews
    this.slots.forEach((slot) => {
      slot.preview_arrows = {};
      Object.keys(slot.stations).forEach((stat) => {
        slot.preview_arrows[stat] = new Arrow({
          from_station: slot.stations[stat],
          to_station: stat,
          slot: slot,
          is_preview: true});
      });
    });

    // Set up previews
    this.slots.forEach((slot) => {
      slot.preview_blocker = new Blocker({
        slot,
        is_preview: true});
    });


  }

  set_up_slot_relations() {
    /* eslint-disable no-lone-blocks*/
    {
      this.slots[0].interferes_with = [17, 18];
      this.slots[2].interferes_with = [3, 27];
      this.slots[3].interferes_with = [2, 27];
      this.slots[5].interferes_with = [6, 36];
      this.slots[6].interferes_with = [5, 36];
      this.slots[8].interferes_with = [9, 45];
      this.slots[9].interferes_with = [8, 45];
      this.slots[11].interferes_with = [12, 54];
      this.slots[12].interferes_with = [11, 54];
      this.slots[14].interferes_with = [15, 63];
      this.slots[15].interferes_with = [14, 63];
      this.slots[17].interferes_with = [18, 0];
      this.slots[18].interferes_with = [17, 0];
      this.slots[20].interferes_with = [21, 71];
      this.slots[21].interferes_with = [20, 71];
      this.slots[26].interferes_with = [29, 30];
      this.slots[27].interferes_with = [2, 3];
      this.slots[29].interferes_with = [26, 30];
      this.slots[30].interferes_with = [26, 29];
      this.slots[35].interferes_with = [38, 39];
      this.slots[36].interferes_with = [5, 6];
      this.slots[38].interferes_with = [35, 39];
      this.slots[39].interferes_with = [35, 38];
      this.slots[44].interferes_with = [47, 48];
      this.slots[45].interferes_with = [8, 9];
      this.slots[47].interferes_with = [44, 48];
      this.slots[48].interferes_with = [44, 47];
      this.slots[53].interferes_with = [56, 57];
      this.slots[54].interferes_with = [11, 12];
      this.slots[56].interferes_with = [53, 57];
      this.slots[57].interferes_with = [53, 56];
      this.slots[62].interferes_with = [65, 66];
      this.slots[63].interferes_with = [14, 15];
      this.slots[65].interferes_with = [62, 66];
      this.slots[66].interferes_with = [62, 65];
      this.slots[71].interferes_with = [20, 21];
    }
    {
      this.slots[0].neighbors = [1, 2];
      this.slots[1].neighbors = [0, 2];
      this.slots[2].neighbors = [0, 1];
      this.slots[3].neighbors = [4, 5];
      this.slots[4].neighbors = [3, 5];
      this.slots[5].neighbors = [3, 4];
      this.slots[6].neighbors = [7, 8];
      this.slots[7].neighbors = [6, 8];
      this.slots[8].neighbors = [6, 7];
      this.slots[9].neighbors = [10, 11];
      this.slots[10].neighbors = [9, 11];
      this.slots[11].neighbors = [9, 10];
      this.slots[12].neighbors = [13, 14];
      this.slots[13].neighbors = [12, 14];
      this.slots[14].neighbors = [12, 13];
      this.slots[15].neighbors = [16, 17];
      this.slots[16].neighbors = [15, 17];
      this.slots[17].neighbors = [15, 16];
      this.slots[18].neighbors = [19, 20];
      this.slots[19].neighbors = [18, 20];
      this.slots[20].neighbors = [18, 19];
      this.slots[21].neighbors = [22, 23];
      this.slots[22].neighbors = [21, 23];
      this.slots[23].neighbors = [21, 22];
      this.slots[24].neighbors = [25, 26];
      this.slots[25].neighbors = [24, 26];
      this.slots[26].neighbors = [24, 25];
      this.slots[27].neighbors = [28, 29];
      this.slots[28].neighbors = [27, 29];
      this.slots[29].neighbors = [27, 28];
      this.slots[30].neighbors = [31, 32];
      this.slots[31].neighbors = [30, 32];
      this.slots[32].neighbors = [30, 31];
      this.slots[33].neighbors = [34, 35];
      this.slots[34].neighbors = [33, 35];
      this.slots[35].neighbors = [33, 34];
      this.slots[36].neighbors = [37, 38];
      this.slots[37].neighbors = [36, 38];
      this.slots[38].neighbors = [36, 37];
      this.slots[39].neighbors = [40, 41];
      this.slots[40].neighbors = [39, 41];
      this.slots[41].neighbors = [39, 40];
      this.slots[42].neighbors = [43, 44];
      this.slots[43].neighbors = [42, 44];
      this.slots[44].neighbors = [42, 43];
      this.slots[45].neighbors = [46, 47];
      this.slots[46].neighbors = [45, 47];
      this.slots[47].neighbors = [45, 46];
      this.slots[48].neighbors = [49, 50];
      this.slots[49].neighbors = [48, 50];
      this.slots[50].neighbors = [48, 49];
      this.slots[51].neighbors = [52, 53];
      this.slots[52].neighbors = [51, 53];
      this.slots[53].neighbors = [51, 52];
      this.slots[54].neighbors = [55, 56];
      this.slots[55].neighbors = [54, 56];
      this.slots[56].neighbors = [54, 55];
      this.slots[57].neighbors = [58, 59];
      this.slots[58].neighbors = [57, 59];
      this.slots[59].neighbors = [57, 58];
      this.slots[60].neighbors = [61, 62];
      this.slots[61].neighbors = [60, 62];
      this.slots[62].neighbors = [60, 61];
      this.slots[63].neighbors = [64, 65];
      this.slots[64].neighbors = [63, 65];
      this.slots[65].neighbors = [63, 64];
      this.slots[66].neighbors = [67, 68];
      this.slots[67].neighbors = [66, 68];
      this.slots[68].neighbors = [66, 67];
      this.slots[69].neighbors = [70, 71];
      this.slots[70].neighbors = [69, 71];
      this.slots[71].neighbors = [69, 70];
    }
  }
}

// slots is an array of all 72 slots
// station_slots is a mapping of from stations, to stations,
// l, r, c channels, and slot objects
export default Slots;
