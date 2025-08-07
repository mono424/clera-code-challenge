import express from "express";
import { lines } from "../data";
import z from "zod";

const router = express.Router();

router.get(
  "/",
  /**
   * returns an array of line information from the route "/"":
   *
   * ```json
   * {
   *  "name": "string";
   *  "color": "string";
   * }
   * ```
   */
  async function getAllLines(req, res) {
    const responseItems = lines.map((line) => ({
      name: line.name,
      color: line.color,
    }));
    res.send(responseItems);
  }
);

router.get(
  "/:id",
  /**
   * returns a specific line by id, e.g. `GET /lines/U8`
   */
  async function getLineById(req, res) {
    // find the specific line by key
    const requestedLineId = req.params.id;

    const requestedLine = lines.find((line) => line.name === requestedLineId);
    if (!requestedLine) {
      res.sendStatus(404);
      return;
    }

    res.send(requestedLine);
  }
);

// TODO: add further routes here

router.get(
  "/:id/stations",
  /**
   * returns a specific line by id, e.g. `GET /lines/U8/stations`
   */
  async function getLineById(req, res) {
    // find the specific line by key
    const requestedLineId = req.params.id;

    const requestedLine = lines.find((line) => line.name === requestedLineId);
    if (!requestedLine) {
      res.sendStatus(404);
      return;
    }

    res.send(requestedLine.stations);
  }
);

const nextStationsQuerySchema = z.strictObject({
  maxStations: z.number().default(3),
  direction: z.enum(["forward", "backward"]).default("forward"),
});

router.get(
  "/:id/stations/:stationName/next-stations",
  /**
   * returns the next stations for a given station on a given line
   */
  async function getNextStations(req, res) {
    const requestedLineId = req.params.id;
    const requestedStationName = decodeURIComponent(req.params.stationName);

    const parsedQuery = nextStationsQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      res.sendStatus(400);
      return;
    }

    const { maxStations, direction } = parsedQuery.data;

    const stations = lines.find((line) => line.name === requestedLineId)
      ?.stations;

    const stationIndex = (stations || []).findIndex(
      (station) => station === requestedStationName
    );

    if (!stations || stationIndex === -1) {
      res.sendStatus(404);
      return;
    }

    const nextStations =
      direction === "forward"
        ? stations.slice(stationIndex + 1, stationIndex + maxStations + 1)
        : stations.slice(stationIndex - maxStations, stationIndex);

    res.send(nextStations);
  }
);

router.get(
  "/:id/stations/:stationName/available-lines",
  /**
   * returns the lines that pass through a given station
   */
  async function getAvailableLines(req, res) {
    const requestedLineId = req.params.id;
    const requestedStationName = decodeURIComponent(req.params.stationName);

    const stations = lines
      .find((line) => line.name === requestedLineId)
      ?.stations.find((station) => station === requestedStationName);

    if (!stations) {
      res.sendStatus(404);
      return;
    }

    const availableLines = lines.filter(
      (line) =>
        line.name !== requestedLineId &&
        line.stations.includes(requestedStationName)
    );

    res.send(availableLines);
  }
);

export const lineRoutes = router;
