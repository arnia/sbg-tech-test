export function formatPrice(price: any, format: string) {
  return format === 'fraction'
    ? `${price.num}/${price.den}`
    : `${price.decimal}`
}