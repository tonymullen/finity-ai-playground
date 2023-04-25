class PathAnalyzer {
    
    reachable_stations(color, board, game_state, station_ind) {
        // station_ind is optional. default is reachable
        // stations from current base station. If station_ind is passed,
        // then returns reachable stations from that station
        let paths = this.legal_paths(color, board, game_state, station_ind);
        let path_concat = [].concat(...paths);
        let unique_stations = new Set(path_concat);
        return unique_stations;
    }

    has_full_path(color, board, game_state) {
        const FULL_PATH_LENGTH = 9;
        let paths = this.legal_paths(color, board, game_state)
                        .filter(path => path.length === FULL_PATH_LENGTH)
                        .filter(path => path[path.length-1] === '0,0');
        if (paths.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    legal_paths(color, board, game_state, station_ind) {
        // station_ind is optional. default is legal paths
        // from current base station. If station_ind is passed,
        // then returns legal paths from that station
        let base_post_path = [];
        if (!station_ind) {
            base_post_path.push(this.base_post_station(color, game_state));
        } else {
            base_post_path.push(station_ind);
        }
        let raw_paths = this.generate_raw_paths(
            [base_post_path], game_state.path_pattern, board, game_state
            );
        let paths = raw_paths.filter(this.has_enough_rings(board, color));
        return paths;
    }

    has_enough_rings(board, color) {
        return ((path) => {
            let station_visits = {};
            let path_is_supported = true;
            path.slice(1, -1).forEach(station => {
                if (station_visits[station]) {
                    station_visits[station]++
                } else {
                    station_visits[station] = 1
                }
            });
            Object.keys(station_visits).forEach(stat_ind => {
                let rings_on_station = board.stations[stat_ind].rings.filter(
                        ring => ring && ring.color === color
                    ).length;
                if (rings_on_station < station_visits[stat_ind]){
                    path_is_supported = false;
                }
            });
            return path_is_supported;
        });
    }

    // Generate possible paths of stations based on arrow sequences only
    generate_raw_paths(possible_paths, remaining_pattern, board) {
        if (remaining_pattern.length === 0) {
            return possible_paths;
        } else {
            possible_paths.forEach(possible_path => {
                if (possible_path.length === 9 - remaining_pattern.length) {
                    let last_station_ind = possible_path[possible_path.length-1];
                    let last_station = board.stations[last_station_ind];
                    let matching_arrows = last_station.out_arrows(remaining_pattern[0]);

                    matching_arrows.forEach(out_arrow => {
                        let newpath = possible_path.slice(); // copy array
                        if (out_arrow.to_station !== '0,0' ||
                            remaining_pattern.length === 1) {
                            newpath.push(out_arrow.to_station);
                        }
                        possible_paths.push(newpath);
                    });
                }
            })
            return this.generate_raw_paths(
                possible_paths, remaining_pattern.slice(1), board);
        }
    }

    base_post_station(color, game_state) {
        let bp_station_no;
        game_state.base_posts.forEach(bp => {
            if (bp.color === color) {
                bp_station_no = bp.station.number;
            }
        })
        return bp_station_no;
    }
  }

const pathAnalyzer = new PathAnalyzer();
export { pathAnalyzer };