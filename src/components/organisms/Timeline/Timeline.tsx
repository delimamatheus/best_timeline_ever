import React, { useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { assignLanes, TimelineItemData } from "../../../utils/assignLanes";
import { TimelineItem } from "../../molecules/TimelineItem/TimelineItem";
import { TimelineLegend } from "../../molecules/TimelineLegend/TimelineLegend";
import { EditModal } from "../../molecules/EditModal/EditModal";

interface Props {
  items: TimelineItemData[];
  setItems: React.Dispatch<React.SetStateAction<TimelineItemData[]>>;
}

export const Timeline: React.FC<Props> = ({ items, setItems }) => {
  const theme = useTheme();
  const lanes = assignLanes(items);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TimelineItemData | null>(null);

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
  const ITEM_HEIGHT = 28;
  const VERTICAL_OVERLAP_OFFSET = 14;
  const INITIAL_TOP_OFFSET = 40;

  const hasItems = items.length > 0;
  const minItemTime = hasItems ? Math.min(...items.map(i => new Date(i.start).getTime())) : Date.now();
  const maxItemTime = hasItems ? Math.max(...items.map(i => new Date(i.end).getTime())) : Date.now() + msPerMonth * 2;

  const rawTimelineStart = new Date(minItemTime);
  const rawTimelineEnd = new Date(maxItemTime);

  const timelineStart = new Date(rawTimelineStart.getTime() - (hasItems ? msPerMonth * paddingMonths : 0));
  const timelineEnd = new Date(rawTimelineEnd.getTime() + (hasItems ? msPerMonth * paddingMonths : 0));

  const totalDays = (timelineEnd.getTime() - timelineStart.getTime()) / msPerDay;

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const tagsHeight = lanes.length > 0
    ? (lanes.length - 1) * VERTICAL_OVERLAP_OFFSET + ITEM_HEIGHT
    : 0;

  const calculatedMinHeight = tagsHeight + INITIAL_TOP_OFFSET;

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
      <Typography variant={isMobile ? "h6" : "h5"} mb={2} textAlign="center">
        The best timeline of all times
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
            minWidth: isMobile ? '800px' : '100%',
            width: 'fit-content',
            pb: 1,
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => {
            const date = new Date(timelineStart.getTime() + ((timelineEnd.getTime() - timelineStart.getTime()) / 9) * i);

            const dateFormat = isMobile
              ? { day: "numeric" }
              : { month: "short", day: "numeric" };

            return (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: `${(i / 9) * 100}%`,
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
              totalDays={totalDays}
              laneIndex={item.lane}
              onClick={handleItemClick}
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