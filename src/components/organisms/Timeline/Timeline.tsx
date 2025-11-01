import React, { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  ButtonGroup,
  Paper
} from "@mui/material";
import { assignLanes, TimelineItemData } from "../../../utils/assignLanes";
import { TimelineItem } from "../../molecules/TimelineItem/TimelineItem";
import { TimelineLegend } from "../../molecules/TimelineLegend/TimelineLegend";
import { EditModal } from "../../molecules/EditModal/EditModal";

interface Props {
  items: TimelineItemData[];
  setItems: React.Dispatch<React.SetStateAction<TimelineItemData[]>>;
}

const BASE_WIDTH_MOBILE = 800;

export const Timeline: React.FC<Props> = ({ items, setItems }) => {
  const theme = useTheme();

  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TimelineItemData | null>(null);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 4.0));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleItemClick = (item: TimelineItemData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSave = (updatedItem: TimelineItemData) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    handleModalClose();
  };

  const msPerDay = 1000 * 60 * 60 * 24;
  const msPerMonth = msPerDay * 30;
  const paddingMonths = 1;
  const ITEM_HEIGHT = 40;
  const VERTICAL_OVERLAP_OFFSET = 14;
  const INITIAL_TOP_OFFSET = 40;
  const numTicks = 10;

  const hasItems = items.length > 0;
  const minItemTime = hasItems ? Math.min(...items.map(i => new Date(i.start).getTime())) : Date.now();
  const maxItemTime = hasItems ? Math.max(...items.map(i => new Date(i.end).getTime())) : Date.now() + msPerMonth * 2;

  const rawTimelineStart = new Date(minItemTime);
  const rawTimelineEnd = new Date(maxItemTime);

  const timelineStartBase = new Date(rawTimelineStart.getTime() - (hasItems ? msPerMonth * paddingMonths : 0));
  const timelineEndBase = new Date(rawTimelineEnd.getTime() + (hasItems ? msPerMonth * paddingMonths : 0));
  const baseTotalDays = (timelineEndBase.getTime() - timelineStartBase.getTime()) / msPerDay;

  const currentViewDays = baseTotalDays / zoomLevel;
  const timelineStart = timelineStartBase;
  const timelineEnd = new Date(timelineStartBase.getTime() + currentViewDays * msPerDay);
  const totalDaysForCalculation = currentViewDays;
  const totalDaysRange = (timelineEnd.getTime() - timelineStart.getTime()) / msPerDay;


  const filteredItems = items.filter(item => {
    const itemStart = new Date(item.start);
    const itemEnd = new Date(item.end);
    return itemStart.getTime() < timelineEnd.getTime() && itemEnd.getTime() > timelineStart.getTime();
  });

  const lanes = assignLanes(filteredItems);


  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const tagsHeight = lanes.length > 0
    ? (lanes.length - 1) * VERTICAL_OVERLAP_OFFSET + ITEM_HEIGHT
    : 0;

  const calculatedMinHeight = tagsHeight + INITIAL_TOP_OFFSET;

  const adjustedMinWidth = isMobile ? `${BASE_WIDTH_MOBILE}px` : `100%`;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        boxSizing: 'border-box',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
          p: 0.5,
        }}
      >
        <ButtonGroup size="small" variant="text" aria-label="Controles de Zoom">
          <Button onClick={handleZoomOut} disabled={zoomLevel <= 0.5}>
            -
          </Button>
          <Button disabled sx={{ px: 1 }}>
            {Math.round(zoomLevel * 100)}%
          </Button>
          <Button onClick={handleZoomIn} disabled={zoomLevel >= 4.0}>
            +
          </Button>
        </ButtonGroup>
      </Paper>

      <Typography variant={isMobile ? "h6" : "h5"} mb={2} textAlign="center">
        O melhor timeline de todos os tempos
      </Typography>

      <Box
        sx={{
          overflowX: "auto",
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: "relative",
            minHeight: calculatedMinHeight,
            borderTop: `2px solid ${theme.palette.divider}`,
            pt: 0,
            mt: 4,
            minWidth: adjustedMinWidth,
            width: 'fit-content',
            pb: 1,
          }}
        >
          {Array.from({ length: numTicks }).map((_, i) => {

            const positionRatio = i / (numTicks - 1);
            const date = new Date(timelineStart.getTime() + (totalDaysRange * msPerDay * positionRatio));

            const dateFormat = isMobile
              ? { day: "numeric" }
              : { month: "short", day: "numeric" };

            return (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: `${positionRatio * 100}%`,
                  transform: "translateX(-50%)",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    height: 10,
                    borderLeft: `2px solid ${theme.palette.divider}`,
                    mx: "auto",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    position: 'relative',
                    whiteSpace: 'nowrap',
                    mt: 0.5,
                    display: 'block',
                    color: "text.secondary",
                  }}
                >
                  {date.toLocaleDateString("en-US", dateFormat)}
                </Typography>
              </Box>
            );
          })}

          {lanes.map((item, idx) => (
            <TimelineItem
              key={item.id}
              item={item}
              startDate={timelineStart}
              endDate={timelineEnd}
              totalDays={totalDaysForCalculation}
              laneIndex={item.lane}
              onClick={handleItemClick}
              zoomLevel={zoomLevel}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <TimelineLegend />
      </Box>

      {selectedItem && (
        <EditModal
          open={isModalOpen}
          onClose={handleModalClose}
          item={selectedItem}
          onSave={handleSave}
        />
      )}
    </Box>
  );
};