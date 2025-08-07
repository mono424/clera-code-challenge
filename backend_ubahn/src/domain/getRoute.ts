import { Direction } from "./Direction";
import { getAccessibleLines } from "./getAccessibleLines";
import { getNextStops } from "./getNextStops";
import { Line } from "./Line";

export type RouteSegment = {
  /**
   * `enter` = enter to `line` at this `station`
   *
   * `switch` = switch to `line` at this `station`
   *
   * `exit` = exit `line` at `station`
   */

  action: "enter" | "switch" | "exit";
  station: string;
  line: Line;
};

export type Route = RouteSegment[];

const addSwitchSegmentIfNeeded = (
  route: RouteSegment[],
  line: Line,
  station: string
) => {
  const result = [...route];
  if (route.length > 0 && route[route.length - 1].line !== line) {
    result.push({ action: "switch", station: station, line: line });
  }
  return result;
};

const shortestRoute = (
  originStation: string,
  destinationStation: string,
  allLines: Line[],
  currentLine: Line,
  lookupLen: number,
  visited: Set<string>,
  currentRoute: RouteSegment[] = []
): RouteSegment[] => {
  const lines = getAccessibleLines(currentLine, originStation, allLines);
  const nextStops = [currentLine, ...lines]
    .flatMap((line) => [
      ...getNextStops(
        line,
        Direction.Backward,
        lookupLen,
        originStation
      ).map((station) => ({ line, station })),
      ...getNextStops(
        line,
        Direction.Forward,
        lookupLen,
        originStation
      ).map((station) => ({ line, station })),
    ])
    .filter(({ station }) => !visited.has(station));

  if (nextStops.length === 0) {
    return [];
  }

  const directRoute = nextStops.find(
    ({ station }) => station === destinationStation
  );
  if (directRoute) {
    return [
      ...addSwitchSegmentIfNeeded(
        currentRoute,
        directRoute.line,
        originStation
      ),
      {
        action: "exit",
        ...directRoute,
      },
    ];
  }

  for (const stop of nextStops) {
    const route = shortestRoute(
      stop.station,
      destinationStation,
      allLines,
      stop.line,
      lookupLen,
      new Set([...visited, stop.station]),
      addSwitchSegmentIfNeeded(currentRoute, stop.line, originStation)
    );
    if (route) {
      return route;
    }
  }
  return [];
};

/**
 * returns the `Route` from `originStation` to `destinationStation`.
 * If there are multiple possible routes, you can return any of those routes.
 *
 * You can assume `allLines` to be the sample data included in this project, which means you can make the following assumptions:
 *  - all stations are interconnected, so it should always be possible to find a valid Route.
 *  - there's a finite set of stations with a size of around ~100
 *
 * @returns a structure like e.g.
 * ```json
 * [{
 *   "action": "enter",
 *   "station": "Otisstraße",
 *   "line": (U9)
 * }, {
 *   "action": "switch",
 *   "station": "Leopoldplatz",
 *   "line": (U9)
 *  }, {
 *   "action": "exit",
 *   "station": "Hansaplatz",
 *   "line": (U9)
 *  }]
 * ```
 */
export function getRoute(
  originStation: string,
  destinationStation: string,
  allLines: Line[]
): Route {
  const currentLine = allLines.filter((line) =>
    line.stations.includes(originStation)
  );
  if (currentLine.length === 0) {
    return [];
  }

  for (const line of currentLine) {
    const route = shortestRoute(
      originStation,
      destinationStation,
      allLines,
      line,
      100,
      new Set([originStation]),
      [
        {
          action: "enter",
          station: originStation,
          line: line,
        },
      ]
    );

    if (route) {
      return route;
    }
  }

  return [];
}
