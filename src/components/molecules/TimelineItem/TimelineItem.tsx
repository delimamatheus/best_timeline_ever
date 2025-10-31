import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { TimelineItemData } from "../../../utils/assignLanes";

interface Props {
  item: TimelineItemData;
  startDate: Date;
  endDate: Date;
  totalDays: number;
}

const categoryColors: Record<string, string> = {
  HR: "#F87171",
  Education: "#60A5FA",
  Translation: "#34D399",
  Design: "#FBBF24",
  Development: "#A78BFA",
  QA: "#F472B6",
  Management: "#6EE7B7",
};

export const TimelineItem: React.FC<Props> = ({ item, startDate, endDate, totalDays }) => {
  const itemStart = new Date(item.start);
  const itemEnd = new Date(item.end);
  const startOffset = ((itemStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100;
  const duration = ((itemEnd.getTime() - itemStart.getTime() + 86400000) / (1000 * 60 * 60 * 24)) / totalDays * 100;

  return (
    <Tooltip title={`${item.name} (${item.start} → ${item.end})`} arrow>
      <Box
        sx={{
          position: "absolute",
          left: `${startOffset}%`,
          width: `${duration}%`,
          backgroundColor: categoryColors[item.category || "Management"],
          borderRadius: "6px",
          padding: "2px 6px",
          color: "white",
          fontSize: "0.8rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          cursor: "pointer",
        }}
      >
        <Typography variant="caption">{item.name}</Typography>
      </Box>
    </Tooltip>
  );
};
