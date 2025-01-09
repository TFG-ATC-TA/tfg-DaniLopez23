export const getBoardIdsFromTank = (tank) => {
  if (tank && tank.devices && Array.isArray(tank.devices)) {
    const boardIds = tank.devices
      .map((device) => device.boardId)
      .filter(Boolean);
    return boardIds;
  }
  return [];
};
