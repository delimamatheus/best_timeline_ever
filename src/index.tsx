import React from "react";
import { createRoot } from "react-dom/client";
import { Timeline } from "./components/organisms/Timeline/Timeline";
import timelineItems from "./data/timelineItems";

const root = createRoot(document.getElementById("root")!);
root.render(<Timeline items={timelineItems} />);
