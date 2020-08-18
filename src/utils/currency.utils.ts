export const calculateDifferenceInPercents = (start: number, end: number): number => {
    return ((start - end) / start) * 100;
}