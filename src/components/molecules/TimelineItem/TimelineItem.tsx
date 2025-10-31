import React from "react";
import { Box, Typography } from "@mui/material";

interface TimelineItemProps {
  title: string;
  top: number;
  left: number;
  width: number;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  top,
  left,
  width,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top,
        left,
        width: Math.max(width, 60), // largura mínima para caber texto
        backgroundColor: "#1976d2",
        color: "white",
        px: 1,
        py: 0.5,
        borderRadius: 1,
        boxShadow: 2,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: 12,
      }}
    >
      <Typography variant="body2">{title}</Typography>
    </Box>
  );
};
