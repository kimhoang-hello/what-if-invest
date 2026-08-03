/** Strided downsampling that always keeps the first and last points — used to keep long-period charts fast without losing full-precision totals (calculations still run on the full series). */
export function downsample<T>(series: T[], maxPoints = 500): T[] {
  if (series.length <= maxPoints) return series;

  const stride = Math.ceil(series.length / maxPoints);
  const result: T[] = [];
  for (let i = 0; i < series.length; i += stride) {
    result.push(series[i]);
  }
  const last = series[series.length - 1];
  if (result[result.length - 1] !== last) {
    result.push(last);
  }
  return result;
}
