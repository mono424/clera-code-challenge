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

type Edge = {
  from: string;
  to: string;
  line: string;
};

interface NetworkGraph {
  nodes: string[];
  edges: Edge[];
}

const createNetworkGraph = (allLines: Line[]): NetworkGraph => {
  const nodes = [...new Set(allLines.flatMap((line) => line.stations))];
  const edges = allLines.flatMap(
    (line) =>
      line.stations
        .map((station, index) => ({
          from: station,
          to: line.stations[index + 1] ?? "",
          line: line.name,
        }))
        .filter((edge) => edge.to !== "") // filter out edges that have no to station
  );
  return { nodes, edges };
};

const findShortestPath = (
  graph: NetworkGraph,
  originStation: string,
  destinationStation: string,
  visited: Set<string> = new Set([originStation])
): Edge[] | null => {
  if (originStation === destinationStation) {
    return [];
  }

  const nextStations = graph.edges.filter(
    (edge) => edge.from === originStation && !visited.has(edge.to)
  );

  const potentialRoutes = nextStations.map((s) => {
    const shortestPath = findShortestPath(
      graph,
      s.to,
      destinationStation,
      new Set([...visited, s.to])
    );
    return shortestPath
      ? [{ from: originStation, to: s.to, line: s.line }, ...shortestPath]
      : [];
  });

  if (potentialRoutes.length === 0) {
    return null;
  }

  const [shortestRoute] = potentialRoutes.sort((a, b) => a.length - b.length);
  return shortestRoute;
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
  const graph = createNetworkGraph(allLines);
  const route = findShortestPath(graph, originStation, destinationStation);

  if (!route) {
    throw new Error("No route found");
  }

  const routeSegments: RouteSegment[] = [];

  let currentLine: string | null = null;
  for (const edge of route) {
    if (currentLine === null) {
      routeSegments.push({
        action: "enter",
        station: edge.to,
        line: allLines.find((line) => line.name === edge.line)!,
      });
      currentLine = edge.line;
    } else if (edge.line !== currentLine) {
      routeSegments.push({
        action: "switch",
        station: edge.from,
        line: allLines.find((line) => line.name === edge.line)!,
      });
    }
  }

  routeSegments.push({
    action: "exit",
    station: destinationStation,
    line: allLines.find((line) => line.name === currentLine)!,
  });

  return routeSegments;
}
