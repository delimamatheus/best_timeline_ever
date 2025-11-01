import React, { useState, useMemo } from "react";
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

type Category = "HR" | "Education" | "Translation" | "Design" | "Development" | "QA" | "Management" | string;

export const Timeline: React.FC<Props> = ({ items, setItems }) => {
  const theme = useTheme();

  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TimelineItemData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);


  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 4.0));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleItemClick = (item: TimelineItemData) => {
    if (isDragging) return;
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

  const handleItemDrop = (itemId: number, newLeft: number, timelineScrollWidth: number) => {
    setIsDragging(false);

    const itemToUpdate = items.find(i => i.id === itemId);
    if (!itemToUpdate) return;

    const msPerDay = 1000 * 60 * 60 * 24;

    const daysPerPixel = totalDaysForCalculation / timelineScrollWidth;

    const newDaysOffset = newLeft * daysPerPixel;

    const newStartDateMs = timelineStart.getTime() + newDaysOffset * msPerDay;
    const newStart = new Date(newStartDateMs);

    const durationMs = new Date(itemToUpdate.end).getTime() - new Date(itemToUpdate.start).getTime();

    const newEnd = new Date(newStartDateMs + durationMs);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const updatedItem = {
      ...itemToUpdate,
      start: formatDate(newStart),
      end: formatDate(newEnd),
    };

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? updatedItem : item
      )
    );
  };

  const handleLegendClick = (category: Category) => {
    setSelectedCategories(prevCategories => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter(cat => cat !== category);
      } else {
        return [...prevCategories, category];
      }
    });
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


  const maxLanesForCurrentTimeRange = useMemo(() => {
    const timeFilteredItems = items.filter(item => {
      const itemStart = new Date(item.start);
      const itemEnd = new Date(item.end);
      return itemStart.getTime() < timelineEnd.getTime() && itemEnd.getTime() > timelineStart.getTime();
    });

    const assignedLanes = assignLanes(timeFilteredItems);
    return assignedLanes.length;
  }, [items, timelineStart, timelineEnd]);


  const { lanes } = useMemo(() => {
    const timeFilteredItems = items.filter(item => {
      const itemStart = new Date(item.start);
      const itemEnd = new Date(item.end);
      return itemStart.getTime() < timelineEnd.getTime() && itemEnd.getTime() > timelineStart.getTime();
    });

    const categoryFilteredItems = selectedCategories.length > 0
      ? timeFilteredItems.filter(item => selectedCategories.includes(item.category))
      : timeFilteredItems;

    const assignedLanes = assignLanes(categoryFilteredItems);

    return { lanes: assignedLanes };
  }, [items, timelineStart, timelineEnd, selectedCategories]);


  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const tagsHeight = maxLanesForCurrentTimeRange > 0
    ? (maxLanesForCurrentTimeRange - 1) * VERTICAL_OVERLAP_OFFSET + ITEM_HEIGHT
    : 0;

  const calculatedMinHeight = tagsHeight + INITIAL_TOP_OFFSET;

  const adjustedMinWidth = isMobile ? `${BASE_WIDTH_MOBILE}px` : `100%`;

  const timelineRef = React.useRef<HTMLDivElement>(null);


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
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        mb: 2,
        gap: { xs: 1, sm: 0 },
      }}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          textAlign={isMobile ? "center" : "left"}
          width={{ xs: '100%', sm: 'auto' }}
        >
          The best timeline of all times
        </Typography>

        <Paper
          elevation={1}
          sx={{
            zIndex: 10,
            p: 0.5,
            position: 'static',
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
      </Box>

      <Box
        sx={{
          overflowX: "auto",
          position: 'relative',
        }}
      >
        <Box
          ref={timelineRef}
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
              onDrop={handleItemDrop}
              timelineRef={timelineRef}
              setIsDragging={setIsDragging}
              zoomLevel={zoomLevel}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <TimelineLegend
          onCategoryClick={handleLegendClick}
          selectedCategories={selectedCategories}
        />
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