import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { TimelineItemData } from "../../../utils/assignLanes";

interface Props {
  item: TimelineItemData;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  laneIndex?: number;
  onClick: (item: TimelineItemData) => void;
  onDrop: (itemId: number, newLeft: number, timelineScrollWidth: number) => void;
  timelineRef: React.RefObject<HTMLDivElement | null>;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
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
const DRAG_THRESHOLD = 5;

export const TimelineItem: React.FC<Props> = ({ item, startDate, endDate, totalDays, laneIndex, onClick, onDrop, timelineRef, setIsDragging, zoomLevel }) => {
  const [isCurrentlyDragging, setIsCurrentlyDragging] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const dragStartMouseX = useRef(0);
  const initialItemLeftPixels = useRef(0);
  const dragged = useRef(false);

  const itemStart = new Date(item.start);
  const itemEnd = new Date(item.end);
  const startOffset = ((itemStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100;
  const duration = ((itemEnd.getTime() - itemStart.getTime() + 86400000) / (1000 * 60 * 60 * 24)) / totalDays * 100;

  const VERTICAL_OVERLAP_OFFSET = 14;
  const INITIAL_TOP_OFFSET = 40;

  const calculatedTop = INITIAL_TOP_OFFSET + (laneIndex ?? 0) * VERTICAL_OVERLAP_OFFSET;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!itemRef.current || !timelineRef.current || !timelineRef.current.parentElement) return;

    setIsCurrentlyDragging(true);
    setIsDragging(true);
    dragged.current = false;

    dragStartMouseX.current = e.clientX;

    const itemBounds = itemRef.current.getBoundingClientRect();
    const timelineBounds = timelineRef.current.getBoundingClientRect();
    const timelineScroll = timelineRef.current.parentElement.scrollLeft;

    initialItemLeftPixels.current = itemBounds.left - timelineBounds.left + timelineScroll;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isCurrentlyDragging || !timelineRef.current || !itemRef.current) return;

    const timelineScrollWidth = timelineRef.current.scrollWidth;
    const itemWidth = itemRef.current.offsetWidth;

    const deltaX = e.clientX - dragStartMouseX.current;

    if (Math.abs(deltaX) > DRAG_THRESHOLD) {
      dragged.current = true;
    }

    let finalLeftPixels = initialItemLeftPixels.current + deltaX;

    finalLeftPixels = Math.max(0, finalLeftPixels);
    finalLeftPixels = Math.min(timelineScrollWidth - itemWidth, finalLeftPixels);

    const initialLeftInPixels = (startOffset / 100) * timelineScrollWidth;

    const transformDelta = finalLeftPixels - initialLeftInPixels;

    itemRef.current.style.transform = `translateX(${transformDelta}px)`;
  };

  const handleMouseUp = () => {
    if (isCurrentlyDragging && itemRef.current && timelineRef.current) {

      const timelineScrollWidth = timelineRef.current.scrollWidth;

      if (dragged.current) {
        const deltaX = (window.event as MouseEvent).clientX - dragStartMouseX.current;

        let finalLeftPixels = initialItemLeftPixels.current + deltaX;
        const itemWidth = itemRef.current.offsetWidth;

        finalLeftPixels = Math.max(0, finalLeftPixels);
        finalLeftPixels = Math.min(timelineScrollWidth - itemWidth, finalLeftPixels);

        onDrop(item.id, finalLeftPixels, timelineScrollWidth);
      }

      itemRef.current.style.transform = '';
    }
    setIsCurrentlyDragging(false);
    setIsDragging(false);
  };

  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dragged.current) {
      onClick(item);
    }
    dragged.current = false;
  };


  useEffect(() => {
    if (isCurrentlyDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isCurrentlyDragging]);

  return (
    <Tooltip title={`${item.name} (${item.start} → ${item.end})`} arrow>
      <Box
        ref={itemRef}
        onClick={handleItemClick}
        onMouseDown={handleMouseDown}
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
          zIndex: isCurrentlyDragging ? 100 : 1,
          cursor: isCurrentlyDragging ? "grabbing" : "grab",
          transition: isCurrentlyDragging ? 'none' : 'left 0.3s ease-in-out',
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