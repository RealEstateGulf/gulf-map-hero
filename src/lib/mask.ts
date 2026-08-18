/**
 * Mask a sensitive string for logging/display: keep the first 4 characters,
 * replace the rest with an ellipsis. Enough to recognize/correlate a value
 * without ever writing the full thing to a log.
 *
 *   maskSensitive('a1b2c3d4e5f6') -> 'a1b2…'
 *   maskSensitive('abc')          -> '***' (too short to safely reveal 4 chars)
 */
export function maskSensitive(value: string): string {
  if (!value) return '';
  if (value.length <= 4) return '*'.repeat(value.length);
  return `${value.slice(0, 4)}…`;
}
