import React from "react";
import timelineItems from "../../data/timelineItems";
import assignLanes from "../../utils/assignLanes";
import Timeline from "../../components/organisms/Timeline/Timeline";

export default function Home() {
  const lanes = assignLanes(timelineItems);
  return (
    <main style={{ padding: 24 }}>
      <h1>The best timeline of all time ✨</h1>
      <p>{timelineItems.length} timeline items to render</p>
      <Timeline lanes={lanes} />
    </main>
  );
}
