import { useEffect, useState } from "react";
import { AccessibleLine } from "../types/Line";

interface StationDetailsProps {
  selectedLine: string | null;
  selectedStation: string | null;
}

export default function StationDetails({
  selectedLine,
  selectedStation,
}: StationDetailsProps) {
  const [accessibleLines, setAccessibleLines] = useState<AccessibleLine[]>([]);
  const [nextStops, setNextStops] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedLine || !selectedStation) {
      setAccessibleLines([]);
      setNextStops([]);
      return;
    }

    async function fetchStationDetails() {
      setLoading(true);
      try {
        // Fetch accessible lines
        const accessibleLinesResponse = await fetch(
          `http://localhost:8080/lines/${selectedLine}/stations/${encodeURIComponent(
            selectedStation!
          )}/available-lines`
        );

        const accessibleLines = await accessibleLinesResponse.json();
        setAccessibleLines([...accessibleLines]);

        // Fetch next 3 stops
        const nextStopsResponse = await fetch(
          `http://localhost:8080/lines/${selectedLine}/stations/${encodeURIComponent(
            selectedStation!
          )}/next-stations?maxStations=3`
        );

        const nextStops = await nextStopsResponse.json();
        setNextStops(nextStops);
      } catch (error) {
        console.error("Failed to fetch station details:", error);
        setAccessibleLines([]);
        setNextStops([]);
      } finally {
        setLoading(false);
      }
    }

    fetchStationDetails();
  }, [selectedLine, selectedStation]);

  if (!selectedLine || !selectedStation) {
    return (
      <div className="station-details empty">
        <p>Select a station to view details</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="station-details loading">
        <h3>{selectedStation}</h3>
        <p>Loading station details...</p>
      </div>
    );
  }

  return (
    <div className="station-details">
      <h3>{selectedStation}</h3>

      <div className="accessible-lines-section">
        <h4>Accessible Lines</h4>
        {accessibleLines.length > 0 ? (
          <div className="accessible-lines">
            {accessibleLines.map((line) => (
              <div
                key={line.name}
                className="accessible-line"
                style={{
                  backgroundColor: line.color,
                  color: "white",
                }}
              >
                {line.name}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No other lines accessible from this station</p>
        )}
      </div>

      <div className="next-stops-section">
        <h4>Next 3 Stops</h4>
        {nextStops.length > 0 ? (
          <div className="next-stops">
            {nextStops.map((stop, index) => (
              <div key={stop} className="next-stop">
                <span className="stop-name">{stop}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No next stops available</p>
        )}
      </div>
    </div>
  );
}
