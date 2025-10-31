import React from "react";
import TimelineItem from "../../molecules/TimelineItem/TimelineItem";
import { assignLanes } from "../../../utils/assignLanes";
import "./Timeline.css";
import timelineItems from "../../../data/timelineItems";


export default function Timeline() {
  const itemsWithLanes = assignLanes(timelineItems);

  const timelineStart = itemsWithLanes.reduce(
    (earliest, item) =>
      new Date(item.start) < new Date(earliest) ? item.start : earliest,
    itemsWithLanes[0].startDate
  );

  const timelineEnd = itemsWithLanes.reduce(
    (latest, item) =>
      new Date(item.end) > new Date(latest) ? item.end : latest,
    itemsWithLanes[0].endDate
  );

  return (
    <div className="timeline-container">
      {itemsWithLanes.map(item => (
        <TimelineItem
          key={item.id}
          item={item}
          timelineStart={timelineStart}
          timelineEnd={timelineEnd}
        />
      ))}
    </div>
  );
}
