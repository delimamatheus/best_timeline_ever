import React from "react";
import "./TimelineItem.css";

export default function TimelineItem({ item, timelineStart, timelineEnd }) {
  const totalDays =
    (new Date(timelineEnd) - new Date(timelineStart)) / (1000 * 60 * 60 * 24);
  const itemStartOffset =
    (new Date(item.start) - new Date(timelineStart)) / (1000 * 60 * 60 * 24);
  const itemDuration =
    (new Date(item.end) - new Date(item.start)) / (1000 * 60 * 60 * 24) +
    1;

  const leftPercent = (itemStartOffset / totalDays) * 100;
  const widthPercent = (itemDuration / totalDays) * 100;

  return (
    <div
      className="timeline-item"
      style={{
        top: item.lane * 40,
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
      }}
    >
      {item.name}
    </div>
  );
}
