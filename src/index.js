import React from "react";
import ReactDOM from "react-dom/client";
import timelineItems from "./timelineItems.js";

function App() {
  return (
    <div>
      <h2>The best timeline of all time{"\u2728"}</h2>
      <h3>{timelineItems.length} timeline items to render</h3>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);