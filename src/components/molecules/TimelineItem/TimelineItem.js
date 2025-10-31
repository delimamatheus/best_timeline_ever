import React from "react";
import "../../../styles/TimelineItem.css";

export default function TimelineItem({ item }) {
  return (
    <div className="timeline-item" title={`${item.start} → ${item.end}`}>
      <div className="timeline-item-name">{item.name}</div>
      <div className="timeline-item-dates">{item.start} — {item.end}</div>
    </div>
  );
}
