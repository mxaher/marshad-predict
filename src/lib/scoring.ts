export function calculatePoints(
  predHome: number, predAway: number,
  actualHome: number, actualAway: number
): number {
  if (predHome === actualHome && predAway === actualAway) return 3;
  const predResult = predHome > predAway ? 'H' : predHome < predAway ? 'A' : 'D';
  const actualResult = actualHome > actualAway ? 'H' : actualHome < actualAway ? 'A' : 'D';
  return predResult === actualResult ? 2 : 0;
}
