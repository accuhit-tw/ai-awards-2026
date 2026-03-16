/**
 * 千分位格式化。
 * @param num 要格式化的值
 * @returns 格式化後的值
 */
export const thousandSeparatorFormatter = (num: number) => {
  if (num === null || num === undefined) {
    return ''
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
