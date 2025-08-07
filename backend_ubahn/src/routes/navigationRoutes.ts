import express from "express";
import { lines } from "../data";
import z from "zod";
import { getRoute } from "../domain/getRoute";

const router = express.Router();

router.get(
  "/:originStation/:destinationStation",
  /**
   * returns the lines that pass through a given station
   */
  async function getAvailableLines(req, res) {
    const { originStation, destinationStation } = req.params;

    const originStationExists = lines.some((line) =>
      line.stations.includes(originStation)
    );

    const destinationStationExists = lines.some((line) =>
      line.stations.includes(destinationStation)
    );

    if (!originStationExists || !destinationStationExists) {
      res.sendStatus(404);
      return;
    }

    const route = getRoute(originStation, destinationStation, lines);
    res.send(route);
  }
);

export const navigationRoutes = router;
