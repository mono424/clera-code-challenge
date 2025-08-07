import "./App.css";
import { useState } from "react";
import LineSelector from "./components/LineSelector";
import StationsList from "./components/StationsList";
import StationDetails from "./components/StationDetails";

function App() {
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [lineColor, setLineColor] = useState<string>("#000");

  const handleLineSelect = (lineName: string) => {
    setSelectedLine(lineName);
    setSelectedStation(null); // Reset station selection when line changes

    // Set line color - we'll get this from the line data
    // For now, we'll fetch it or use a mapping
    const lineColors: { [key: string]: string } = {
      U1: "#7DAD4A",
      U2: "#DB4018",
      U3: "#007B5B",
      U4: "#F0D81C",
      U5: "#7F532D",
      U6: "#8D6DAD",
      U7: "#518EBB",
      U8: "#1C4E87",
      U9: "#F37A17",
    };
    setLineColor(lineColors[lineName] || "#000");
  };

  const handleStationSelect = (stationName: string) => {
    setSelectedStation(stationName);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Berlin U-Bahn Navigator</h1>
      </header>
      <main className="app-main">
        <div className="three-column-layout">
          <div className="column line-selector-column">
            <LineSelector
              selectedLine={selectedLine}
              onLineSelect={handleLineSelect}
            />
          </div>
          <div className="column stations-column">
            <StationsList
              selectedLine={selectedLine}
              selectedStation={selectedStation}
              onStationSelect={handleStationSelect}
              lineColor={lineColor}
            />
          </div>
          <div className="column details-column">
            <StationDetails
              selectedLine={selectedLine}
              selectedStation={selectedStation}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
