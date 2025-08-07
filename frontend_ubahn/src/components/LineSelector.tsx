import { useEffect, useState } from "react";
import { Line } from "../types/Line";

interface LineSelectorProps {
  selectedLine: string | null;
  onLineSelect: (lineName: string) => void;
}

export default function LineSelector({
  selectedLine,
  onLineSelect,
}: LineSelectorProps) {
  const [lines, setLines] = useState<Line[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLines() {
      try {
        const response = await fetch("http://localhost:8080/lines");
        const data = await response.json();
        setLines(data);
      } catch (error) {
        console.error("Failed to fetch lines:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLines();
  }, []);

  if (loading) {
    return <div className="line-selector loading">Loading lines...</div>;
  }

  return (
    <div className="line-selector">
      <h2>U-Bahn Lines</h2>
      <div className="lines-list">
        {lines.map((line) => (
          <button
            key={line.name}
            className={`line-button ${
              selectedLine === line.name ? "selected" : ""
            }`}
            style={{
              backgroundColor:
                selectedLine === line.name ? line.color : "transparent",
              borderColor: line.color,
              color: selectedLine === line.name ? "white" : line.color,
            }}
            onClick={() => onLineSelect(line.name)}
          >
            {line.name}
          </button>
        ))}
      </div>
    </div>
  );
}
