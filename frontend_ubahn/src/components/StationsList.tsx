import { useEffect, useState } from "react";
import axios from "axios";

interface StationsListProps {
  selectedLine: string | null;
  selectedStation: string | null;
  onStationSelect: (stationName: string) => void;
  lineColor: string;
}

export default function StationsList({
  selectedLine,
  selectedStation,
  onStationSelect,
  lineColor,
}: StationsListProps) {
  const [stations, setStations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedLine) {
      setStations([]);
      return;
    }

    async function fetchStations() {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/lines/${selectedLine}/stations`
        );
        setStations(response.data);
      } catch (error) {
        console.error("Failed to fetch stations:", error);
        setStations([]);
      } finally {
        setLoading(false);
      }
    }

    fetchStations();
  }, [selectedLine]);

  if (!selectedLine) {
    return (
      <div className="stations-list empty">
        <p>Select a line to view its stations</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="stations-list loading">
        <h3>{selectedLine} Stations</h3>
        <p>Loading stations...</p>
      </div>
    );
  }

  return (
    <div className="stations-list">
      <h3 style={{ color: lineColor }}>{selectedLine} Stations</h3>
      <div className="stations-container">
        {stations.map((station, index) => (
          <button
            key={station}
            className={`station-button ${
              selectedStation === station ? "selected" : ""
            }`}
            style={{
              backgroundColor:
                selectedStation === station ? lineColor : "transparent",
              borderColor: lineColor,
              color: selectedStation === station ? "white" : "#333",
            }}
            onClick={() => onStationSelect(station)}
          >
            <span className="station-number">{index + 1}</span>
            <span className="station-name">{station}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
