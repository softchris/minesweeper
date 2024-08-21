export interface Cell {
    mine: boolean;
    revealed: boolean;
    neighborMineCount: number;
    flagged?: boolean;
}