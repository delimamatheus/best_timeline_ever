import React from "react";
import { Box, Typography } from "@mui/material";
import { TimelineItem } from "../../molecules/TimelineItem/TimelineItem";
import { assignLanes } from "../../../utils/assignLanes";
import timelineItems from "../../../data/timelineItems"

const Timeline: React.FC = () => {
  const itemsWithLanes = assignLanes(timelineItems);

  const minDate = new Date(
    Math.min(...itemsWithLanes.map((i) => new Date(i.start).getTime()))
  );
  const maxDate = new Date(
    Math.max(...itemsWithLanes.map((i) => new Date(i.end).getTime()))
  );
  const totalDays =
    (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: `${(itemsWithLanes.at(-1)?.lane ?? 0) * 50 + 60}px`,
        bgcolor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: 1,
        p: 2,
      }}
    >
      {itemsWithLanes.map((item) => {
        const startOffset =
          ((new Date(item.start).getTime() - minDate.getTime()) /
            (1000 * 60 * 60 * 24)) /
          totalDays *
          100;
        const duration =
          ((new Date(item.end).getTime() - new Date(item.start).getTime()) /
            (1000 * 60 * 60 * 24)) /
          totalDays *
          100;

        return (
          <Box
            key={item.id}
            sx={{
              position: "absolute",
              top: `${item.lane! * 50}px`,
              left: `${startOffset}%`,
              width: `${Math.max(duration, 2)}%`,
              bgcolor: "primary.main",
              color: "white",
              borderRadius: 1,
              p: 0.5,
              fontSize: "0.8rem",
              textAlign: "center",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <Typography variant="body2">{item.name}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default Timeline;
