import { getPosition } from "./chessboard";

export const kingValidMoves = (currentBoard, currentPosition) => {
    let { row, col } = currentPosition;
    const playerColor = getPosition(currentBoard, row, col).piece.color;
    const validMoves = [];

    const topLeft = currentBoard.find(element => element.row === row - 1 && element.col === col - 1)
    const topMiddle = currentBoard.find(element => element.row === row - 1 && element.col === col)
    const topRight = currentBoard.find(element => element.row === row - 1 && element.col === col + 1)
    const rightMiddle = currentBoard.find(element => element.row === row && element.col === col + 1)
    const bottomRight = currentBoard.find(element => element.row === row + 1 && element.col === col + 1)
    const bottomMiddle = currentBoard.find(element => element.row === row + 1 && element.col === col)
    const bottomLeft = currentBoard.find(element => element.row === row + 1 && element.col === col - 1)
    const leftMiddle = currentBoard.find(element => element.row === row && element.col === col - 1)

    const allPotentialMoves = [
        topLeft,
        topMiddle,
        topRight,
        rightMiddle,
        bottomRight,
        bottomMiddle,
        bottomLeft,
        leftMiddle
    ].filter(element => Boolean(element));

    for (const element of allPotentialMoves) {
        if (element.piece === null) {
            validMoves.push(element);
        }
        if (element.piece !== null && element.piece.color !== playerColor) {
            validMoves.push(element);
        }
    }

    return validMoves;
}