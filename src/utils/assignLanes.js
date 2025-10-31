export function assignLanes(items) {
  const lanes = [];

  const sortedItems = [...items].sort((a, b) =>
    new Date(a.start) - new Date(b.start)
  );

  sortedItems.forEach(item => {
    let placed = false;
    for (let i = 0; i < lanes.length; i++) {
      const lane = lanes[i];
      const lastItemInLane = lane[lane.length - 1];
      if (new Date(item.start) > new Date(lastItemInLane.end)) {
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
