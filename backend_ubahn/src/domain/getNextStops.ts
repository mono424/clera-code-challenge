import { Direction } from "./Direction";
import { Line } from "./Line";

/**
 * Computes which stations of a given line follow next after a given station
 *
 * @returns the next `nStops` stations of `line`, counting from `fromStation` and in direction `direction`
 */

export function getNextStops(
  line: Line,
  /**
   * if `forward`, returns the stations that follow `fromStation` in the `line.stations` array.
   *
   * if `backward`, returns the stations that precede `fromStation` in the `line.stations` array.
   */
  direction: Direction,
  /**
   * the maximum number of stops that should be returned
   */
  nStops: number,
  /**
   * which station within `line` to base the computation on
   */
  fromStation: string
): string[] {
  const stations = line.stations;
  const stationIndex = stations.indexOf(fromStation);

  if (stationIndex === -1) {
    throw new Error("Station not found");
  }

  return direction === Direction.Forward
    ? stations.slice(stationIndex + 1, stationIndex + nStops + 1)
    : stations.slice(stationIndex - nStops, stationIndex).reverse();
}
