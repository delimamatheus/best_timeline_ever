import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { assignLanes } from "../../../utils/assignLanes";

export interface TimelineItemData {
  id: number;
  start: string;
  end: string;
  name: string;
  team?: string;
}

interface Props {
  items: TimelineItemData[];
}

export const Timeline: React.FC<Props> = ({ items }) => {
  const theme = useTheme();
  const lanes = assignLanes(items);

  // Determinar o intervalo total da timeline
  const timelineStart = new Date(
    Math.min(...items.map((i) => new Date(i.start).getTime()))
  );
  const timelineEnd = new Date(
    Math.max(...items.map((i) => new Date(i.end).getTime()))
  );
  const totalDays =
    (timelineEnd.getTime() - timelineStart.getTime()) /
    (1000 * 60 * 60 * 24);

  const getLeft = (date: string) =>
    ((new Date(date).getTime() - timelineStart.getTime()) /
      (timelineEnd.getTime() - timelineStart.getTime())) *
    100;

  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  return (
    <Box
      sx={{
        position: "relative",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 3,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography variant="h6" mb={2} display="flex" alignItems="center">
        📅 Project Timeline
      </Typography>

      {/* Timeline base line */}
      <Box
        sx={{
          position: "relative",
          height: lanes.length * 50 + 60,
          borderTop: `2px solid ${theme.palette.divider}`,
          mt: 4,
        }}
      >
        {/* Date ticks */}
        {Array.from({ length: 10 }).map((_, i) => {
          const date = new Date(
            timelineStart.getTime() +
              ((timelineEnd.getTime() - timelineStart.getTime()) / 9) * i
          );
          return (
            <Box
              key={i}
              sx={{
                position: "absolute",
                top: 0,
                left: `${(i / 9) * 100}%`,
                width: 1,
                textAlign: "center",
                transform: "translateX(-50%)",
              }}
            >
              <Box
                sx={{
                  height: 10,
                  borderLeft: `2px solid ${theme.palette.divider}`,
                }}
              />
              <Typography
                variant="caption"
                sx={{ mt: 0.5, display: "block", color: "text.secondary" }}
              >
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Typography>
            </Box>
          );
        })}

        {/* Items */}
        {lanes.map((item, idx) => {
          const left = getLeft(item.start);
          const width =
            ((new Date(item.end).getTime() - new Date(item.start).getTime()) /
              (timelineEnd.getTime() - timelineStart.getTime())) *
            100;
          const color = colors[idx % colors.length];

          return (
            <Box
              key={item.id}
              sx={{
                position: "absolute",
                top: idx * 50 + 30,
                left: `${left}%`,
                width: `${width}%`,
                height: 28,
                backgroundColor: color,
                borderRadius: 1,
                color: "white",
                px: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                fontSize: "0.8rem",
                fontWeight: 500,
              }}
            >
              {item.name}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
