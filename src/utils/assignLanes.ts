export interface TimelineItem {
  id: number;
  start: string;
  end: string;
  name: string;
  lane?: number;
}

export function assignLanes(items: TimelineItem[]): TimelineItem[] {
  const lanes: TimelineItem[][] = [];

  const sortedItems = [...items].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  sortedItems.forEach((item) => {
    let placed = false;
    for (let i = 0; i < lanes.length; i++) {
      const lane = lanes[i];
      const lastItem = lane[lane.length - 1];
      if (new Date(item.start) > new Date(lastItem.end)) {
        lane.push(item);
        item.lane = i;
        placed = true;
        break;
      }
    }
    if (!placed) {
      item.lane = lanes.length;
      lanes.push([item]);
    }
  });

  return sortedItems;
}
