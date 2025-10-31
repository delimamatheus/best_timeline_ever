import React from "react";
import TimelineItem from "../../molecules/TimelineItem/TimelineItem";
import "../../../styles/Timeline.css";

export default function Timeline({ lanes }) {
  return (
    <div className="timeline">
      {lanes.map((lane, i) => (
        <div key={i} className="timeline-lane">
          <div className="lane-label">Lane {i + 1}</div>
          <div className="lane-items">
            {lane.map((item) => (
              <TimelineItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
