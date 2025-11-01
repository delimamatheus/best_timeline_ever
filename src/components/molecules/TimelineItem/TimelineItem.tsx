import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { TimelineItemData } from "../../../utils/assignLanes";

interface Props {
  item: TimelineItemData;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  laneIndex?: number;
  onClick: (item: TimelineItemData) => void;
  zoomLevel: number;
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

const ITEM_HEIGHT = 40;
const BASE_FONT_SIZE = "0.75rem";

export const TimelineItem: React.FC<Props> = ({ item, startDate, endDate, totalDays, laneIndex, onClick, zoomLevel }) => {
  const itemStart = new Date(item.start);
  const itemEnd = new Date(item.end);
  const startOffset = ((itemStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100;
  const duration = ((itemEnd.getTime() - itemStart.getTime() + 86400000) / (1000 * 60 * 60 * 24)) / totalDays * 100;

  const VERTICAL_OVERLAP_OFFSET = 14;
  const INITIAL_TOP_OFFSET = 40;

  const calculatedTop = INITIAL_TOP_OFFSET + (laneIndex ?? 0) * VERTICAL_OVERLAP_OFFSET;

  return (
    <Tooltip title={`${item.name} (${item.start} → ${item.end})`} arrow>
      <Box
        onClick={() => onClick(item)}
        sx={{
          position: "absolute",
          top: calculatedTop,
          left: `${startOffset}%`,
          width: `${duration}%`,
          height: ITEM_HEIGHT,
          backgroundColor: categoryColors[item.category || "Management"],
          borderRadius: 1,
          px: 0.5,
          py: 0.3,
          minWidth: '75px',
          color: "white",
          textAlign: 'left',
          fontSize: { xs: "0.6rem", sm: BASE_FONT_SIZE },
          overflow: "visible",
          textOverflow: "clip",
          whiteSpace: "normal",
          zIndex: 1,
          cursor: "pointer",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: { xs: "0.6rem", sm: BASE_FONT_SIZE },
            lineHeight: 1.2,
            overflowWrap: "break-word",
          }}
        >
          {item.name}
        </Typography>
      </Box>
    </Tooltip>
  );
};