export const getBoardIdsFromTank = (tank) => {
    return tank.boards.map((board) => board.id);
}
